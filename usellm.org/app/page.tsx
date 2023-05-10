"use client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import useLLM, { OpenAIMessage } from "usellm";

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

function Message({ role, content }: OpenAIMessage) {
  return (
    <div className="my-4">
      <div className="font-semibold text-gray-800">{capitalize(role)}</div>
      <div className="text-gray-600">{content}</div>
    </div>
  );
}

export default function Home() {
  const [history, setHistory] = useState<OpenAIMessage[]>([]);
  const [inputText, setInputText] = useState("");

  const llm = useLLM("/api/llmservice");

  async function handleSend() {
    if (!inputText) {
      return;
    }

    const newHistory = [...history, { role: "user", content: inputText }];

    setHistory(newHistory);
    setInputText("");

    await llm.chat({
      template: "jobot",
      inputs: { topic: "Machine Learning" },
      messages: newHistory,
      stream: true,
      onStream: (message, isFirst, isLast) => {
        const finalHistory = [...newHistory, message];
        setHistory(finalHistory);
      },
    });
  }

  return (
    <div className="h-screen flex flex-col items-center">
      <Navbar />
      <div className="max-w-4xl w-full flex-1 overflow-y-auto px-4">
        {history.map((message, idx) => (
          <Message {...message} key={idx} />
        ))}
      </div>
      <div className="max-w-4xl w-full pb-4 flex px-4">
        <Input
          type="text"
          placeholder="Enter message here"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <Button variant="default" className="ml-2" onClick={handleSend}>
          Send
        </Button>
      </div>
    </div>
  );
}
