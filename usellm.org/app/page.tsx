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
import { StyleSwitcher } from "@/components/style-switcher";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { ExamplesNav } from "@/components/examples-nav";
import { HomePageDemo } from "@/components/home-page-demo";

export default function IndexPage() {
  return (
    <>
      <div className="container relative pb-10">
        <StyleSwitcher />
        <PageHeader>
          <Link
            href="https://usellm.substack.com/p/release-notes-usellm-v051"
            target="_blank"
            className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
          >
            🚀 v0.5.1 <Separator className="mx-2 h-4" orientation="vertical" />
            Voice chat, text embeddings, and more..
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
        <div id="demo" />
        <ExamplesNav />
        <HomePageDemo />
      </div>
      <div className="flex-1" />
      <SiteFooter />
    </>
  );
}
