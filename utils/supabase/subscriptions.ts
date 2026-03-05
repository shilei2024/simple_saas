import { createServiceRoleClient } from "./service-role";
import { CreemCustomer, CreemSubscription } from "@/types/creem";

export async function createOrUpdateCustomer(
  creemCustomer: CreemCustomer,
  userId?: string
) {
  const supabase = createServiceRoleClient();

  let existingCustomer = null;

  // 1. Try finding by user_id if provided
  // This handles the transition from 'auto_' ID to 'cust_' ID
  if (userId) {
    const { data, error } = await supabase
      .from("customers")
      .select()
      .eq("user_id", userId)
      .single();

    if (!error) {
      existingCustomer = data;
    } else if (error.code !== "PGRST116") {
      throw error;
    }
  }

  // 2. If not found by user_id (or user_id missing), try finding by creem_customer_id
  // This handles webhooks that might not have user_id metadata (e.g. renewals)
  if (!existingCustomer) {
    const { data, error } = await supabase
      .from("customers")
      .select()
      .eq("creem_customer_id", creemCustomer.id)
      .single();

    if (!error) {
      existingCustomer = data;
    } else if (error.code !== "PGRST116") {
      throw error;
    }
  }

  if (existingCustomer) {
    // If found, update the record
    const { error } = await supabase
      .from("customers")
      .update({
        creem_customer_id: creemCustomer.id, // Ensure we have the latest Creem ID
        email: creemCustomer.email,
        name: creemCustomer.name,
        country: creemCustomer.country,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingCustomer.id);

    if (error) throw error;
    return existingCustomer.id;
  }

  // 3. If still not found, we need a user_id to create a new record
  if (!userId) {
    throw new Error("Cannot create customer: user_id is missing from webhook metadata");
  }

  // Insert new customer
  const { data: newCustomer, error } = await supabase
    .from("customers")
    .insert({
      user_id: userId,
      creem_customer_id: creemCustomer.id,
      email: creemCustomer.email,
      name: creemCustomer.name,
      country: creemCustomer.country,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return newCustomer.id;
}

export async function createOrUpdateSubscription(
  creemSubscription: CreemSubscription,
  customerId: string
) {
  const supabase = createServiceRoleClient();

  const { data: existingSubscription, error: fetchError } = await supabase
    .from("subscriptions")
    .select()
    .eq("creem_subscription_id", creemSubscription.id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw fetchError;
  }

  // Map Creem statuses to DB-compatible statuses
  // Creem may send "paid" which is not in the DB check constraint; treat it as "active"
  const STATUS_MAP: Record<string, string> = {
    paid: "active",
  };
  const rawStatus = creemSubscription?.status || "active";
  const mappedStatus = STATUS_MAP[rawStatus] || rawStatus;

  const subscriptionData = {
    customer_id: customerId,
    creem_product_id:
      typeof creemSubscription?.product === "string"
        ? creemSubscription?.product
        : creemSubscription?.product?.id,
    status: mappedStatus,
    current_period_start: creemSubscription?.current_period_start_date,
    current_period_end: creemSubscription?.current_period_end_date,
    canceled_at: creemSubscription?.canceled_at,
    metadata: creemSubscription?.metadata,
    updated_at: new Date().toISOString(),
  };

  if (existingSubscription) {
    const { error } = await supabase
      .from("subscriptions")
      .update(subscriptionData)
      .eq("id", existingSubscription.id);

    if (error) throw error;
    return existingSubscription.id;
  }

  const { data: newSubscription, error } = await supabase
    .from("subscriptions")
    .insert({
      ...subscriptionData,
      creem_subscription_id: creemSubscription.id,
    })
    .select()
    .single();

  if (error) throw error;
  return newSubscription.id;
}

export async function getUserSubscription(userId: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      `
      *,
      customers!inner(user_id)
    `
    )
    .eq("customers.user_id", userId)
    .eq("status", "active")
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

export async function addCreditsToCustomer(
  customerId: string,
  credits: number,
  creemOrderId?: string,
  description?: string
) {
  const supabase = createServiceRoleClient();

  const { data: client, error: fetchError } = await supabase
    .from("customers")
    .select("credits, paid_credits")
    .eq("id", customerId)
    .single();
  if (fetchError) throw fetchError;
  if (!client) throw new Error("Customer not found");

  const newCredits = (client.credits || 0) + credits;
  const newPaidCredits = (client.paid_credits || 0) + credits;

  const { error: updateError } = await supabase
    .from("customers")
    .update({
      credits: newCredits,
      paid_credits: newPaidCredits,
      updated_at: new Date().toISOString(),
    })
    .eq("id", customerId);

  if (updateError) throw updateError;

  // Create a paid-credit lot bound to this order (Strategy C ledger)
  // Note: For legacy systems this may be missing an orderId; still create a lot so FIFO consumption works.
  const { error: lotError } = await supabase.from("credit_lots").insert({
    customer_id: customerId,
    source: creemOrderId ? "purchase" : "migration",
    creem_order_id: creemOrderId || null,
    total_credits: credits,
    remaining_credits: credits,
    metadata: {
      reason: "credits_purchase",
      creem_order_id: creemOrderId || null,
    },
  });
  if (lotError) throw lotError;

  const { error: historyError } = await supabase
    .from("credits_history")
    .insert({
      customer_id: customerId,
      amount: credits,
      type: "add",
      description: description || "Credits purchase",
      creem_order_id: creemOrderId,
      metadata: {
        credit_type: "paid",
        credits_before: client.credits,
        credits_after: newCredits,
        paid_credits_before: client.paid_credits,
        paid_credits_after: newPaidCredits,
      },
    });

  if (historyError) throw historyError;

  return newCredits;
}

export async function useCredits(
  customerId: string,
  credits: number,
  description: string
) {
  const supabase = createServiceRoleClient();

  const { data: client, error: fetchError } = await supabase
    .from("customers")
    .select("credits, free_credits, paid_credits")
    .eq("id", customerId)
    .single();
  if (fetchError) throw fetchError;
  if (!client) throw new Error("Customer not found");

  const totalAvailable = (client.free_credits || 0) + (client.paid_credits || 0);
  if (totalAvailable < credits) throw new Error("Insufficient credits");

  let freeToDeduct = Math.min(client.free_credits || 0, credits);
  let paidToDeduct = credits - freeToDeduct;
  const creditType = freeToDeduct > 0 ? "free" : "paid";

  const newFreeCredits = (client.free_credits || 0) - freeToDeduct;
  const newPaidCredits = (client.paid_credits || 0) - paidToDeduct;
  const newCredits = newFreeCredits + newPaidCredits;

  const { error: updateError } = await supabase
    .from("customers")
    .update({
      credits: newCredits,
      free_credits: newFreeCredits,
      paid_credits: newPaidCredits,
      updated_at: new Date().toISOString(),
    })
    .eq("id", customerId);

  if (updateError) throw updateError;

  const { error: historyError } = await supabase
    .from("credits_history")
    .insert({
      customer_id: customerId,
      amount: credits,
      type: "subtract",
      description,
      metadata: {
        credit_type: creditType,
        free_deducted: freeToDeduct,
        paid_deducted: paidToDeduct,
      },
    });

  if (historyError) throw historyError;

  return newCredits;
}

export async function getCustomerCredits(customerId: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("customers")
    .select("credits")
    .eq("id", customerId)
    .single();

  if (error) throw error;
  return data?.credits || 0;
}

export async function getCreditsHistory(customerId: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("credits_history")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Process subscription refund
 * This function handles subscription refunds by:
 * 1. Creating a refund record
 * 2. Calculating prorated refund if needed
 * 3. Updating subscription status if necessary
 */
export async function processSubscriptionRefund(
  subscriptionId: string,
  refundData: {
    creemRefundId: string;
    creemSubscriptionId: string;
    refundAmount?: number;
    refundCurrency?: string;
    refundReason?: string;
    refundType: "full" | "partial" | "prorated";
    periodStart?: string;
    periodEnd?: string;
    refundedPeriodDays?: number;
    metadata?: Record<string, any>;
  }
) {
  const supabase = createServiceRoleClient();

  // Get subscription details
  const { data: subscription, error: subError } = await supabase
    .from("subscriptions")
    .select("*, customers!inner(id, user_id)")
    .eq("id", subscriptionId)
    .single();

  if (subError) throw subError;
  if (!subscription) throw new Error("Subscription not found");

  const customerId = subscription.customer_id as string;
  const now = new Date().toISOString();

  // Calculate refund period if not provided
  let periodStart = refundData.periodStart;
  let periodEnd = refundData.periodEnd;
  let refundedPeriodDays = refundData.refundedPeriodDays;

  if (!periodStart && subscription.current_period_start) {
    periodStart = subscription.current_period_start;
  }
  if (!periodEnd && subscription.current_period_end) {
    periodEnd = subscription.current_period_end;
  }

  if (!refundedPeriodDays && periodStart && periodEnd) {
    const start = new Date(periodStart);
    const end = new Date(periodEnd);
    const nowDate = new Date();
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const usedDays = Math.ceil((nowDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    refundedPeriodDays = Math.max(0, totalDays - usedDays);
  }

  // Create refund record
  const { data: refundRecord, error: refundError } = await supabase
    .from("subscription_refunds")
    .insert({
      subscription_id: subscriptionId,
      customer_id: customerId,
      creem_refund_id: refundData.creemRefundId,
      creem_subscription_id: refundData.creemSubscriptionId,
      refund_amount: refundData.refundAmount || null,
      refund_currency: refundData.refundCurrency || "USD",
      refund_reason: refundData.refundReason || null,
      refund_status: "processing",
      refund_type: refundData.refundType,
      period_start: periodStart || null,
      period_end: periodEnd || null,
      refunded_period_days: refundedPeriodDays || null,
      metadata: refundData.metadata || {},
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (refundError) throw refundError;

  // Update refund status to completed
  const { error: updateError } = await supabase
    .from("subscription_refunds")
    .update({
      refund_status: "completed",
      updated_at: now,
    })
    .eq("id", refundRecord.id);

  if (updateError) throw updateError;

  // Record refund in credits_history for tracking
  await supabase.from("credits_history").insert({
    customer_id: customerId,
    amount: 0, // Subscription refunds don't affect credits directly
    type: "subtract",
    description: `Subscription refund processed: ${refundData.refundType} refund`,
    created_at: now,
    metadata: {
      reason: "subscription_refund",
      creem_refund_id: refundData.creemRefundId,
      creem_subscription_id: refundData.creemSubscriptionId,
      subscription_id: subscriptionId,
      refund_type: refundData.refundType,
      refund_amount: refundData.refundAmount,
      refund_currency: refundData.refundCurrency,
      period_start: periodStart,
      period_end: periodEnd,
      refunded_period_days: refundedPeriodDays,
    },
  });

  return refundRecord;
}

/**
 * Get subscription refunds for a customer
 */
export async function getSubscriptionRefunds(customerId: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("subscription_refunds")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get subscription refunds for a subscription
 */
export async function getSubscriptionRefundsBySubscription(subscriptionId: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("subscription_refunds")
    .select("*")
    .eq("subscription_id", subscriptionId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}