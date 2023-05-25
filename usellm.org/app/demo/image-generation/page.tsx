"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useLLM from "@/usellm";
import React, { useState } from "react";

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const llm = useLLM({ serviceUrl: "/api/llm" });

  async function handleGenerateClick() {
    setImage("");
    const { images } = await llm.generateImage({ prompt });
    setImage(images[0]);
  }

  return (
    <div className="max-w-4xl w-full mx-auto my-4">
      <h1 className="font-medium text-4xl text-center">Image Generation</h1>
      <div className="flex mt-4">
        <Input
          type="text"
          placeholder="Enter a prompt here"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button onClick={handleGenerateClick} className="ml-2">
          Generate
        </Button>
      </div>

      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="mt-4"
          src={image}
          alt={prompt}
          width={256}
          height={256}
        />
      )}
    </div>
  );
}
