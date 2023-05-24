"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useLLM from "@/usellm";
import { useState } from "react";

export default function TextToSpeechDemoPage() {
  const [text, setText] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const llm = useLLM({ serviceUrl: "/api/llm" });

  async function handleSpeakClick() {
    if (!text) return;
    const { audioUrl } = await llm.speak({ text });
    setAudioUrl(audioUrl);
  }

  return (
    <div className="max-w-4xl w-full mx-auto my-4">
      <h1 className="font-medium text-4xl text-center">Text to Speech</h1>
      <Textarea
        className="mt-4"
        placeholder="Enter some text here"
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={handleSpeakClick} className="my-4">
        Speak
      </Button>
      {audioUrl && <audio src={audioUrl} controls />}
    </div>
  );
}
