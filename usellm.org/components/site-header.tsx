import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { GitHubStarButton } from "./github-star-button";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Icons } from "./icons";

export function SiteHeader() {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 shadow-sm backdrop-blur">
      <div className="container flex h-14 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center space-x-2 sm:space-x-4 justify-end">
          <nav className="flex items-center space-x-1">
            <div className="hidden md:block mr-2">
              <GitHubStarButton />
            </div>
            <Link
              className="md:hidden"
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              title="GitHub"
            >
              <div
                className={cn(
                  buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.slack}
              target="_blank"
              rel="noreferrer"
              title="Slack"
            >
              <div
                className={cn(
                  buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                <Icons.slack className="h-5 w-5" />
                <span className="sr-only">Slack</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              title="Twitter"
            >
              <div
                className={cn(
                  buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                <Icons.twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>

            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
