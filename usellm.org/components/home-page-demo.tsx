"use client";
import { HOME_PAGE_DEMOS } from "@/config/demos";
import { Icons } from "./icons";
import { useSearchParams } from "next/navigation";

interface DemoWrapperProps {
  title?: string;
  sourceUrl?: string;
  children: React.ReactNode;
}

export function HomePageDemo({ title = "Live Demo" }: DemoWrapperProps) {
  const searchParams = useSearchParams();
  const id = searchParams.get("demo") || "ai-chatbot";

  const page = HOME_PAGE_DEMOS.find((demo) => demo.id === id);

  if (!page) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-background shadow-xl w-full h-[500px] flex flex-col mb-8">
      <div className="w-full shadow dark:border-b">
        <div className="w-full px-4 h-14 flex items-center mx-auto justify-between">
          <span className="text-lg font-bold ">{title}</span>
          {page.sourceUrl && (
            <a
              target="_blank"
              className="hover:text-blue-600 flex items-center"
              href={page.sourceUrl}
            >
              Source <Icons.externalLink className="inline ml-1" size={16} />
            </a>
          )}
        </div>
      </div>
      <page.component />
    </div>
  );
}
