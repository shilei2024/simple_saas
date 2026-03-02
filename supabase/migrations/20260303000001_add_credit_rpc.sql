-- RPC helpers for Strategy C ledger with concurrency safety.
-- These functions use row locking (FOR UPDATE SKIP LOCKED) so concurrent
-- consumers don't double-spend the same credit lot.

-- Reserve exactly 1 credit usage for an email correspondence.
-- Idempotent: if credit_usage already exists for correspondence_id, returns existing row.
create or replace function public.reserve_correspondence_credit_usage(
  p_customer_id uuid,
  p_email_correspondence_id uuid,
  p_kind text,
  p_subscription_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns table(kind text, lot_id uuid)
language plpgsql
security definer
as $$
declare
  v_existing record;
  v_lot record;
begin
  -- Idempotency by unique index on credit_usage(email_correspondence_id)
  select cu.kind, cu.lot_id
    into v_existing
  from public.credit_usage cu
  where cu.email_correspondence_id = p_email_correspondence_id
  limit 1;

  if found then
    kind := v_existing.kind;
    lot_id := v_existing.lot_id;
    return next;
    return;
  end if;

  if p_kind = 'subscription' then
    insert into public.credit_usage (
      customer_id, email_correspondence_id, subscription_id, lot_id, amount, kind, metadata
    ) values (
      p_customer_id, p_email_correspondence_id, p_subscription_id, null, 1, 'subscription', p_metadata
    );

    kind := 'subscription';
    lot_id := null;
    return next;
    return;
  elsif p_kind = 'free' then
    update public.customers
      set free_credits = free_credits - 1,
          credits = credits - 1,
          updated_at = timezone('utc'::text, now())
    where id = p_customer_id
      and free_credits >= 1
      and credits >= 1;

    if not found then
      raise exception 'INSUFFICIENT_FREE_CREDITS';
    end if;

    insert into public.credit_usage (
      customer_id, email_correspondence_id, subscription_id, lot_id, amount, kind, metadata
    ) values (
      p_customer_id, p_email_correspondence_id, null, null, 1, 'free', p_metadata
    );

    kind := 'free';
    lot_id := null;
    return next;
    return;
  elsif p_kind = 'paid' then
    -- Lock one available lot FIFO
    select id, remaining_credits
      into v_lot
    from public.credit_lots
    where customer_id = p_customer_id
      and refunded_at is null
      and remaining_credits > 0
    order by created_at asc
    for update skip locked
    limit 1;

    if not found then
      raise exception 'INSUFFICIENT_PAID_CREDITS';
    end if;

    update public.credit_lots
      set remaining_credits = remaining_credits - 1,
          updated_at = timezone('utc'::text, now())
    where id = v_lot.id
      and remaining_credits > 0;

    if not found then
      raise exception 'FAILED_TO_CONSUME_LOT';
    end if;

    update public.customers
      set paid_credits = paid_credits - 1,
          credits = credits - 1,
          updated_at = timezone('utc'::text, now())
    where id = p_customer_id
      and paid_credits >= 1
      and credits >= 1;

    if not found then
      raise exception 'CUSTOMER_BALANCE_INCONSISTENT';
    end if;

    insert into public.credit_usage (
      customer_id, email_correspondence_id, subscription_id, lot_id, amount, kind, metadata
    ) values (
      p_customer_id, p_email_correspondence_id, null, v_lot.id, 1, 'paid', p_metadata || jsonb_build_object('lot_id', v_lot.id)
    );

    kind := 'paid';
    lot_id := v_lot.id;
    return next;
    return;
  else
    raise exception 'INVALID_KIND';
  end if;
end;
$$;

grant execute on function public.reserve_correspondence_credit_usage(uuid, uuid, text, uuid, jsonb) to service_role;

