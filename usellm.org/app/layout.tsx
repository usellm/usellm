import "@/styles/globals.css";
import { Metadata } from "next";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { LLMProvider } from "usellm";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - React Hooks for Large Language Models`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "ChatGPT",
    "Next.js",
    "React",
    "Tailwind CSS",
    "Artificial Intelligence",
  ],
  authors: [
    {
      name: "Aakash N S",
      url: "https://aakashns.com",
    },
  ],
  creator: "aakashns",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} - React Hooks for Large Language Models`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 628,
        alt: siteConfig.name,
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* <LLMProvider serviceUrl="/api/llm"> */}
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1 container">{children}</div>
            <Toaster />
          </div>
          <TailwindIndicator />
          {/* </LLMProvider> */}
        </ThemeProvider>
        <Analytics />
        <script async defer src="https://buttons.github.io/buttons.js"></script>
      </body>
    </html>
  );
}
