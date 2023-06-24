"use client";
import { useState } from "react";
import { ChatStreamCallback, OpenAIMessage } from "../shared/types";
import useLLM from "./usellm";

interface UseChatOptions {
  initialMessages?: OpenAIMessage[];
  initialInput?: string;
  agent?: string;
  stream?: boolean;
  serviceUrl?: string;
  fetcher?: typeof fetch;
  onStream?: ChatStreamCallback;
}

const useChat = ({
  initialMessages = [],
  initialInput = "",
  stream = false,
  agent,
  serviceUrl,
  fetcher,
  onStream,
}: UseChatOptions = {}) => {
  const [input, setInput] = useState(initialInput);
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const llm = useLLM({ serviceUrl, fetcher });

  async function _sendOpenAIMessage(message: OpenAIMessage) {
    const newMessages = [...messages, message];
    setMessages(newMessages);
    setIsLoading(true);
    setInput("");
    const res = await llm.chat({
      messages: newMessages,
      agent,
      stream,
      onStream: (data) => {
        setMessages([...newMessages, data.message]);
        onStream && onStream(data);
      },
    });
    setMessages([...newMessages, res.message]);
    setIsLoading(false);
  }

  async function sendMessage() {
    if (!input) {
      console.error("[useChat] No input provided!");
      return;
    }
    await _sendOpenAIMessage({ role: "user", content: input });
  }

  async function callFunction(options: { function: string; arguments: any }) {
    if (!agent) {
      throw new Error(
        "No agent provided, please provide an `agent` in `useChat` to call a function"
      );
    }
    return llm.callAgentFunction({ agent, ...options });
  }

  async function sendFunctionOutput(options: {
    function: string;
    output: any;
  }) {
    _sendOpenAIMessage({
      role: "function",
      name: options.function,
      content: JSON.stringify(options.output, null, 2),
    });
  }

  return {
    messages,
    setMessages,
    sendMessage,
    input,
    setInput,
    isLoading,
    callFunction,
    sendFunctionOutput,
  };
};

export default useChat;
