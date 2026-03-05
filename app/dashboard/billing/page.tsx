import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BillingOverview } from "@/components/billing/billing-overview";
import { SubscriptionManagement } from "@/components/billing/subscription-management";
import { RefundHistory } from "@/components/billing/refund-history";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BillingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // 获取客户数据
  const { data: customerData } = await supabase
    .from("customers")
    .select(
      `
      *,
      subscriptions (
        id,
        status,
        current_period_start,
        current_period_end,
        canceled_at,
        creem_subscription_id,
        creem_product_id,
        created_at
      )
    `
    )
    .eq("user_id", user.id)
    .single();

  const subscription = customerData?.subscriptions?.[0];

  return (
    <div className="flex-1 w-full flex flex-col gap-6 sm:gap-8 px-4 sm:px-8 container py-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription, view billing history, and request refunds.
        </p>
      </div>

      {/* Billing Overview */}
      <BillingOverview customer={customerData} subscription={subscription} />

      {/* Subscription Management */}
      {subscription && (
        <SubscriptionManagement
          subscription={subscription}
          customerId={customerData?.id}
        />
      )}

      {/* Refund History */}
      <RefundHistory customerId={customerData?.id} />
    </div>
  );
}
