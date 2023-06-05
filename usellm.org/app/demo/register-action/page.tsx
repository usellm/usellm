"use client";
import useLLM from "usellm";
import React, { useState } from "react";

export default function RegisterActionDemo() {
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");

  const llm = useLLM({
    serviceUrl: "/api/llm", // For testing only. Follow this guide to create your own service URL: https://usellm.org/docs/api-reference/create-llm-service
  });

  async function handleGenerateClick() {
    setAnswer("");
    const { data } = await llm.callAction("replicateText", {
      text: text,
    });

    setAnswer(data["output"]);
  }

  return (
    <div className="p-4 overflow-y-auto">
      <h2 className="font-semibold text-2xl">Register Template Demo:</h2>
      <div className="flex my-4">
        <input
          className="p-2 border rounded mr-2 w-full dark:bg-gray-900 dark:text-white"
          type="text"
          placeholder="Enter a text here"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium ml-2 "
          onClick={handleGenerateClick}
        >
          Send
        </button>
      </div>

      <div>Answer:</div>
      <pre>{answer}</pre>
    </div>
  );
}
