"use client";
import useLLM from "usellm";
import React, { useState } from "react";

export default function RegisterActionDemo() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState("");

  const llm = useLLM({
    serviceUrl: "https://usellm.org/api/llm", // For testing only. Follow this guide to create your own service URL: https://usellm.org/docs/api-reference/create-llm-service
  });

  async function handleGenerateClick() {
    setStatus("Generating...");
    setImage("");
    const { data } = await llm.callAction("generateHighResImage", {
      prompt: prompt,
    });
    setStatus("");
    setImage(data["output"][0]);
  }

  return (
    <div className="p-4 overflow-y-auto">
      <h2 className="font-semibold text-2xl">
        Replicate Stable Diffusion High Resolution Image:
      </h2>
      <div className="flex my-4">
        <input
          className="p-2 border rounded mr-2 w-full dark:bg-gray-900 dark:text-white"
          type="text"
          placeholder="Enter a prompt here"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium ml-2 "
          onClick={handleGenerateClick}
        >
          Generate Image
        </button>
      </div>

      {status && <div>{status}</div>}

      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="mt-4 rounded"
          src={image}
          alt={prompt}
          width={732}
          height={732}
        />
      )}
    </div>
  );
}
