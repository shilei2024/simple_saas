import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionStatusCard } from "@/components/dashboard/subscription-status-card";
import { CreditsBalanceCard } from "@/components/dashboard/credits-balance-card";
import { Mail, PenLine, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: customerData } = await supabase
    .from("customers")
    .select(
      `
      *,
      subscriptions (
        status,
        current_period_end,
        creem_product_id
      ),
      credits_history (
        amount,
        type,
        created_at
      )
    `
    )
    .eq("user_id", user.id)
    .single();

  const subscription = customerData?.subscriptions?.[0];
  const credits = customerData?.credits || 0;
  const recentCreditsHistory = customerData?.credits_history?.slice(0, 5) || [];

  const totalLettersSent = recentCreditsHistory.filter(
    (h: any) => h.type === "subtract"
  ).length;

  return (
    <div className="flex-1 w-full flex flex-col gap-6 sm:gap-8 px-4 sm:px-8 container">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border rounded-lg p-6 sm:p-8 mt-6 sm:mt-8">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg hidden sm:block">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">
              Welcome back,{" "}
              {customerData?.name || user.email?.split("@")[0]}
            </h1>
            <p className="text-muted-foreground">
              Your pen pal is here whenever you need to write. Check your
              letter balance and recent correspondence below.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <PenLine className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Letters Available
            </span>
          </div>
          <p className="text-2xl font-bold">{credits}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Letters Sent</span>
          </div>
          <p className="text-2xl font-bold">{totalLettersSent}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Avg. Reply</span>
          </div>
          <p className="text-2xl font-bold">~4h</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Member Since</span>
          </div>
          <p className="text-2xl font-bold">
            {customerData?.created_at
              ? new Date(customerData.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "Today"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CreditsBalanceCard
          credits={credits}
          recentHistory={recentCreditsHistory}
        />
        <SubscriptionStatusCard subscription={subscription} />
      </div>

      {/* Write a Letter CTA */}
      <div className="border border-dashed rounded-lg p-8 md:p-10 flex flex-col items-center justify-center text-center bg-muted/20">
        <Button asChild size="lg" className="h-12 px-8 text-base gap-2 mb-5">
          <a href="mailto:penpal@mindfulpenpal.com?subject=Hello%20Stranger">
            <PenLine className="h-5 w-5" />
            Write Your Letter
          </a>
        </Button>
        <h3 className="text-xl font-semibold mb-2">
          Ready to write a letter?
        </h3>
        <p className="text-muted-foreground text-sm max-w-md">
          Your pen pal is here, patient and ready to listen. Write about your
          day, a worry, a dream, or anything on your mind. Click the button
          above — it will open your email app with everything pre-filled.
        </p>
      </div>
    </div>
  );
}
