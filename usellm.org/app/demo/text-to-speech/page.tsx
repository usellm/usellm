"use client";
import { Textarea } from "@/components/ui/textarea";
import useLLM from "@/usellm";
import { useState } from "react";

export default function TextToSpeech() {
  const [text, setText] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const llm = useLLM({ serviceUrl: "/api/llm" });

  async function handleSpeakClick() {
    if (!text) return;
    const { audioUrl } = await llm.speak({ text });
    setAudioUrl(audioUrl);
  }

  return (
    <div className="p-4 overflow-y-auto">
      <h2 className="font-semibold text-2xl">Text to Speech</h2>
      <textarea
        className="p-2 border rounded w-full block mt-4 dark:bg-gray-900 dark:text-white"
        placeholder="Enter some text here"
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium my-4"
        onClick={handleSpeakClick}
      >
        Speak It!
      </button>
      {audioUrl && <audio src={audioUrl} controls />}
    </div>
  );
}
