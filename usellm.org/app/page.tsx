import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { HomePageDemo } from "@/components/home-page-demo";

export default function IndexPage() {
  return (
    <>
      <div className="container relative pb-10">
        <PageHeader>
          <Link
            href="https://usellm.substack.com/p/release-notes-usellm-v0130"
            target="_blank"
            className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium truncate max-w-full"
          >
            🚀 v0.13.0 <Separator className="mx-2 h-4" orientation="vertical" />
            <span className="truncate">
              Register New Agents, Call Custom Functions and Simplify Chatbot
              Creation with useChat Hook
            </span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
          <br/>
          <Link
            href="https://sdk.vercel.ai/docs"
            target="_blank"
            className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium truncate max-w-full"
          >
            ⚠️ Notice <Separator className="mx-2 h-4" orientation="vertical" />
            <span className="truncate">
              This package is no longer under active development. Please use the Vercel AI SDK instead.
            </span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
          <PageHeaderHeading>
            React Hooks for Large Language Models
          </PageHeaderHeading>
          <PageHeaderDescription>
            Integrate large language models like ChatGPT and add AI-powered
            features to your React applications in minutes.
          </PageHeaderDescription>
          <div className="flex w-full items-center space-x-4 pb-8 pt-4 md:pb-10">
            <Link href="/docs" className={cn(buttonVariants())}>
              Get Started
            </Link>
            <Link
              target="_blank"
              rel="noreferrer"
              href={siteConfig.links.github}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Icons.gitHub className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </div>
        </PageHeader>

        <HomePageDemo />
      </div>
      <div className="flex-1" />
      <SiteFooter />
    </>
  );
}
