"use client";
import useLLM from "usellm";
import { useState } from "react";

export default function MyComponent() {
  const llm = useLLM({ serviceUrl: "https://usellm.org/api/llmservice" });
  const [result, setResult] = useState("");

  const handleClick = () => {
    llm.chat({
      messages: [{ role: "user", content: "What is a language model?" }],
      stream: true,
      onStream: ({ message }) => setResult(message.content),
    });
  };

  return (
    <div className="p-4">
      <button
        className="border p-2 bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 rounded w-20 mb-2"
        onClick={handleClick}
      >
        Send
      </button>
      <div>{result}</div>
    </div>
  );
}
