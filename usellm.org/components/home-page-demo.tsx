"use client";
import { useState } from "react";
import useLLM, { OpenAIMessage } from "usellm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "./icons";
import ScrollToBottom from "react-scroll-to-bottom";
import { useToast } from "./ui/use-toast";

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

type Status = "idle" | "recording" | "transcribing" | "streaming";

function getInputPlaceholder(status: Status) {
  switch (status) {
    case "idle":
      return "Ask me anthing...";
    case "recording":
      return "Recording audio...";
    case "transcribing":
      return "Transcribing audio...";
    case "streaming":
      return "Wait for my response...";
  }
}

function Message({ role, content }: OpenAIMessage) {
  return (
    <div className="my-4">
      <div className="font-semibold text-gray-800 dark:text-white">
        {capitalize(role)}
      </div>
      <div className="text-gray-600 dark:text-gray-200 whitespace-pre-wrap mt-1">
        {content}
      </div>
    </div>
  );
}

export function HomePageDemo() {
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>("idle");
  const [history, setHistory] = useState<OpenAIMessage[]>([
    {
      role: "assistant",
      content:
        "I'm a chatbot powered by the ChatGPT API and developed using useLLM. Ask me anything!",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const llm = useLLM({ serviceUrl: "/api/llm" });

  async function handleSend() {
    if (!inputText) {
      return;
    }
    try {
      setStatus("streaming");
      const newHistory = [...history, { role: "user", content: inputText }];
      setHistory(newHistory);
      setInputText("");
      const { message } = await llm.chat({
        messages: newHistory,
        stream: true,
        onStream: ({ message }) => setHistory([...newHistory, message]),
      });
      setHistory([...newHistory, message]);
      setStatus("idle");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Something went wrong!",
        description: error.message,
      });
    }
  }

  async function handleRecordClick() {
    try {
      if (status === "idle") {
        await llm.record();
        setStatus("recording");
      } else if (status === "recording") {
        setStatus("transcribing");
        const { audioUrl } = await llm.stopRecording();
        const { text } = await llm.transcribe({ audioUrl });
        setStatus("streaming");
        const newHistory = [...history, { role: "user", content: text }];
        setHistory(newHistory);
        const { message } = await llm.chat({
          messages: newHistory,
          stream: true,
          onStream: ({ message }) => setHistory([...newHistory, message]),
        });
        setHistory([...newHistory, message]);
        setStatus("idle");
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Something went wrong!",
        description: error.message,
      });
    }
  }

  const RecordingIcon = status === "recording" ? Icons.square : Icons.mic;

  return (
    <div className="overflow-hidden rounded-lg border bg-background shadow-xl w-full h-[480px] flex flex-col">
      <div className="w-full shadow dark:border-b">
        <div className="w-full px-4 h-14 flex items-center mx-auto justify-between">
          <span className="text-lg font-bold ">Live Demo</span>
          <a
            target="_blank"
            className="hover:text-blue-600 flex items-center"
            href="https://github.com/usellm/usellm/tree/main/usellm.org/components/home-page-demo.tsx"
          >
            Source <Icons.externalLink className="inline ml-1" size={16} />
          </a>
        </div>
      </div>
      <ScrollToBottom className="w-full flex-1 overflow-y-auto px-4">
        {history.map((message, idx) => (
          <Message {...message} key={idx} />
        ))}
      </ScrollToBottom>
      <div className="w-full py-4 flex px-4">
        <Input
          type="text"
          placeholder={getInputPlaceholder(status)}
          value={inputText}
          disabled={status !== "idle"}
          autoFocus
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
        />
        <Button variant="default" className="ml-2" onClick={handleSend}>
          Send
        </Button>
        <Button
          variant={status === "recording" ? "destructive" : "default"}
          className="ml-2"
          onClick={handleRecordClick}
        >
          <RecordingIcon size={16} />
        </Button>
      </div>
    </div>
  );
}
