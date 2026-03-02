"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  LogIn,
  Settings,
  MousePointerClick,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function CancelSubscriptionPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">Cancel Subscription</h1>
              <p className="text-sm text-muted-foreground">
                How to cancel or manage your Dear Stranger subscription
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
              <Settings className="mr-2 h-4 w-4" />
              Subscription Management
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Cancel Your Subscription
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We&apos;re sorry to see you go. You can cancel your Dear Stranger
              subscription at any time with no hidden fees or penalties.
              Here&apos;s everything you need to know.
            </p>
          </motion.div>

          {/* Key Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-6 md:grid-cols-3"
          >
            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">No Penalties</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Cancel anytime without fees. No long-term contracts, no early
                  termination charges.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Keep Your Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  After cancellation, you retain full access to all features
                  until the end of your current billing period.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                  <HelpCircle className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle className="text-lg">Credits Preserved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Any purchased letter pack credits remain in your account
                  and never expire, even after cancellation.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Step-by-step Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-8">
                How to Cancel — Step by Step
              </h3>
              <div className="space-y-6">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <LogIn className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground text-lg">
                      Step 1: Sign in to Your Account
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Go to{" "}
                      <Link
                        href="/sign-in"
                        className="text-primary hover:underline font-medium"
                      >
                        Sign In
                      </Link>{" "}
                      and log in with your email address or Google account.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground text-lg">
                      Step 2: Go to Your Dashboard
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Navigate to your{" "}
                      <Link
                        href="/dashboard"
                        className="text-primary hover:underline font-medium"
                      >
                        Dashboard
                      </Link>
                      . You&apos;ll see your subscription status card showing your
                      current plan and renewal date.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MousePointerClick className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground text-lg">
                      Step 3: Click &quot;Manage Plan&quot;
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Click the &quot;Manage Plan&quot; button on your subscription
                      status card. A dialog will appear with options to manage
                      your payment methods, billing history, and plan settings.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground text-lg">
                      Step 4: Continue to Billing Portal
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Click &quot;Continue to Portal&quot; to open the secure billing
                      portal provided by our payment partner. From there, you can
                      cancel your subscription, update payment methods, or view
                      your billing history.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground text-lg">
                      Step 5: Confirm Cancellation
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      In the billing portal, select the option to cancel your
                      subscription and confirm. You&apos;ll receive a confirmation
                      email, and your subscription will remain active until the
                      end of your current billing period.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* What Happens After */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">
                What Happens After Cancellation?
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3 text-green-700">
                    What You Keep
                  </h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>
                      Full access to all features until the end of your billing
                      period
                    </li>
                    <li>
                      All unused letter pack credits (they never expire)
                    </li>
                    <li>Your account and conversation history</li>
                    <li>Ability to re-subscribe at any time</li>
                    <li>
                      Access to the free tier (3 free letters for new users)
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-destructive">
                    What Changes
                  </h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>
                      No further charges will be made to your payment method
                    </li>
                    <li>
                      Subscription-specific features end when the billing period
                      expires
                    </li>
                    <li>
                      Reply priority reverts to standard (if applicable)
                    </li>
                    <li>
                      Monthly letter quota resets (you can still use purchased
                      credits)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Important Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8 border-2 border-primary/20">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                Important Notes
              </h3>
              <div className="space-y-4 text-muted-foreground text-sm">
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    Cancel Before Renewal
                  </h4>
                  <p>
                    To avoid being charged for the next billing cycle, make sure
                    to cancel at least 24 hours before your renewal date. Your
                    renewal date is shown on your Dashboard subscription status
                    card.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    Refund Eligibility
                  </h4>
                  <p>
                    If you cancel within 7 days of your initial subscription, you
                    may be eligible for a full refund. See our{" "}
                    <Link
                      href="/refund-policy"
                      className="text-primary hover:underline font-medium"
                    >
                      Refund Policy
                    </Link>{" "}
                    for full details.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    Re-subscribing
                  </h4>
                  <p>
                    You can re-subscribe at any time by visiting the{" "}
                    <Link
                      href="/#pricing"
                      className="text-primary hover:underline font-medium"
                    >
                      Pricing
                    </Link>{" "}
                    section and choosing a new plan. Your conversation history
                    will be preserved.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Alternative to Cancelling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">
                Before You Cancel — Consider These Options
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border bg-card p-6">
                  <h4 className="font-semibold mb-2">Switch to a Lower Plan</h4>
                  <p className="text-muted-foreground text-sm">
                    If cost is a concern, you can downgrade from Unlimited
                    Letters ($9.99/mo) to Monthly Pen Pal ($4.99/mo), or switch
                    to one-time letter packs for pay-as-you-go flexibility.
                  </p>
                </div>
                <div className="rounded-xl border bg-card p-6">
                  <h4 className="font-semibold mb-2">Use Letter Packs Instead</h4>
                  <p className="text-muted-foreground text-sm">
                    If you don&apos;t write often enough for a monthly plan, letter
                    packs let you purchase credits that never expire. Write at
                    your own pace with no recurring charges.
                  </p>
                </div>
                <div className="rounded-xl border bg-card p-6">
                  <h4 className="font-semibold mb-2">Tell Us What&apos;s Wrong</h4>
                  <p className="text-muted-foreground text-sm">
                    If something about the service isn&apos;t meeting your
                    expectations, we&apos;d love to hear about it. Reach out to{" "}
                    <a
                      href="mailto:support@mindfulpenpal.com"
                      className="text-primary hover:underline"
                    >
                      support@mindfulpenpal.com
                    </a>{" "}
                    and we&apos;ll do our best to help.
                  </p>
                </div>
                <div className="rounded-xl border bg-card p-6">
                  <h4 className="font-semibold mb-2">Need Help Cancelling?</h4>
                  <p className="text-muted-foreground text-sm">
                    If you&apos;re having trouble cancelling through the portal, email
                    us at{" "}
                    <a
                      href="mailto:support@mindfulpenpal.com"
                      className="text-primary hover:underline"
                    >
                      support@mindfulpenpal.com
                    </a>{" "}
                    and we&apos;ll handle the cancellation for you.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Related Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Related Information</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <Link
                  href="/refund-policy"
                  className="rounded-xl border bg-card p-6 hover:border-primary/50 transition-colors group"
                >
                  <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    Refund Policy
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Learn about refund eligibility, processing times, and how to
                    request a refund.
                  </p>
                </Link>
                <Link
                  href="/terms"
                  className="rounded-xl border bg-card p-6 hover:border-primary/50 transition-colors group"
                >
                  <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    Terms of Service
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Full terms and conditions including payment and subscription
                    policies.
                  </p>
                </Link>
                <Link
                  href="/#pricing"
                  className="rounded-xl border bg-card p-6 hover:border-primary/50 transition-colors group"
                >
                  <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    View Plans &amp; Pricing
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Compare subscription plans and letter pack options.
                  </p>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8"
          >
            <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              Need Help Cancelling?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you&apos;re unable to cancel through the dashboard or billing
              portal, just send us an email and we&apos;ll take care of it for you.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Email us at{" "}
              <a
                href="mailto:support@mindfulpenpal.com"
                className="text-primary hover:underline font-medium"
              >
                support@mindfulpenpal.com
              </a>
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
