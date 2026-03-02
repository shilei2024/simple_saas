"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  RefreshCcw,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  CreditCard,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

export default function RefundPolicyPage() {
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
              <h1 className="text-xl font-bold">Refund Policy</h1>
              <p className="text-sm text-muted-foreground">
                Our commitment to fair and transparent refunds
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
              <ShieldCheck className="mr-2 h-4 w-4" />
              Fair & Transparent
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Refund Policy
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We want you to be completely satisfied with Dear Stranger. If
              something isn&apos;t right, we&apos;re here to help. Below you&apos;ll find our
              complete refund policy covering subscriptions, letter packs, and
              one-time purchases.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Last updated:</strong> March 3, 2026
            </p>
          </motion.div>

          {/* Quick Summary Cards */}
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
                <CardTitle className="text-lg">Eligible for Refund</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li>Subscription within first 7 days</li>
                  <li>Unused letter packs (no letters sent)</li>
                  <li>Technical issues preventing service use</li>
                  <li>Duplicate or accidental charges</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="text-lg">Not Eligible</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li>Letters already sent and replied to</li>
                  <li>Partially used letter packs</li>
                  <li>Subscription after 7-day window</li>
                  <li>Dissatisfaction with AI reply content</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li>Response within 24–48 hours</li>
                  <li>Refund processed in 5–10 business days</li>
                  <li>Refund to original payment method</li>
                  <li>Email confirmation sent upon approval</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subscription Refunds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <RefreshCcw className="h-6 w-6 text-primary" />
                Subscription Refunds
              </h3>
              <div className="space-y-6 text-muted-foreground text-sm">
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    7-Day Satisfaction Guarantee
                  </h4>
                  <p>
                    If you subscribe to any of our monthly plans (Monthly Pen Pal
                    at $4.99/month or Unlimited Letters at $9.99/month) and find
                    the service isn&apos;t right for you, you may request a full
                    refund within 7 days of your initial subscription purchase.
                    This applies only to your first subscription period.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    After 7 Days
                  </h4>
                  <p>
                    After the initial 7-day window, subscription payments are
                    non-refundable. However, you can{" "}
                    <Link
                      href="/cancel-subscription"
                      className="text-primary hover:underline font-medium"
                    >
                      cancel your subscription
                    </Link>{" "}
                    at any time, and you will retain access to all features until
                    the end of your current billing period. No further charges
                    will be made after cancellation.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    Renewal Charges
                  </h4>
                  <p>
                    Subscriptions renew automatically. If you were charged for a
                    renewal you did not intend, please contact us within 48 hours
                    of the charge. We will review the case and may issue a refund
                    if the subscription has not been significantly used during the
                    new billing period.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Letter Pack / One-Time Purchase Refunds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-primary" />
                Letter Pack &amp; One-Time Purchase Refunds
              </h3>
              <div className="space-y-6 text-muted-foreground text-sm">
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    Unused Letter Packs
                  </h4>
                  <p>
                    If you purchased a letter pack (Single Letter at $1.00, 3
                    Letters at $2.49, 10 Letters at $6.99, or 25 Letters at
                    $14.99) and have not used any of the credits, you may request
                    a full refund within 30 days of purchase.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    Partially Used Letter Packs
                  </h4>
                  <p>
                    Once you have sent a letter and received a reply using your
                    letter pack credits, the pack is considered partially used and
                    is generally not eligible for a refund. If you experience a
                    technical issue that consumed a credit without delivering a
                    reply, please contact us — we will restore the credit or issue
                    a partial refund.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    Duplicate Charges
                  </h4>
                  <p>
                    If you were charged more than once for the same purchase, we
                    will promptly refund the duplicate charge in full. Please
                    contact us with your payment confirmation or receipt.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Technical Issues */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8 border-2 border-primary/20">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <HelpCircle className="h-6 w-6 text-amber-500" />
                Technical Issues &amp; Exceptions
              </h3>
              <div className="space-y-4 text-muted-foreground text-sm">
                <p>
                  We understand that technical problems can happen. If you
                  experience any of the following, we will work with you to
                  provide a credit restoration, service extension, or refund:
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong>Service outage:</strong> If a system outage on our end
                    prevented you from using the service during your subscription
                    period, we may extend your subscription or issue a prorated
                    refund.
                  </li>
                  <li>
                    <strong>Failed delivery:</strong> If you sent a letter but
                    never received a reply due to a technical error, we will
                    restore the letter credit at no cost.
                  </li>
                  <li>
                    <strong>Payment processing error:</strong> If a payment was
                    processed incorrectly (wrong amount, unauthorized charge,
                    etc.), we will correct the charge and issue a refund for any
                    excess amount.
                  </li>
                  <li>
                    <strong>Account access issues:</strong> If you are unable to
                    access your account and therefore cannot use purchased
                    credits, please contact support so we can resolve access and,
                    if needed, extend your subscription or credit expiry.
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* How to Request a Refund */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                How to Request a Refund
              </h3>
              <div className="space-y-6 text-muted-foreground text-sm">
                <p>
                  To request a refund, please follow these steps:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border bg-card p-6">
                    <div className="text-2xl font-bold text-primary mb-2">1</div>
                    <h4 className="font-semibold mb-2 text-foreground">
                      Send an Email
                    </h4>
                    <p>
                      Email us at{" "}
                      <a
                        href="mailto:support@mindfulpenpal.com"
                        className="text-primary hover:underline font-medium"
                      >
                        support@mindfulpenpal.com
                      </a>{" "}
                      with the subject line &quot;Refund Request&quot;. Include your
                      account email address and the reason for your request.
                    </p>
                  </div>
                  <div className="rounded-xl border bg-card p-6">
                    <div className="text-2xl font-bold text-primary mb-2">2</div>
                    <h4 className="font-semibold mb-2 text-foreground">
                      Provide Details
                    </h4>
                    <p>
                      Include the date of purchase, the product or plan you
                      purchased, and any relevant payment confirmation or receipt
                      number to help us locate your transaction quickly.
                    </p>
                  </div>
                  <div className="rounded-xl border bg-card p-6">
                    <div className="text-2xl font-bold text-primary mb-2">3</div>
                    <h4 className="font-semibold mb-2 text-foreground">
                      We Review Your Request
                    </h4>
                    <p>
                      Our support team will review your request and respond within
                      24–48 hours. We may ask for additional information if needed
                      to process your refund.
                    </p>
                  </div>
                  <div className="rounded-xl border bg-card p-6">
                    <div className="text-2xl font-bold text-primary mb-2">4</div>
                    <h4 className="font-semibold mb-2 text-foreground">
                      Refund Processed
                    </h4>
                    <p>
                      Once approved, your refund will be processed to your
                      original payment method within 5–10 business days. You will
                      receive an email confirmation when the refund is issued.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chargebacks & Disputes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">
                Chargebacks &amp; Payment Disputes
              </h3>
              <div className="space-y-4 text-muted-foreground text-sm">
                <p>
                  We encourage you to contact us directly before filing a
                  chargeback or payment dispute with your bank or credit card
                  company. We are committed to resolving issues quickly and
                  fairly.
                </p>
                <p>
                  If a chargeback is filed, we will provide transaction records
                  and service usage data to the payment processor. Filing a
                  chargeback for a legitimately provided service may result in
                  account suspension.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Related Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Related Information</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <Link
                  href="/cancel-subscription"
                  className="rounded-xl border bg-card p-6 hover:border-primary/50 transition-colors group"
                >
                  <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    Cancel Subscription
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Step-by-step guide to cancelling your subscription plan.
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
                    Full terms and conditions governing your use of Dear
                    Stranger.
                  </p>
                </Link>
                <Link
                  href="/privacy"
                  className="rounded-xl border bg-card p-6 hover:border-primary/50 transition-colors group"
                >
                  <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    Privacy Policy
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    How we collect, use, and protect your personal data.
                  </p>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you have questions about our refund policy or need assistance
              with a refund, our support team is here to help.
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
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
