// react component similar to other demo pages showing llm.editImage usage

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent } from "react";
import useLLM from "usellm";

export default function EditImageDemoPage() {
  const llm = useLLM();
  const [imageUrl, setImageUrl] = React.useState("");
  const [prompt, setPrompt] = React.useState("");
  const [resultImageUrl, setResultImageUrl] = React.useState("");

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await llm.fileToDataURL(file);
    setImageUrl(url);
  }

  async function handleGenerateClick() {
    setResultImageUrl("");
    const result = await llm.editImage({ imageUrl, prompt });
    setResultImageUrl(result);
  }

  return (
    <div className="max-w-4xl w-full mx-auto my-4">
      <h1 className="font-medium text-4xl text-center">Edit Image</h1>
      <div className="flex mt-4">
        <Input type="file" onChange={handleImageUpload} />
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
        <Input
          type="text"
          className="mt-4"
          placeholder="Enter a prompt here"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button onClick={handleGenerateClick} className="ml-2">
          Generate
        </Button>
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
