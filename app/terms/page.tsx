"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  FileText,
  Scale,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  CreditCard,
  RefreshCcw,
  Ban,
  ShieldCheck,
} from "lucide-react";

export default function TermsPage() {
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
              <h1 className="text-xl font-bold">Terms of Service</h1>
              <p className="text-sm text-muted-foreground">
                Terms and conditions for using Dear Stranger
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
              <Scale className="mr-2 h-4 w-4" />
              Legal Terms
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Terms of Service
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These terms govern your use of Dear Stranger, the AI pen pal
              service. By using our service, you agree to these terms.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Last updated:</strong> March 1, 2026
            </p>
          </motion.div>

          {/* Key Points */}
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
                <CardTitle className="text-lg">What You Can Do</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Write letters to your AI pen pal, receive thoughtful replies,
                  practice language skills, and find a safe space for your
                  thoughts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="text-lg">What You Cannot Do</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Use the service for illegal activities, harass or threaten
                  others, attempt to extract or reverse-engineer our AI system,
                  or misrepresent AI replies as human-written.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Our Commitment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Provide warm, thoughtful AI replies, protect your privacy,
                  be transparent about our AI nature, and include crisis
                  resources when needed.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Service Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                Our Service
              </h3>
              <div className="space-y-4 text-muted-foreground text-sm">
                <p>
                  Dear Stranger is an AI-powered pen pal service. You write
                  letters (via email or our platform), and our AI generates
                  warm, thoughtful replies delivered to your inbox hours later.
                  Our service includes:
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong>Free Trial:</strong> Your first 3 letters and
                    replies are free, no credit card required.
                  </li>
                  <li>
                    <strong>Letter Packs:</strong> One-time purchases of letter
                    bundles that never expire.
                  </li>
                  <li>
                    <strong>Subscriptions:</strong> Monthly plans with a set
                    number of letters or unlimited writing.
                  </li>
                  <li>
                    <strong>Conversation Continuity:</strong> Your pen pal
                    remembers previous correspondence to maintain a meaningful
                    ongoing conversation.
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Important Disclaimers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8 border-2 border-primary/20">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                Important Disclaimers
              </h3>
              <div className="space-y-4 text-muted-foreground text-sm">
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    Dear Stranger Is an AI, Not a Human
                  </h4>
                  <p>
                    All replies are generated by artificial intelligence. While
                    we strive to make responses empathetic and thoughtful, your
                    pen pal is not a real person. We are transparent about this
                    and do not attempt to deceive users.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    Not a Mental Health Service
                  </h4>
                  <p>
                    Dear Stranger is not a licensed therapist, counselor, or
                    medical professional. Our service does not provide medical
                    advice, diagnosis, or treatment. If you are experiencing a
                    mental health crisis, suicidal thoughts, or thoughts of
                    self-harm, please contact emergency services or a crisis
                    helpline immediately:
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li>
                      USA: National Suicide Prevention Lifeline — 988
                    </li>
                    <li>
                      International: Crisis Text Line — Text HOME to 741741
                    </li>
                    <li>
                      UK: Samaritans — 116 123
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    AI Limitations
                  </h4>
                  <p>
                    AI-generated replies may occasionally be inaccurate,
                    inappropriate, or not fully aligned with your expectations.
                    We continuously improve our system but cannot guarantee
                    perfection in every response.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* User Responsibilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">
                Your Responsibilities
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3 text-green-700">
                    Acceptable Use
                  </h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>
                      Write letters for personal reflection, emotional
                      expression, or language practice
                    </li>
                    <li>
                      Provide accurate information when creating an account
                    </li>
                    <li>Keep your account credentials secure</li>
                    <li>
                      Be at least 13 years old (or the minimum age required in
                      your jurisdiction)
                    </li>
                    <li>Report any issues or concerns to our support team</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-destructive">
                    Prohibited Activities
                  </h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>
                      Using the service to generate content for illegal
                      purposes
                    </li>
                    <li>
                      Attempting to reverse-engineer, extract, or replicate our
                      AI system
                    </li>
                    <li>
                      Sharing or republishing AI replies as human-written
                      content
                    </li>
                    <li>
                      Using automated tools to send bulk letters
                    </li>
                    <li>
                      Sharing account credentials with others
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-primary" />
                Payment and Billing Terms
              </h3>
              <div className="space-y-6 text-muted-foreground text-sm">
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">
                    Pricing &amp; Purchases
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      <strong>Free credits:</strong> New users receive 3 free
                      letter credits upon registration — no credit card required.
                    </li>
                    <li>
                      <strong>Single letters:</strong> One-time purchase at
                      $1.00 per letter.
                    </li>
                    <li>
                      <strong>Letter packs:</strong> Bundles of 3 ($2.49), 10
                      ($6.99), or 25 ($14.99) letters — one-time purchases that
                      never expire.
                    </li>
                    <li>
                      <strong>Monthly Pen Pal:</strong> $4.99/month for 8
                      letters per month with priority replies.
                    </li>
                    <li>
                      <strong>Unlimited Letters:</strong> $9.99/month for
                      unlimited letters with the fastest reply times.
                    </li>
                    <li>
                      All prices are displayed in USD. Applicable taxes may be
                      added at checkout.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">
                    Payment Processing
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      All payments are processed securely through our trusted
                      third-party payment provider. We never store your full
                      credit card number.
                    </li>
                    <li>
                      You agree to provide accurate and complete billing
                      information when making purchases.
                    </li>
                    <li>
                      By purchasing a subscription, you authorize us to charge
                      your payment method on a recurring monthly basis until
                      you cancel.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">
                    Automatic Renewal
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      Monthly subscriptions renew automatically at the end of
                      each billing period at the then-current price.
                    </li>
                    <li>
                      You will receive an email reminder before each renewal.
                    </li>
                    <li>
                      To avoid future charges, cancel at least 24 hours before
                      your renewal date.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cancellation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Ban className="h-6 w-6 text-primary" />
                Cancellation Policy
              </h3>
              <div className="space-y-4 text-muted-foreground text-sm">
                <p>
                  You may cancel your subscription at any time without penalty.
                  Here is what you need to know:
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong>How to cancel:</strong> Cancel through your{" "}
                    <Link
                      href="/dashboard"
                      className="text-primary hover:underline"
                    >
                      Dashboard
                    </Link>{" "}
                    by clicking &quot;Manage Plan&quot; and then &quot;Continue to
                    Portal&quot;, or email{" "}
                    <a
                      href="mailto:support@mindfulpenpal.com"
                      className="text-primary hover:underline"
                    >
                      support@mindfulpenpal.com
                    </a>{" "}
                    and we will cancel it for you.
                  </li>
                  <li>
                    <strong>Continued access:</strong> After cancellation, you
                    retain full access to all subscription features until the
                    end of your current billing period.
                  </li>
                  <li>
                    <strong>Credits preserved:</strong> Any purchased letter
                    pack credits remain in your account and never expire, even
                    after your subscription ends.
                  </li>
                  <li>
                    <strong>No partial billing:</strong> We do not charge
                    prorated fees. If you cancel mid-cycle, you keep access
                    until the cycle ends — no extra charge.
                  </li>
                  <li>
                    <strong>Re-subscribing:</strong> You can re-subscribe at
                    any time. Your account data and conversation history will
                    be preserved.
                  </li>
                </ul>
                <p className="mt-4">
                  For a step-by-step guide, visit our{" "}
                  <Link
                    href="/cancel-subscription"
                    className="text-primary hover:underline font-medium"
                  >
                    Cancel Subscription
                  </Link>{" "}
                  page.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Refund Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8 border-2 border-primary/20">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <RefreshCcw className="h-6 w-6 text-primary" />
                Refund Policy Summary
              </h3>
              <div className="space-y-4 text-muted-foreground text-sm">
                <ul className="space-y-2">
                  <li>
                    <strong>7-day guarantee:</strong> New subscribers may
                    request a full refund within 7 days of their initial
                    subscription purchase.
                  </li>
                  <li>
                    <strong>Unused letter packs:</strong> Fully unused letter
                    packs may be refunded within 30 days of purchase.
                  </li>
                  <li>
                    <strong>Used credits:</strong> Letters that have been sent
                    and replied to are non-refundable.
                  </li>
                  <li>
                    <strong>Technical issues:</strong> If a technical error
                    prevented delivery, we will restore the credit or issue a
                    refund.
                  </li>
                  <li>
                    <strong>Duplicate charges:</strong> Accidental or duplicate
                    charges are always refunded promptly.
                  </li>
                  <li>
                    <strong>Processing time:</strong> Approved refunds are
                    returned to your original payment method within 5–10
                    business days.
                  </li>
                </ul>
                <p>
                  To request a refund, email{" "}
                  <a
                    href="mailto:support@mindfulpenpal.com"
                    className="text-primary hover:underline"
                  >
                    support@mindfulpenpal.com
                  </a>{" "}
                  with the subject line &quot;Refund Request&quot;.
                </p>
                <p className="mt-2">
                  For complete details, please read our full{" "}
                  <Link
                    href="/refund-policy"
                    className="text-primary hover:underline font-medium"
                  >
                    Refund Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </motion.div>

          {/* Intellectual Property */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">
                Intellectual Property
              </h3>
              <div className="space-y-4 text-muted-foreground text-sm">
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    Your Content
                  </h4>
                  <p>
                    You retain ownership of the letters you write. By using our
                    service, you grant us a limited license to process your
                    letters solely for the purpose of generating AI replies.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    Our Platform
                  </h4>
                  <p>
                    The Dear Stranger platform, including its design, code,
                    AI prompts, brand elements, and proprietary technology,
                    remains our intellectual property. You may not copy,
                    modify, or redistribute any part of our platform.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Changes to Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
                Limitation of Liability
              </h3>
              <div className="space-y-4 text-muted-foreground text-sm">
                <p>
                  To the maximum extent permitted by applicable law, Dear
                  Stranger and its operators shall not be liable for any
                  indirect, incidental, special, consequential, or punitive
                  damages arising out of or related to your use of the service.
                </p>
                <p>
                  Our total liability for any claim arising from or related to
                  the service shall not exceed the amount you have paid to us
                  in the 12 months preceding the claim.
                </p>
                <p>
                  This limitation applies regardless of the legal theory on
                  which the claim is based, including breach of contract, tort
                  (including negligence), strict liability, or any other basis.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Governing Law */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.95 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">
                Changes to These Terms
              </h3>
              <div className="space-y-4 text-muted-foreground text-sm">
                <p>
                  We may update these Terms of Service from time to time. When
                  we make changes:
                </p>
                <ul className="space-y-2">
                  <li>
                    We will update the "Last updated" date at the top of this
                    page
                  </li>
                  <li>
                    For significant changes, we will notify you via email
                  </li>
                  <li>
                    Continued use of our service after changes constitutes
                    acceptance
                  </li>
                  <li>
                    The current version is always available on this page
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Related Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.05 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Related Policies</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link
                  href="/refund-policy"
                  className="rounded-xl border bg-card p-6 hover:border-primary/50 transition-colors group"
                >
                  <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    Refund Policy
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Detailed refund eligibility, timelines, and how to request.
                  </p>
                </Link>
                <Link
                  href="/cancel-subscription"
                  className="rounded-xl border bg-card p-6 hover:border-primary/50 transition-colors group"
                >
                  <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    Cancel Subscription
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Step-by-step guide to cancel your subscription.
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
                <Link
                  href="/#pricing"
                  className="rounded-xl border bg-card p-6 hover:border-primary/50 transition-colors group"
                >
                  <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    Plans &amp; Pricing
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    View subscription plans and letter pack options.
                  </p>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-4">
              Questions About These Terms?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you have any questions about these Terms of Service, please
              reach out. We want everything to be clear and fair.
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
