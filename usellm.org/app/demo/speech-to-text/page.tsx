/* 
- Copy and paste this code into your Next.js applications's "app/page.tsx" file to get started 
- Make sure to run "npm install usellm" to install the useLLM pacakge
- Replace the `serviceUrl` below with your own service URL for production
*/
"use client";
import useLLM from "usellm";
import React, { useState } from "react";

export default function SpeechToText() {
  const [audioUrl, setAudioUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("");

  const llm = useLLM({
    serviceUrl: "https://usellm.org/api/llm", // For testing only. Follow this guide to create your own service URL: https://usellm.org/docs/api-reference/create-llm-service
  });

  const startRecording = async () => {
    await llm.record();
    setStatus("Recording...");
  };

  const stopRecording = async () => {
    const { audioUrl } = await llm.stopRecording();
    setAudioUrl(audioUrl);
    setStatus("");
  };

  const transcribe = async () => {
    setStatus("Transcribing...");
    const { text } = await llm.transcribe({ audioUrl });
    setTranscript(text);
    setStatus("");
  };

  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="font-semibold text-2xl">Speech to Text</h1>
      <div className="my-4">
        <button
          className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium"
          onClick={startRecording}
        >
          Record
        </button>
        <button
          className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium ml-2"
          onClick={stopRecording}
        >
          Stop
        </button>
        <button
          className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium ml-2"
          onClick={transcribe}
        >
          Transcribe
        </button>
      </div>

      {audioUrl && <audio className="mb-4" src={audioUrl} controls />}

      <p>{status}</p>

      {transcript && (
        <p>
          <b>Transcript:</b> {transcript}
        </p>
      )}
    </div>
  );
}
