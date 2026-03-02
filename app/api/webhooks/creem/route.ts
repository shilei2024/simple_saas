import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { CreemWebhookEvent, CreemCustomer, CreemSubscription } from "@/types/creem";
import {
  createOrUpdateCustomer,
  createOrUpdateSubscription,
  addCreditsToCustomer,
} from "@/utils/supabase/subscriptions";
import crypto from "crypto";

const CREEM_WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    console.log("[Webhook] Received POST, body length:", body.length);

    const headersList = headers();
    const signature = (await headersList).get("creem-signature") || "";

    if (!CREEM_WEBHOOK_SECRET) {
      console.error("[Webhook] CREEM_WEBHOOK_SECRET is not configured");
      return new NextResponse("Server not configured", { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", CREEM_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    const looksLikeHex = /^[0-9a-f]{64}$/i.test(signature);
    if (!looksLikeHex) {
      console.warn("[Webhook] Invalid signature format");
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expectedSignature, "hex");
    const matches =
      sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);

    if (!matches) {
      console.warn(
        `[Webhook] Signature mismatch — received: ${signature.substring(0, 16)}...`
      );
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(body) as CreemWebhookEvent;
    console.log("[Webhook] Event:", event.eventType, "object:", event.object?.id);

    switch (event.eventType) {
      case "checkout.completed":
        await handleCheckoutCompleted(event);
        break;
      case "refund.created":
        await handleRefundCreated(event);
        break;
      case "subscription.active":
        await handleSubscriptionEvent(event);
        break;
      case "subscription.paid":
        await handleSubscriptionEvent(event);
        break;
      case "subscription.canceled":
        await handleSubscriptionEvent(event);
        break;
      case "subscription.expired":
        await handleSubscriptionEvent(event);
        break;
      case "subscription.trialing":
        await handleSubscriptionEvent(event);
        break;
      default:
        console.log(`[Webhook] Unhandled event type: ${event.eventType}`);
    }

    console.log("[Webhook] Successfully processed:", event.eventType);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Processing error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Webhook processing failed", details: errorMessage },
      { status: 500 }
    );
  }
}

function resolveCustomer(raw: any): Record<string, any> | null {
  if (typeof raw === "object" && raw !== null && raw.id && raw.email) {
    return raw;
  }
  return null;
}

function resolveOrderId(raw: any): string | null {
  if (!raw || typeof raw !== "object") return null;
  return (
    raw.order?.id ||
    raw.order_id ||
    raw.orderId ||
    raw.orderID ||
    null
  );
}

async function handleCheckoutCompleted(event: CreemWebhookEvent) {
  const checkout = event.object;
  console.log("[Webhook] Processing checkout.completed:", checkout.id);

  if (!checkout.metadata?.user_id) {
    console.error("[Webhook] Missing user_id in checkout metadata");
    throw new Error("user_id is required in checkout metadata");
  }

  const customerId = await createOrUpdateCustomer(
    checkout.customer,
    checkout.metadata.user_id
  );

  if (checkout.metadata?.product_type === "credits") {
    const credits = Number(checkout.metadata?.credits) || 0;
    if (credits <= 0) {
      console.error("[Webhook] Invalid credit amount in metadata:", checkout.metadata?.credits);
      throw new Error("Invalid credit amount in checkout metadata");
    }
    await addCreditsToCustomer(
      customerId,
      credits,
      checkout.order?.id,
      `Purchased ${credits} credits`
    );
    console.log(`[Webhook] Added ${credits} credits to customer ${customerId}`);
  } else if (checkout.subscription) {
    await createOrUpdateSubscription(checkout.subscription, customerId);
    console.log(`[Webhook] Created/updated subscription for customer ${customerId}`);
  }
}

async function handleRefundCreated(event: CreemWebhookEvent) {
  const refund = event.object;
  const refundId = refund?.id || event.id;
  const orderId = resolveOrderId(refund);

  console.log("[Webhook] Processing refund.created:", refundId, "order:", orderId);

  if (!orderId) {
    console.warn("[Webhook] refund.created missing order id; skipping");
    return;
  }

  const { createServiceRoleClient } = await import("@/utils/supabase/service-role");
  const supabase = createServiceRoleClient();

  // Find all non-refunded lots for this order
  const { data: lots, error: lotsError } = await supabase
    .from("credit_lots")
    .select("id, customer_id, total_credits, remaining_credits, refunded_at")
    .eq("creem_order_id", orderId)
    .is("refunded_at", null);

  if (lotsError) throw lotsError;
  if (!lots || lots.length === 0) {
    console.log("[Webhook] No credit lots found for refunded order; nothing to do.");
    return;
  }

  const now = new Date().toISOString();
  const customerId = lots[0].customer_id as string;
  const refundableRemaining = lots.reduce(
    (sum, l) => sum + (Number(l.remaining_credits) || 0),
    0
  );

  // Mark lots as refunded and zero-out remaining credits
  const lotIds = lots.map((l) => l.id);
  const { error: updateLotsError } = await supabase
    .from("credit_lots")
    .update({
      remaining_credits: 0,
      refunded_at: now,
      creem_refund_id: refundId,
      updated_at: now,
    })
    .in("id", lotIds);
  if (updateLotsError) throw updateLotsError;

  if (refundableRemaining > 0) {
    // Decrease visible balances (paid + total) by the refundable remaining amount
    const { data: cust, error: custError } = await supabase
      .from("customers")
      .select("credits, paid_credits")
      .eq("id", customerId)
      .single();
    if (custError) throw custError;

    const paidBefore = Number(cust?.paid_credits || 0);
    const totalBefore = Number(cust?.credits || 0);
    const paidAfter = Math.max(0, paidBefore - refundableRemaining);
    const totalAfter = Math.max(0, totalBefore - refundableRemaining);

    const { error: custUpdateError } = await supabase
      .from("customers")
      .update({
        paid_credits: paidAfter,
        credits: totalAfter,
        updated_at: now,
      })
      .eq("id", customerId);
    if (custUpdateError) throw custUpdateError;

    // Record a balance adjustment
    await supabase.from("credits_history").insert({
      customer_id: customerId,
      amount: refundableRemaining,
      type: "subtract",
      description: `Refund processed for order ${orderId}`,
      creem_order_id: orderId,
      metadata: {
        reason: "refund",
        creem_refund_id: refundId,
        lot_ids: lotIds,
        paid_credits_before: paidBefore,
        paid_credits_after: paidAfter,
        credits_before: totalBefore,
        credits_after: totalAfter,
        note:
          lots.some((l) => Number(l.remaining_credits || 0) < Number(l.total_credits || 0))
            ? "Order credits were partially used; only remaining credits were removed."
            : "All remaining credits for this order were removed.",
      },
    });
  }
}

async function handleSubscriptionEvent(event: CreemWebhookEvent) {
  const subscription = event.object;
  console.log(`[Webhook] Processing ${event.eventType}:`, subscription.id);

  const customer = resolveCustomer(subscription.customer);

  if (customer) {
    const customerId = await createOrUpdateCustomer(
      customer as CreemCustomer,
      subscription.metadata?.user_id
    );
    await createOrUpdateSubscription(subscription as CreemSubscription, customerId);
  } else if (subscription.metadata?.user_id) {
    const { createServiceRoleClient } = await import("@/utils/supabase/service-role");
    const supabase = createServiceRoleClient();

    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("user_id", subscription.metadata.user_id)
      .single();

    if (existingCustomer) {
      await createOrUpdateSubscription(subscription as CreemSubscription, existingCustomer.id);
    } else {
      console.error(
        `[Webhook] Cannot process ${event.eventType}: customer is a string ID and no user_id in metadata`
      );
    }
  } else {
    console.error(
      `[Webhook] Cannot process ${event.eventType}: unable to resolve customer`
    );
  }
}
