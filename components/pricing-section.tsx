"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { SUBSCRIPTION_TIERS, CREDITS_TIERS } from "@/config/subscriptions";
import { ProductTier } from "@/types/subscriptions";

interface PricingSectionProps {
  className?: string;
}

export function PricingSection({ className }: PricingSectionProps) {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handlePurchase = async (tier: ProductTier) => {
    if (!user) {
      toast({
        title: "Sign in first",
        description: "Create an account to start writing letters.",
        variant: "destructive",
      });
      router.push("/sign-in");
      return;
    }

    setIsProcessing(tier.id);

    try {
      const response = await fetch("/api/creem/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: tier.productId,
          productType: tier.creditAmount ? "credits" : "subscription",
          userId: user.id,
          credits: tier.creditAmount,
        }),
      });

      if (!response.ok) throw new Error("Failed to create checkout session");

      const { checkoutUrl } = await response.json();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Something went wrong",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const cardProps = {
    isProcessing,
    onPurchase: handlePurchase,
    hoveredId,
    onHover: setHoveredId,
    selectedId,
    onSelect: setSelectedId,
  };

  return (
    <section id="pricing" className={`w-full py-16 md:py-20 ${className}`}>
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            The price of a coffee, the value of being heard
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            Start free with 3 letters. Then choose what works for you.
          </p>
        </div>

        <Tabs
          defaultValue="subscription"
          className="w-full flex flex-col items-center"
        >
          <TabsList className="mb-8">
            <TabsTrigger value="subscription">Subscriptions</TabsTrigger>
            <TabsTrigger value="credits">Letter Packs</TabsTrigger>
          </TabsList>

          <TabsContent value="subscription" className="w-full">
            <div
              className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto items-stretch"
              onMouseLeave={() => setHoveredId(null)}
            >
              {SUBSCRIPTION_TIERS.map((tier, index) => (
                <PricingCard
                  key={tier.id}
                  tier={tier}
                  index={index}
                  type="subscription"
                  {...cardProps}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="credits" className="w-full">
            <div
              className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto items-stretch"
              onMouseLeave={() => setHoveredId(null)}
            >
              {CREDITS_TIERS.map((tier, index) => (
                <PricingCard
                  key={tier.id}
                  tier={tier}
                  index={index}
                  type="credits"
                  {...cardProps}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

interface PricingCardProps {
  tier: ProductTier;
  index: number;
  isProcessing: string | null;
  onPurchase: (tier: ProductTier) => void;
  type: "subscription" | "credits";
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function PricingCard({
  tier,
  index,
  isProcessing,
  onPurchase,
  type,
  hoveredId,
  onHover,
  selectedId,
  onSelect,
}: PricingCardProps) {
  const isHovered = hoveredId === tier.id;
  const isSelected = selectedId === tier.id;
  const isFeatured = tier.featured;

  const activeId = hoveredId ?? selectedId;
  const isEnlarged = activeId === tier.id;
  const isHighlighted = isHovered || isSelected || (isFeatured && !activeId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isEnlarged ? 1.05 : 1,
      }}
      transition={{
        scale: { type: "spring", stiffness: 300, damping: 25 },
        opacity: { duration: 0.4, delay: index * 0.1 },
        y: { duration: 0.4, delay: index * 0.1 },
      }}
      className="relative origin-center h-full"
      onMouseEnter={() => onHover(tier.id)}
      onClick={() => onSelect(isSelected ? null : tier.id)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            layoutId="pricing-highlight"
            className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-primary/60 via-primary to-primary/60 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
      </AnimatePresence>

      <Card
        className={`relative z-10 h-full flex flex-col transition-all duration-300 cursor-pointer ${
          isHighlighted
            ? "border-transparent shadow-lg"
            : "border-border"
        }`}
      >
        {isFeatured && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
            <Badge className="bg-primary px-3 py-1">Most Popular</Badge>
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-2xl">{tier.name}</CardTitle>
          <CardDescription>{tier.description}</CardDescription>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-bold">{tier.priceMonthly}</span>
            <span className="text-muted-foreground ml-1">
              {type === "subscription" && !tier.creditAmount
                ? "/month"
                : " one-time"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <ul className="space-y-3">
            {tier.features?.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full gap-2"
            variant={isHighlighted ? "default" : "outline"}
            onClick={() => onPurchase(tier)}
            disabled={isProcessing === tier.id}
          >
            {isProcessing === tier.id ? (
              "Processing..."
            ) : (
              <>
                Get Started <PenLine className="w-3.5 h-3.5" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
