"use client";
import { useState } from "react";
import useLLM from "usellm";

export default function HomePage() {
  const llm = useLLM("/api/llmservice");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");

  const handleClick = () => {
    llm.chat({
      template: "tutorial-generator",
      inputs: { topic },
      stream: true,
      onStream: (message) => setResult(message.content),
    });
  };

  return (
    <div className="p-4">
      <input
        className="p-2 border rounded mr-2"
        type="text"
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button
        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 w-20"
        onClick={handleClick}
      >
        Send
      </button>
      <div className="whitespace-pre-wrap">{result}</div>
    </div>
  );
}
