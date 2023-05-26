"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AIChatBotDemo } from "./demos/ai-chatbot-demo";
import DocumentQnaDemo from "./demos/document-qna-demo";

export const HOME_PAGE_DEMOS = [
  {
    name: "AI Chatbot",
    id: "ai-chatbot",
    component: AIChatBotDemo,
  },
  {
    name: "Document Q&A",
    id: "document-qna",
    component: DocumentQnaDemo,
  },
  {
    name: "Prompt Template",
    id: "prompt-template",
    component: AIChatBotDemo,
  },
  {
    name: "Voice Chat",
    id: "voice-chat",
    component: AIChatBotDemo,
  },
  {
    name: "Image Generation",
    id: "image-generation",
    component: AIChatBotDemo,
  },
];

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ExamplesNav({ className, ...props }: ExamplesNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get("demo") || "ai-chatbot";

  return (
    <div className="relative">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn("mb-4 flex items-center", className)} {...props}>
          {HOME_PAGE_DEMOS.map((example) => (
            <Link
              href={"/?demo=" + example.id}
              key={example.id}
              className={cn(
                "flex items-center px-4",
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

export function HomePageDemo() {
  const searchParams = useSearchParams();
  const page = searchParams.get("demo") || "ai-chatbot";

  const C = HOME_PAGE_DEMOS.find((example) => example.id === page)?.component;

  return C ? <C /> : null;
}
