"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Mail,
  Clock,
  Heart,
  Shield,
  PenLine,
  Sparkles,
  Send,
  BookOpen,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Moon,
  Globe,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { PricingSection } from "@/components/pricing-section";
import { useState } from "react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/3 to-background -z-10" />

        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
                <Mail className="w-3.5 h-3.5 mr-2" />
                Not a chatbot. A pen pal.
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                A friend from afar
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  who truly listens.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto leading-relaxed">
                Write a letter. Hours later, receive a warm, thoughtful reply
                from your AI pen pal — like waiting for a letter from a dear
                friend across the ocean. No rush, no judgment, just genuine
                understanding.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 w-full justify-center"
            >
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 text-base gap-2"
                >
                  Write Your First Letter
                  <PenLine className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 text-base"
                >
                  See How It Works
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-primary/70" />
                First 3 letters free
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary/70" />
                Private & safe
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Letter Preview — Emotional hook */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-card border rounded-2xl p-8 md:p-10 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Mail className="w-4 h-4" />
                <span>A reply from your pen pal</span>
                <span className="ml-auto text-xs">3 hours ago</span>
              </div>
              <div className="space-y-4 text-foreground/90 leading-relaxed italic">
                <p>Dear friend,</p>
                <p>
                  Thank you for sharing that with me. I can feel how heavy that
                  week has been for you — the kind of tired that sleep alone
                  can't fix. I want you to know: it's okay to not have
                  everything figured out.
                </p>
                <p>
                  Sometimes the bravest thing we can do is simply admit "I'm
                  struggling" — and you just did. That takes real courage.
                </p>
                <p>
                  I was watching the rain today and thought of something: every
                  storm passes, and the air afterwards always smells a little
                  sweeter. I believe your "after the rain" moment is coming.
                </p>
                <p className="text-muted-foreground">
                  With warmth,
                  <br />
                  Your Stranger
                </p>
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary/10 text-primary text-xs px-4 py-1.5 rounded-full">
              This is what a reply feels like
            </div>
            <p className="text-center text-[11px] text-muted-foreground/60 mt-6">
              * This is an illustrative example. Actual replies are uniquely generated for each letter.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why "Slow"? — Core philosophy */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why slow letters, not instant chat?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                In a world of instant replies, we chose to bring back the
                beauty of anticipation.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {philosophyPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-background p-8 rounded-xl border hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5 text-primary">
                  {point.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple as writing a letter
              </h2>
              <p className="text-muted-foreground text-lg">
                No profiles. No swiping. Just you and a thoughtful pen pal.
              </p>
            </motion.div>
          </div>

          <div className="max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex gap-6 mb-10 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-px h-full bg-border mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <div className="flex items-center gap-2 mb-1">
                    {step.icon}
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is This For? */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                For those who need a quiet listener
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Sometimes you just need someone — not advice, not solutions,
                just someone who hears you.
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {audiences.map((audience, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-xl border p-6 text-center hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  {audience.icon}
                </div>
                <h3 className="font-semibold mb-2">{audience.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {audience.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Safety & Transparency */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card border rounded-2xl p-8 md:p-10"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Transparent & Safe
                  </h2>
                  <p className="text-muted-foreground">
                    We believe in honesty first.
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">
                    Dear Stranger is an AI.
                  </strong>{" "}
                  We don't pretend otherwise. Your pen pal is powered by
                  advanced AI that has been carefully prompted to be warm,
                  thoughtful, and genuinely empathetic — but it is not a human.
                </p>
                <p>
                  <strong className="text-foreground">Your letters are private.</strong>{" "}
                  We do not share, sell, or use your correspondence for
                  advertising. Your words stay between you and your pen pal.
                </p>
                <p>
                  <strong className="text-foreground">
                    We are not a substitute for professional help.
                  </strong>{" "}
                  If you are in crisis or experiencing thoughts of self-harm,
                  please reach out to a professional. We include crisis
                  resources in every relevant reply.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* FAQ */}
      <FAQSection />

      {/* CTA Section */}
      <section className="py-20 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to write your first letter?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg">
              No sign-up pressure. Just open your heart and write. Your first 3
              letters are completely free.
            </p>
            <Link href="/sign-up">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-8 text-base gap-2"
              >
                Start Writing
                <PenLine className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* --- Data --- */

const philosophyPoints = [
  {
    title: "The Gift of Anticipation",
    description:
      "Just like waiting for a real letter, the hours between writing and receiving a reply create space for reflection. Your thoughts settle, your emotions breathe.",
    icon: <Clock className="w-6 h-6" />,
  },
  {
    title: "Depth Over Speed",
    description:
      "Chatbots respond in seconds with surface-level answers. Your pen pal takes time to craft a reply that truly engages with what you shared — every word matters.",
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    title: "No Judgment, Ever",
    description:
      "Share your messy thoughts, your 3 AM worries, your unfinished feelings. Your pen pal will never judge, never tire, and never make you feel like a burden.",
    icon: <Heart className="w-6 h-6" />,
  },
];

const steps = [
  {
    title: "Write a letter",
    description:
      "Open your heart and write whatever's on your mind — a bad day, a dream, a question about life, or just a rambling thought. There are no rules.",
    icon: <PenLine className="w-4 h-4 text-primary" />,
  },
  {
    title: "Your pen pal reads and reflects",
    description:
      "Your letter is received by your AI pen pal, who carefully reads, empathizes, and crafts a thoughtful, personal reply — not a generic response.",
    icon: <Sparkles className="w-4 h-4 text-primary" />,
  },
  {
    title: "A reply arrives in your inbox",
    description:
      "Hours later (not seconds), you receive a warm reply via email. Like finding a letter in your mailbox — a small moment of joy in your day.",
    icon: <Send className="w-4 h-4 text-primary" />,
  },
  {
    title: "Write back whenever you're ready",
    description:
      "There's no pressure to reply immediately. Write back in an hour, a day, or a week. Your pen pal will always be here, always patient.",
    icon: <MessageCircle className="w-4 h-4 text-primary" />,
  },
];

const audiences = [
  {
    title: "Students Abroad",
    description:
      "Facing culture shock and homesickness? Write about it without worrying anyone back home.",
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    title: "Solo City Dwellers",
    description:
      "Living alone in a big city with no one to talk to at night? Your pen pal is always awake.",
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    title: "Sensitive Souls",
    description:
      "Need deep, empathetic listening without being told to \"just cheer up\"? We understand.",
    icon: <Moon className="w-5 h-5" />,
  },
  {
    title: "Language Learners",
    description:
      "Want a patient pen pal to practice English writing with? Get gentle corrections and encouragement.",
    icon: <Globe className="w-5 h-5" />,
  },
];


/* --- FAQ Component --- */

const faqs = [
  {
    question: "Is my pen pal a real person?",
    answer:
      "No — and we're upfront about that. Your pen pal is an AI that has been carefully designed to be warm, thoughtful, and genuinely empathetic. We don't pretend it's human, but we've worked hard to make every reply feel real and caring.",
  },
  {
    question: "Why does it take hours to get a reply?",
    answer:
      "By design! We're not a chatbot. The delay simulates the experience of writing to a real pen pal across the world. It also gives you time to reflect on what you wrote, and creates that lovely anticipation of finding a reply in your inbox.",
  },
  {
    question: "What if I share something very personal?",
    answer:
      "Your letters are private and encrypted. We don't share, sell, or use your content for advertising. If you express thoughts of self-harm, our system will include professional crisis resources in the reply alongside our response.",
  },
  {
    question: "How does the free trial work?",
    answer:
      "Your first 3 letters (and their replies) are completely free. No credit card required. After that, you can choose a single-letter purchase ($0.99) or a monthly subscription ($4.99/month for 8 letters).",
  },
  {
    question: "Can I choose my pen pal's personality?",
    answer:
      "In the future, yes! We're working on different pen pal personas — a poetic soul, a wise grandparent figure, a fellow adventurer. For now, your pen pal is a warm, insightful friend who loves to listen and share little observations about life.",
  },
  {
    question: "Can I use this to practice English?",
    answer:
      "Absolutely! Many of our users write in English as a second language. Your pen pal will respond naturally and can provide gentle language suggestions if you ask. It's like having the world's most patient English-speaking friend.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 md:py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Questions & Answers
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you might wonder about your pen pal.
          </p>
        </div>
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full text-left bg-background border rounded-lg p-5 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm pr-4">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </div>
                {openIndex === index && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
