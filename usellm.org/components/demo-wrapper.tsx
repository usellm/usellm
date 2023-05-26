import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Icons } from "./icons";

interface DemoWrapperProps {
  title?: string;
  sourceUrl?: string;
  children: React.ReactNode;
}

export function DemoWrapper({
  title = "Live Demo",
  sourceUrl,
  children,
}: DemoWrapperProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-background shadow-xl w-full h-[600px] flex flex-col mb-8">
      <div className="w-full shadow dark:border-b">
        <div className="w-full px-4 h-14 flex items-center mx-auto justify-between">
          <span className="text-lg font-bold ">Live Demo</span>
          {sourceUrl && (
            <a
              target="_blank"
              className="hover:text-blue-600 flex items-center"
              href={sourceUrl}
            >
              Source <Icons.externalLink className="inline ml-1" size={16} />
            </a>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
