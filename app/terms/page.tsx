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
              <h3 className="text-2xl font-bold mb-6">
                Payment and Subscription Terms
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">Purchases</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>
                      Single letters and letter packs are one-time purchases
                      that never expire
                    </li>
                    <li>
                      Monthly subscriptions renew automatically unless
                      cancelled
                    </li>
                    <li>
                      All prices are displayed in USD and include applicable
                      taxes
                    </li>
                    <li>
                      Payments are processed securely by a trusted third-party
                      payment provider
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">
                    Cancellation and Refunds
                  </h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>
                      Cancel your subscription anytime from your dashboard or
                      customer portal
                    </li>
                    <li>
                      After cancellation, you retain access until the end of
                      your billing period
                    </li>
                    <li>
                      Unused letter packs remain available after subscription
                      cancellation
                    </li>
                    <li>
                      Refund requests handled on a case-by-case basis — contact{" "}
                      <a
                        href="mailto:support@mindfulpenpal.com"
                        className="text-primary hover:underline"
                      >
                        support@mindfulpenpal.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Intellectual Property */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
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

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
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
