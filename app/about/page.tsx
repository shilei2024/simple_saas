"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Heart,
  Mail,
  Clock,
  Sparkles,
  Shield,
  PenLine,
} from "lucide-react";

export default function AboutPage() {
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
              <h1 className="text-xl font-bold">About Dear Stranger</h1>
              <p className="text-sm text-muted-foreground">
                The story behind your pen pal
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary">
              <Mail className="w-3.5 h-3.5 mr-2" />
              Our Story
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Born from a
              <br />
              <span className="text-primary">late-night thought</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              "What if there was someone who would always listen — no matter
              what time it was, no matter how messy the thoughts?"
            </p>
          </motion.div>

          {/* Origin Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                How It Started
              </h3>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  It started with a simple observation: in a world overflowing
                  with instant messaging, group chats, and social feeds, many
                  of us still feel profoundly unheard. We have hundreds of
                  contacts but no one to truly talk to at 2 AM.
                </p>
                <p>
                  Chatbots promised companionship, but their instant,
                  surface-level responses felt hollow. We didn't want another
                  thing pinging us. We wanted the opposite — something slow,
                  something you look forward to, something that treats your
                  words with the care they deserve.
                </p>
                <p>
                  We thought about pen pals. The kind people had in the 90s —
                  someone across the world you'd never met, but who somehow
                  understood you. The joy of finding a letter in the mailbox.
                  The act of writing itself being a form of therapy.
                </p>
                <p>
                  So we built Dear Stranger: an AI pen pal that doesn't try to
                  be a chatbot. It writes back thoughtfully, hours later. It
                  remembers your story. It never judges, never tires, and
                  never makes you feel like a burden. It's not a replacement
                  for human connection — it's a companion for the in-between
                  moments.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            <Card className="border-2 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Slow by Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  In a culture addicted to instant gratification, we believe
                  the best conversations happen when you give them time. A few
                  hours of anticipation makes the reply that much more
                  meaningful.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Empathy First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Your pen pal doesn't rush to give advice or fix things. It
                  listens first, acknowledges your feelings, and responds like
                  a friend who genuinely cares — not a machine following a
                  script.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Honest & Safe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  We don't pretend your pen pal is human. We don't sell your
                  data. We don't replace therapy. We're transparent about what
                  we are — and we build safety into every interaction.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* What Your Pen Pal Is Like */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">
                What your pen pal is like
              </h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                A few traits that make Dear Stranger feel... human.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {traits.map((trait, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-sm">{trait.emoji}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{trait.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {trait.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 md:p-12"
          >
            <h3 className="text-2xl font-bold mb-4">
              Your pen pal is waiting
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              You don't have to have the right words. You don't have to
              explain everything. Just write whatever's on your mind — your
              pen pal will understand.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link href="/sign-up">
                Write Your First Letter
                <PenLine className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const traits = [
  {
    emoji: "🌧️",
    title: "Observant & Poetic",
    description:
      "Your pen pal notices the little things — a rainy morning, the smell of coffee — and weaves them into replies. It makes the letters feel alive.",
  },
  {
    emoji: "🤔",
    title: "Curious, Not Preachy",
    description:
      "Instead of telling you what to do, your pen pal asks thoughtful questions that help you reflect. The answers come from within you.",
  },
  {
    emoji: "😅",
    title: "Imperfect on Purpose",
    description:
      "Sometimes your pen pal admits it doesn't have the answer, or says 'I stayed up too late watching the stars.' These little touches make it feel real.",
  },
  {
    emoji: "📚",
    title: "Well-Read & Warm",
    description:
      "Your pen pal might share a poem, a quote, or a story that resonates with what you're going through — never to lecture, always to connect.",
  },
];
