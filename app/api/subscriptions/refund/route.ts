import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  getSubscriptionRefunds,
  getSubscriptionRefundsBySubscription,
} from "@/utils/supabase/subscriptions";

/**
 * GET /api/subscriptions/refund
 * Get refund history for the current user's subscriptions
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get customer ID
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (customerError || !customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Get subscription_id or customer_id from query params if provided
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get("subscription_id");
    const customerIdParam = searchParams.get("customer_id");

    let refunds;
    if (subscriptionId) {
      refunds = await getSubscriptionRefundsBySubscription(subscriptionId);
    } else if (customerIdParam && customerIdParam === customer.id) {
      // Allow customer_id parameter for convenience
      refunds = await getSubscriptionRefunds(customerIdParam);
    } else {
      refunds = await getSubscriptionRefunds(customer.id);
    }

    return NextResponse.json({ refunds });
  } catch (error) {
    console.error("[API] Error fetching subscription refunds:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch refunds", details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * POST /api/subscriptions/refund
 * Request a subscription refund
 * Note: Actual refund processing is handled via Creem webhooks.
 * This endpoint can be used to initiate refund requests or check refund eligibility.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subscription_id, reason } = body;

    if (!subscription_id) {
      return NextResponse.json(
        { error: "subscription_id is required" },
        { status: 400 }
      );
    }

    // Get customer and subscription
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("id, creem_customer_id")
      .eq("user_id", user.id)
      .single();

    if (customerError || !customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const { createServiceRoleClient } = await import("@/utils/supabase/service-role");
    const serviceSupabase = createServiceRoleClient();

    const { data: subscription, error: subError } = await serviceSupabase
      .from("subscriptions")
      .select("*")
      .eq("id", subscription_id)
      .eq("customer_id", customer.id)
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: "Subscription not found or access denied" },
        { status: 404 }
      );
    }

    // Check if subscription is eligible for refund
    if (subscription.status !== "active" && subscription.status !== "canceled") {
      return NextResponse.json(
        { error: "Subscription is not eligible for refund" },
        { status: 400 }
      );
    }

    // Check if already refunded
    const existingRefunds = await getSubscriptionRefundsBySubscription(subscription_id);
    if (existingRefunds && existingRefunds.length > 0) {
      const completedRefunds = existingRefunds.filter(
        (r) => r.refund_status === "completed"
      );
      if (completedRefunds.length > 0) {
        return NextResponse.json(
          { error: "Subscription has already been refunded" },
          { status: 400 }
        );
      }
    }

    // Return information about refund eligibility
    // Actual refund processing should be done through:
    // 1. Creem customer portal (recommended for users)
    // 2. Creem webhook (automatic processing)
    // 3. Manual admin processing via Creem dashboard

    return NextResponse.json({
      message: "Refund request received",
      instructions: [
        "Refunds are typically processed through the Creem customer portal.",
        "You can access the portal via the 'Manage Plan' button in your dashboard.",
        "Alternatively, contact support for assistance with refunds.",
      ],
      subscription: {
        id: subscription.id,
        status: subscription.status,
        creem_subscription_id: subscription.creem_subscription_id,
      },
      refund_eligibility: {
        eligible: true,
        reason: reason || "Customer requested refund",
      },
    });
  } catch (error) {
    console.error("[API] Error processing subscription refund request:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to process refund request", details: errorMessage },
      { status: 500 }
    );
  }
}
