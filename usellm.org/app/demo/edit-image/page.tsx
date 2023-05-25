"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent } from "react";
import useLLM from "usellm";

export default function EditImageDemoPage() {
  const llm = useLLM({ serviceUrl: "/api/llm" });
  const [imageUrl, setImageUrl] = React.useState("");
  const [prompt, setPrompt] = React.useState("");
  const [resultImageUrl, setResultImageUrl] = React.useState("");

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await llm.imageToDataURL(file);
    setImageUrl(url);
  }

  async function handleGenerateClick() {
    setResultImageUrl("");
    const { images } = await llm.editImage({ imageUrl, prompt });
    setResultImageUrl(images[0]);
  }

  return (
    <div className="max-w-4xl w-full mx-auto my-4">
      <h1 className="font-medium text-4xl text-center">Edit Image</h1>
      <div className="flex flex-col mt-4">
        <Input
          type="file"
          className="self-start"
          placeholder="Upload Image"
          onChange={handleImageUpload}
        />
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="mt-4"
            src={imageUrl}
            alt="input-image"
            width={256}
            height={256}
          />
        )}
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
      </div>

      {resultImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="mt-4"
          src={resultImageUrl}
          alt={prompt}
          width={256}
          height={256}
        />
      )}
    </div>
  );
}
