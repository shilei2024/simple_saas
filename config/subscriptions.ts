import { ProductTier } from "@/types/subscriptions";

export const SUBSCRIPTION_TIERS: ProductTier[] = [
  {
    name: "Single Letter",
    id: "tier-single",
    productId: "prod_6E43JxQebqP1JmRXdM5OmQ", // Replace with real Creem product ID
    priceMonthly: "$0.99",
    description: "One letter, one heartfelt reply. For when you just need to be heard.",
    features: [
      "Write 1 letter, receive 1 reply",
      "Delivered to your inbox within hours",
      "Warm, personalized response",
      "No commitment needed",
    ],
    featured: false,
    creditAmount: 1,
    discountCode: "",
  },
  {
    name: "Monthly Pen Pal",
    id: "tier-monthly",
    productId: "prod_6E43JxQebqP1JmRXdM5OmQ", // Replace with real Creem product ID
    priceMonthly: "$4.99",
    description:
      "Your ongoing pen pal — like having a friend who always writes back.",
    features: [
      "8 letters per month (2 per week)",
      "Pen pal remembers your story",
      "Conversation continuity across letters",
      "Priority reply (within 4 hours)",
      "Language practice mode available",
      "Cancel anytime",
    ],
    featured: true,
    discountCode: "",
  },
  {
    name: "Unlimited Letters",
    id: "tier-unlimited",
    productId: "prod_6E43JxQebqP1JmRXdM5OmQ", // Replace with real Creem product ID
    priceMonthly: "$9.99",
    description: "Write as much as you need. Your pen pal is always here.",
    features: [
      "Unlimited letters per month",
      "Deep conversation memory",
      "Multiple pen pal personas (coming soon)",
      "Priority reply (within 2 hours)",
      "Language practice with gentle corrections",
      "Early access to new features",
    ],
    featured: false,
    discountCode: "",
  },
];

export const CREDITS_TIERS: ProductTier[] = [
  {
    name: "3 Letters",
    id: "tier-3-letters",
    productId: "prod_3oFb2iGX6JQwg6hCKeSkxE", // Replace with real Creem product ID
    priceMonthly: "$2.49",
    description: "A small bundle to dip your toes in.",
    creditAmount: 3,
    features: [
      "3 letters with replies",
      "No expiration",
      "Use at your own pace",
    ],
    featured: false,
    discountCode: "",
  },
  {
    name: "10 Letters",
    id: "tier-10-letters",
    productId: "prod_3oFb2iGX6JQwg6hCKeSkxE", // Replace with real Creem product ID
    priceMonthly: "$6.99",
    description: "The most popular choice — enough for a month of writing.",
    creditAmount: 10,
    features: [
      "10 letters with replies",
      "No expiration",
      "Save 30% vs single letters",
      "Use at your own pace",
    ],
    featured: true,
    discountCode: "",
  },
  {
    name: "25 Letters",
    id: "tier-25-letters",
    productId: "prod_3oFb2iGX6JQwg6hCKeSkxE", // Replace with real Creem product ID
    priceMonthly: "$14.99",
    description: "For committed writers who find peace in the pen.",
    creditAmount: 25,
    features: [
      "25 letters with replies",
      "No expiration",
      "Save 40% vs single letters",
      "Best value for regular writers",
    ],
    featured: false,
    discountCode: "",
  },
];
