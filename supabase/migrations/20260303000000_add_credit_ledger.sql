-- Credit ledger for exact order-level accounting (Strategy C)
-- Adds:
--  - credit_lots: paid-credit buckets bound to Creem order_id (FIFO consumption)
--  - credit_usage: one row per "letter consumption" (free/paid/subscription)
--
-- Also backfills existing customers.paid_credits into a migration lot so
-- deduction logic can always consume from lots, even for legacy balances.

-- ──────────────────────────────────────────────
-- credit_lots
-- ──────────────────────────────────────────────
create table if not exists public.credit_lots (
    id uuid primary key default uuid_generate_v4(),
    customer_id uuid references public.customers(id) on delete cascade not null,
    source text not null check (source in ('purchase', 'admin', 'migration')),
    creem_order_id text,
    total_credits integer not null check (total_credits >= 0),
    remaining_credits integer not null check (remaining_credits >= 0 and remaining_credits <= total_credits),
    refunded_at timestamp with time zone,
    creem_refund_id text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metadata jsonb default '{}'::jsonb
);

create index if not exists credit_lots_customer_id_idx on public.credit_lots(customer_id);
create index if not exists credit_lots_creem_order_id_idx on public.credit_lots(creem_order_id);
create index if not exists credit_lots_remaining_idx on public.credit_lots(customer_id, remaining_credits);

create trigger handle_credit_lots_updated_at
    before update on public.credit_lots
    for each row
    execute function public.handle_updated_at();

-- ──────────────────────────────────────────────
-- credit_usage
-- ──────────────────────────────────────────────
create table if not exists public.credit_usage (
    id uuid primary key default uuid_generate_v4(),
    customer_id uuid references public.customers(id) on delete cascade not null,
    email_correspondence_id uuid references public.email_correspondence(id) on delete set null,
    subscription_id uuid references public.subscriptions(id) on delete set null,
    lot_id uuid references public.credit_lots(id) on delete set null,
    amount integer not null check (amount > 0),
    kind text not null check (kind in ('free', 'paid', 'subscription')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metadata jsonb default '{}'::jsonb
);

-- Exactly one "letter consumption" record per email correspondence
create unique index if not exists credit_usage_email_correspondence_id_uidx
    on public.credit_usage(email_correspondence_id)
    where email_correspondence_id is not null;

create index if not exists credit_usage_customer_id_idx on public.credit_usage(customer_id);
create index if not exists credit_usage_created_at_idx on public.credit_usage(created_at);
create index if not exists credit_usage_kind_idx on public.credit_usage(kind);
create index if not exists credit_usage_lot_id_idx on public.credit_usage(lot_id);

-- ──────────────────────────────────────────────
-- RLS
-- ──────────────────────────────────────────────
alter table public.credit_lots enable row level security;
alter table public.credit_usage enable row level security;

create policy "Users can view their own credit lots"
    on public.credit_lots for select
    using (
        exists (
            select 1 from public.customers
            where customers.id = credit_lots.customer_id
            and customers.user_id = auth.uid()
        )
    );

create policy "Users can view their own credit usage"
    on public.credit_usage for select
    using (
        exists (
            select 1 from public.customers
            where customers.id = credit_usage.customer_id
            and customers.user_id = auth.uid()
        )
    );

create policy "Service role can manage credit lots"
    on public.credit_lots for all
    using (auth.role() = 'service_role');

create policy "Service role can manage credit usage"
    on public.credit_usage for all
    using (auth.role() = 'service_role');

grant all on public.credit_lots to service_role;
grant all on public.credit_usage to service_role;

-- ──────────────────────────────────────────────
-- Backfill legacy paid_credits into lots (no order binding)
-- ──────────────────────────────────────────────
insert into public.credit_lots (customer_id, source, total_credits, remaining_credits, metadata)
select
  c.id as customer_id,
  'migration' as source,
  c.paid_credits as total_credits,
  c.paid_credits as remaining_credits,
  jsonb_build_object('reason', 'backfill_existing_paid_credits')
from public.customers c
where coalesce(c.paid_credits, 0) > 0
  and not exists (
    select 1 from public.credit_lots l
    where l.customer_id = c.id
      and l.source = 'migration'
  );

