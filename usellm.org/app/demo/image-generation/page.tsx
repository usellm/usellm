"use client";
import useLLM from "usellm";
import React, { useState } from "react";

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("");
  const llm = useLLM({ serviceUrl: "/api/llm" });

  async function handleGenerateClick() {
    setStatus("Generating...");
    setImage("");
    const { images } = await llm.generateImage({ prompt });
    setImage(images[0]);
    setStatus("");
  }

  return (
    <div className="p-4 overflow-y-auto">
      <h2 className="font-semibold text-2xl">Image Generation</h2>
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
          Generate
        </button>
      </div>

      {status && <div>{status}</div>}

      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="mt-4 rounded"
          src={image}
          alt={prompt}
          width={256}
          height={256}
        />
      )}
    </div>
  );
}
