"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import useLLM, { OpenAIMessage } from "@/usellm";
import { useState } from "react";

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

type Status =
  | "idle"
  | "recording"
  | "transcribing"
  | "understanding"
  | "thinking"
  | "speaking";

export default function TalkToAIDemoPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const llm = useLLM({ serviceUrl: "/api/llm" });
  const [history, setHistory] = useState<OpenAIMessage[]>([
    {
      role: "system",
      content:
        "You're a voice chatbot powered by the ChatGPT API and developed using useLLM. Reply in a conversational tone, keep answers brief!",
    },
  ]);

  async function handleClick() {
    if (status === "idle") {
      setAudioUrl(null);
      await llm.record();
      setStatus("recording");
    } else if (status === "recording") {
      setStatus("transcribing");
      const { audioUrl } = await llm.stopRecording();
      const { text } = await llm.transcribe({ audioUrl, language: "en" });
      setStatus("understanding");
      const newHistory = [...history, { role: "user", content: text }];
      setHistory(newHistory);
      const { message } = await llm.chat({
        messages: newHistory,
      });
      setHistory([...newHistory, message]);
      setStatus("thinking");
      const { audioUrl: responseAudioUrl } = await llm.speak({
        text: message.content,
      });
      setStatus("speaking");
      setAudioUrl(responseAudioUrl);
      const audio = new Audio(responseAudioUrl);
      await audio.play();
      setStatus("idle");
    }
  }

  const RecordingIcon = status === "recording" ? Icons.square : Icons.mic;

  return (
    <div className="max-w-4xl w-full mx-auto my-4 flex flex-col items-center">
      <h1 className="font-medium text-4xl text-center">Talk to AI</h1>
      <Button
        variant={status === "recording" ? "destructive" : "default"}
        className="mx-auto mt-4"
        onClick={handleClick}
      >
        <RecordingIcon size={16} />
      </Button>
      {status !== "idle" && (
        <div className="text-center mt-4 text-lg">{capitalize(status)}...</div>
      )}
      {audioUrl && <audio className="mt-4" controls src={audioUrl} />}
    </div>
  );
}
