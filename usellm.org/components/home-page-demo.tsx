"use client";
import { HOME_PAGE_DEMOS } from "@/config/demos";
import { Icons } from "./icons";
import { ExamplesNav } from "./examples-nav";
import { useState } from "react";

export function HomePageDemo() {
  const [current, setCurrent] = useState("ai-chatbot");

  const page = HOME_PAGE_DEMOS.find((demo) => demo.id === current);

  if (!page) {
    return null;
  }

  return (
    <>
      <div id="demo" />
      <ExamplesNav current={current} setCurrent={setCurrent} />
      <div className="overflow-hidden rounded-lg border bg-background shadow-xl w-full h-[500px] flex flex-col mb-8">
        <div className="w-full shadow dark:border-b">
          <div className="w-full px-4 h-14 flex items-center mx-auto justify-between">
            <span className="text-lg font-bold ">Live Demo</span>
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
    </>
  );
}
