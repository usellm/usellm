"use client";

import useLLM, { OpenAIMessage } from "usellm";
import { useState } from "react";
import { stat } from "fs";

export default function CloneVoice() {
  const [status, setStatus] = useState<Status>("idle");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [voiceID, setVoiceID] = useState<string>("");
  const [audioUrlReturn, setAudioUrlReturn] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [clonedVoiceID, setClonedVoiceId] = useState<string>("");
  const llm = useLLM({
    serviceUrl: "https://usellm.org/api/llm", // For testing only. Follow this guide to create your own service URL: https://usellm.org/docs/api-reference/create-llm-service
  });

  async function handleClick() {
    if (status === "idle") {
      await llm.record();
      setStatus("recording");
    } else if (status === "recording") {
      setStatus("thinking");
      const { audioUrl } = await llm.stopRecording();
      setAudioUrl(audioUrl);
      setStatus("idle");
    }
  }

  async function handleSubmit(){
    if(status==="idle"){
      setStatus("Generating Audio");
      const {audioUrlReturn} = await llm.generateClonedAudio({
        voiceID,
        text,
      })
      setAudioUrlReturn(audioUrlReturn);
      setStatus("idle");
    }
  }

  async function handleCloneVoice(){
    if(status === "idle"){
      setStatus("cloning");
      const {voiceID} = await llm.cloneVoice({
        audioUrl: audioUrl,
        voice_name: name,
      });
      setClonedVoiceId(voiceID);
      setVoiceID(voiceID);
      setStatus("idle");
    }
  }

  const Icon = status === "recording" ? Square : Mic;

  return (
    <div className="p-4 items-start overflow-y-auto">
      <h2 className="font-semibold text-2xl">AI Voice Cloning</h2>
      <button
        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium mt-4 "
        onClick={handleClick}
      >
      <Icon />
      </button>
    
      {status !== "idle" && (
        <div className="mt-4 text-lg">{capitalize(status)}...</div>
      )}

      <input
        className="p-2 border rounded w-full block mt-4 dark:bg-gray-900 dark:text-white"
        placeholder="Enter the voice Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" onClick={handleCloneVoice} className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium mt-4 ">Clone Voice</button>
      {
        clonedVoiceID && (
          <div className="mt-2 text-md">Your unique voice ID is {voiceID}</div>
        )
      }
      <input
        className="p-2 border rounded w-full block mt-4 dark:bg-gray-900 dark:text-white"
        placeholder="Enter your voice ID"
        value={voiceID}
        onChange={(e) => setVoiceID(e.target.value)}
      />
      <textarea
        className="p-2 border rounded w-full block mt-4 dark:bg-gray-900 dark:text-white"
        placeholder="Enter some text here"
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <button 
      type="submit" 
      onClick={handleSubmit}
      className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium mt-4 "
      >Generate Voice</button>
      {audioUrlReturn && <audio autoPlay className="mt-4" controls src={audioUrlReturn} />}
    </div>
  );
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

const Mic = () => (
  // you can also use an icon library like `react-icons` here
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" x2="12" y1="19" y2="22"></line>
  </svg>
);

const Square = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
  </svg>
);

type Status =
  | "idle"
  | "recording"
  | "transcribing"
  | "understanding"
  | "thinking"
  | "cloning"
  | "clonedAudio"
  | "Generating Audio"
  | "speaking";
