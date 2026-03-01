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

    const expectedSignature = crypto
      .createHmac("sha256", CREEM_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.warn(
        `[Webhook] Signature mismatch — received: ${signature.substring(0, 16)}..., expected: ${expectedSignature.substring(0, 16)}...`
      );
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(body) as CreemWebhookEvent;
    console.log("[Webhook] Event:", event.eventType, "object:", event.object?.id);

    switch (event.eventType) {
      case "checkout.completed":
        await handleCheckoutCompleted(event);
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
