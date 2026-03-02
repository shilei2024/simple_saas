"use client";

import { Logo } from "./logo";
import Link from "next/link";
const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
  {
    title: "Subscription",
    links: [
      { label: "Cancel Subscription", href: "/cancel-subscription" },
      { label: "Manage Billing", href: "/dashboard" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-full lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Not a chatbot — a friend from afar. Write a letter, receive a
              heartfelt reply. Rediscover the beauty of slow, meaningful
              correspondence.
            </p>
            <p className="mt-4 text-xs text-muted-foreground/60">
              Dear Stranger is an AI pen pal and does not replace professional
              mental health support. If you are in crisis, please contact a
              local helpline.
            </p>
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5 lg:col-span-4">
            {footerLinks.map((group) => (
              <div key={group.title} className="flex flex-col gap-3">
                <h3 className="text-sm font-medium">{group.title}</h3>
                <nav className="flex flex-col gap-2">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}

            {/* Contact column */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-medium">Contact</h3>
              <nav className="flex flex-col gap-2">
                <a
                  href="mailto:support@mindfulpenpal.com"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  support@mindfulpenpal.com
                </a>
                <a
                  href="mailto:lanceshi84@gmail.com"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  lanceshi84@gmail.com
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
