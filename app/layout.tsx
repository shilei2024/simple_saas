import Header from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "next-themes";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const baseUrl = process.env.BASE_URL
  ? `${process.env.BASE_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: "Dear Stranger - Your Thoughtful AI Pen Pal",
  description:
    "A slow, warm AI pen pal who writes back with care. Not a chatbot — a friend from afar who truly listens. Write a letter, and receive a heartfelt reply.",
  keywords:
    "AI pen pal, letter writing, emotional support, mindful writing, slow communication, mental wellness, journaling",
  openGraph: {
    title: "Dear Stranger - Your Thoughtful AI Pen Pal",
    description:
      "Not a chatbot — a friend from afar. Write a letter, receive a heartfelt reply hours later. Rediscover the beauty of slow, meaningful correspondence.",
    type: "website",
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Dear Stranger - Your Thoughtful AI Pen Pal",
    description:
      "Not a chatbot — a friend from afar. Write a letter, receive a heartfelt reply hours later.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen">
            <Header user={user} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
