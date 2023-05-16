"use client";
import { useState } from "react";
import useLLM, { OpenAIMessage } from "usellm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

function Message({ role, content }: OpenAIMessage) {
  return (
    <div className="my-4">
      <div className="font-semibold text-gray-800 dark:text-white">
        {capitalize(role)}
      </div>
      <div className="text-gray-600 dark-text-gray-100">{content}</div>
    </div>
  );
}

export function HomePageDemo() {
  const [history, setHistory] = useState<OpenAIMessage[]>([
    {
      role: "assistant",
      content:
        "I'm a chatbot powered by the ChatGPT API and developed using useLLM. Ask me anything!",
    },
  ]);
  const [inputText, setInputText] = useState("What can you do for me?");

  const llm = useLLM("/api/llmservice");

  async function handleSend() {
    if (!inputText) {
      return;
    }

    const newHistory = [...history, { role: "user", content: inputText }];

    setHistory(newHistory);
    setInputText("");

    await llm.chat({
      messages: newHistory,
      stream: true,
      onStream: (message) => setHistory([...newHistory, message]),
    });
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-background shadow-xl w-full h-[480px] flex flex-col">
      <div className="w-full shadow">
        <div className="w-full px-4 h-14 flex items-center mx-auto justify-between">
          <span className="text-lg font-bold ">Live Demo</span>
          <a
            target="_blank"
            className="hover:text-blue-600"
            href="https://github.com/usellm/usellm/tree/main/usellm.org/components/home-page-demo.tsx"
          >
            Source
          </a>
        </div>
      </div>
      <div className="w-full flex-1 overflow-y-auto px-4">
        {history.map((message, idx) => (
          <Message {...message} key={idx} />
        ))}
      </div>
      <div className="w-full py-4 flex px-4">
        <Input
          type="text"
          placeholder="Enter message here"
          value={inputText}
          autoFocus
          onChange={(e) => setInputText(e.target.value)}
        />
        <Button variant="default" className="ml-2" onClick={handleSend}>
          Send
        </Button>
      </div>
    </div>
  );
}
