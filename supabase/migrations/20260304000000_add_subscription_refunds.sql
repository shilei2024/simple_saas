-- Create subscription_refunds table to track subscription refunds
create table public.subscription_refunds (
    id uuid primary key default uuid_generate_v4(),
    subscription_id uuid references public.subscriptions(id) on delete cascade not null,
    customer_id uuid references public.customers(id) on delete cascade not null,
    creem_refund_id text unique,
    creem_subscription_id text not null,
    refund_amount numeric(10, 2),
    refund_currency text default 'USD',
    refund_reason text,
    refund_status text not null check (refund_status in ('pending', 'processing', 'completed', 'failed', 'canceled')),
    refund_type text not null check (refund_type in ('full', 'partial', 'prorated')),
    period_start timestamp with time zone,
    period_end timestamp with time zone,
    refunded_period_days integer,
    metadata jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index subscription_refunds_subscription_id_idx on public.subscription_refunds(subscription_id);
create index subscription_refunds_customer_id_idx on public.subscription_refunds(customer_id);
create index subscription_refunds_creem_refund_id_idx on public.subscription_refunds(creem_refund_id);
create index subscription_refunds_creem_subscription_id_idx on public.subscription_refunds(creem_subscription_id);
create index subscription_refunds_status_idx on public.subscription_refunds(refund_status);
create index subscription_refunds_created_at_idx on public.subscription_refunds(created_at);

-- Create updated_at trigger
create trigger handle_subscription_refunds_updated_at
    before update on public.subscription_refunds
    for each row
    execute function public.handle_updated_at();

-- RLS Policies
alter table public.subscription_refunds enable row level security;

-- Users can view their own subscription refunds
create policy "Users can view their own subscription refunds"
    on public.subscription_refunds for select
    using (
        exists (
            select 1 from public.customers
            where customers.id = subscription_refunds.customer_id
            and customers.user_id = auth.uid()
        )
    );

-- Service role can manage subscription refunds
create policy "Service role can manage subscription refunds"
    on public.subscription_refunds for all
    using (auth.role() = 'service_role');

-- Grants
grant all on public.subscription_refunds to service_role;
