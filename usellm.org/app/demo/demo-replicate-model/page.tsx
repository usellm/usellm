"use client";
import { useState } from "react";
import useLLM from "usellm";

// In this demo we will be using stability-ai/stablelm-tuned-alpha-7b model
// https://replicate.com/stability-ai/stablelm-tuned-alpha-7b/api

export default function DemoReplicateModel() {
  const llm = useLLM({
    serviceUrl: "https://usellm.org/api/llm", // For testing only. Follow this guide to create your own service URL: https://usellm.org/docs/api-reference/create-llm-service
  });

  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [modelId, setModelId] = useState(
    "c49dae362cbaecd2ceabb5bd34fdb68413c4ff775111fea065d259d577757beb"
  );
  const [time, setTime] = useState("10");

  async function handleClick() {
    setResult("");
    const response = await llm.callReplicate({
      modelId: modelId,
      input: { prompt: input },
      time: parseInt(time) * 1000,
    });
    console.log(response);
    setResult(response.output);
  }

  return (
    <div className="p-4 overflow-y-scroll">
      <h2 className="text-2xl font-semibold mb-4">
        Replicate Stable LM Model Demo
      </h2>
      <label className="block mb-2">
        <b>Replicate Model ID</b>
      </label>
      <input
        className="p-2 border rounded mr-2 w-full mb-4 block dark:bg-gray-900 dark:text-white"
        type="text"
        placeholder="Enter Model Id Ex"
        value={modelId}
        onChange={(e) => setModelId(e.target.value)}
      />
      <label className="block mb-2">
        <b>Waiting Time (in seconds)</b>
      </label>
      <input
        className="p-2 border rounded mr-2 w-full mb-4 block dark:bg-gray-900 dark:text-white"
        type="text"
        placeholder="Enter Time in Seconds"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <label className="block mb-2">
        <b>Prompt</b>
      </label>
      <input
        className="p-2 border rounded mr-2 w-full mb-4 block dark:bg-gray-900 dark:text-white"
        type="text"
        placeholder="Enter Prompt"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium"
        onClick={handleClick}
      >
        Generate
      </button>
      <div className="whitespace-pre-wrap my-4">{result}</div>
    </div>
  );
}
