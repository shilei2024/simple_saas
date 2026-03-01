"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Shield,
  Eye,
  Database,
  Lock,
  UserCheck,
  Globe,
  Mail,
} from "lucide-react";

export default function PrivacyPage() {
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
              <h1 className="text-xl font-bold">Privacy Policy</h1>
              <p className="text-sm text-muted-foreground">
                How we protect your letters and personal data
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
              <Shield className="mr-2 h-4 w-4" />
              Your Privacy Matters
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Privacy Policy
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your letters are deeply personal. We take the responsibility of
              protecting them seriously. This policy explains what data we
              collect, how we use it, and how we keep your correspondence safe.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Last updated:</strong> March 1, 2026
            </p>
          </motion.div>

          {/* Principles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-6 md:grid-cols-3"
          >
            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  We clearly explain what data we collect and why. No hidden
                  trackers, no selling your information to advertisers, no
                  surprises.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Your letters and personal data are protected with
                  industry-standard encryption both in transit and at rest. We
                  treat your words like the private thoughts they are.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Your Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  You can access, download, or delete your data at any time.
                  Your correspondence belongs to you — we're just holding it
                  safely.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* What We Collect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Database className="h-6 w-6 text-primary" />
                Information We Collect
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">
                    Information You Provide
                  </h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>
                      <strong>Account Information:</strong> Email address and
                      password when you create an account, or your Google
                      profile if you sign in with Google.
                    </li>
                    <li>
                      <strong>Your Letters:</strong> The content of the letters
                      you write to your pen pal. These are stored securely so
                      your pen pal can maintain conversation continuity.
                    </li>
                    <li>
                      <strong>Payment Information:</strong> Billing details when
                      you purchase letter packs or subscriptions. Payment
                      processing is handled by a trusted third-party payment
                      provider — we never store your full card number.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">
                    Information Collected Automatically
                  </h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>
                      <strong>Usage Data:</strong> How you interact with our
                      service (e.g., letters sent, pages visited).
                    </li>
                    <li>
                      <strong>Device Information:</strong> Browser type,
                      operating system, and IP address for security purposes.
                    </li>
                    <li>
                      <strong>Cookies:</strong> Essential cookies to keep you
                      signed in and remember your preferences.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* How We Use It */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">
                How We Use Your Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">Core Service</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>
                      Generate thoughtful, personalized pen pal replies to your
                      letters
                    </li>
                    <li>
                      Maintain conversation history so your pen pal remembers
                      your story
                    </li>
                    <li>Deliver replies to your email inbox</li>
                    <li>Process payments and manage your subscription</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Safety & Improvement</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>
                      Detect crisis situations and include appropriate support
                      resources
                    </li>
                    <li>Improve the quality and empathy of pen pal responses</li>
                    <li>Prevent abuse and ensure platform security</li>
                    <li>
                      Send service-related notifications (never marketing spam)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI & Your Letters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                AI Processing & Your Letters
              </h3>
              <div className="space-y-4 text-muted-foreground text-sm">
                <p>
                  Your letters are processed by AI (powered by third-party
                  large language model providers) to generate pen pal replies.
                  Here's what you should know:
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong>We send your letter content to our AI
                    provider</strong> solely to generate a reply. We do not use
                    your letters to train AI models.
                  </li>
                  <li>
                    <strong>Your conversation history</strong> may be included
                    for context so your pen pal can maintain continuity across
                    letters.
                  </li>
                  <li>
                    <strong>We do not sell, license, or share</strong> your
                    letter content with any third parties for advertising,
                    marketing, or any purpose other than generating your
                    replies.
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Data Sharing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Globe className="h-6 w-6 text-primary" />
                Information Sharing
              </h3>
              <div className="space-y-4 text-muted-foreground text-sm">
                <p>
                  <strong className="text-foreground">
                    We do not sell your personal information or letter content.
                  </strong>{" "}
                  We only share data in these limited cases:
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong>AI Provider:</strong> Your letter content is sent to
                    our AI provider to generate replies (see above).
                  </li>
                  <li>
                    <strong>Payment Processor:</strong> Billing information
                    necessary to process your payments is handled by a
                    third-party payment service.
                  </li>
                  <li>
                    <strong>Cloud Infrastructure:</strong> Your data is stored
                    on secure, industry-standard cloud hosting and database
                    services.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law or
                    to protect safety (e.g., imminent danger to life).
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Your Rights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">
                Your Rights and Choices
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">Access and Control</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>Access your personal information and letter history</li>
                    <li>Update or correct your account data</li>
                    <li>Delete your account and all associated data</li>
                    <li>Request a download of your data</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Communication</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>Opt out of non-essential emails</li>
                    <li>Manage cookie preferences</li>
                    <li>Pause or cancel your subscription anytime</li>
                    <li>
                      Request data deletion by emailing{" "}
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

          {/* Data Security & Retention */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">
                Data Security and Retention
              </h3>
              <div className="space-y-4 text-muted-foreground text-sm">
                <p>
                  We implement appropriate technical and organizational measures
                  to protect your personal information and letter content.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">
                      Security Measures
                    </h4>
                    <ul className="space-y-1">
                      <li>Encryption in transit (TLS) and at rest</li>
                      <li>Row-level security on all database tables</li>
                      <li>Secure authentication via industry-standard protocols</li>
                      <li>No storage of full payment card numbers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">
                      Data Retention
                    </h4>
                    <ul className="space-y-1">
                      <li>Account data: Until you delete your account</li>
                      <li>Letter history: Until you delete it or your account</li>
                      <li>Usage logs: Up to 12 months</li>
                      <li>Payment records: As required by tax/legal obligations</li>
                    </ul>
                  </div>
                </div>
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
              Questions About Privacy?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you have any questions about this Privacy Policy or want to
              exercise your data rights, please reach out. We're happy to help.
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
