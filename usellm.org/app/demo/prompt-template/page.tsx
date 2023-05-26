"use client";
import { useState } from "react";
import useLLM from "usellm";

export default function PromptTemplate() {
  const llm = useLLM({ serviceUrl: "/api/llm" });
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");

  const handleClick = () => {
    setResult("");
    llm.chat({
      template: "tutorial-generator",
      inputs: { topic },
      stream: true,
      onStream: ({ message }) => setResult(message.content),
    });
  };

  return (
    <div className="p-4 overflow-y-scroll">
      <h2 className="text-2xl font-semibold mb-4">Tutorial Generator</h2>
      <input
        className="p-2 border rounded mr-2 w-full mb-4 block"
        type="text"
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button
        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300"
        onClick={handleClick}
      >
        Generate Tutorial
      </button>
      <div className="whitespace-pre-wrap my-4">{result}</div>
    </div>
  );
}
