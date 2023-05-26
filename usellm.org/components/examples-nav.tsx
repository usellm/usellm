"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { HOME_PAGE_DEMOS } from "@/config/demos";

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ExamplesNav({ className, ...props }: ExamplesNavProps) {
  const searchParams = useSearchParams();
  const page = searchParams.get("demo") || "ai-chatbot";

  return (
    <div className="relative">
      <ScrollArea>
        <div className={cn("mb-4 flex items-center", className)} {...props}>
          {HOME_PAGE_DEMOS.map((example) => (
            <Link
              href={"/?demo=" + example.id}
              key={example.id}
              className={cn(
                "flex items-center px-4 flex-shrink-0",
                page === example.id
                  ? "font-bold text-primary"
                  : "font-medium text-muted-foreground"
              )}
            >
              {example.name}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
