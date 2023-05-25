"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent } from "react";
import useLLM from "usellm";

export default function ImageVariationsDemoPage() {
  const llm = useLLM({ serviceUrl: "/api/llm" });
  const [imageUrl, setImageUrl] = React.useState("");
  const [resultImageUrl, setResultImageUrl] = React.useState("");

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await llm.imageToDataURL(file);
    setImageUrl(url);
  }

  async function handleGenerateClick() {
    setResultImageUrl("");
    const { images } = await llm.imageVariation({ imageUrl });
    setResultImageUrl(images[0]);
  }

  return (
    <div className="max-w-4xl w-full mx-auto my-4 px-4">
      <h1 className="font-medium text-4xl text-center">
        Generate Image Variations
      </h1>
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
        <Button onClick={handleGenerateClick} className="mt-4 self-start">
          Generate Variation
        </Button>
      </div>

      {resultImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="mt-4"
          src={resultImageUrl}
          alt="result"
          width={256}
          height={256}
        />
      )}
    </div>
  );
}
