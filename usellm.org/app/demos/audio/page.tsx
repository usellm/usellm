"use client";
import useLLM from "@/usellm";
import React, { useState } from "react";

function AudioRecorder() {
  const [audioUrl, setAudioUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("");

  const llm = useLLM({ serviceUrl: "/api/llm" });

  const startRecording = async () => {
    await llm.record();
    setStatus("recording");
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
  };

  return (
    <div>
      <button
        style={{ margin: 8, padding: 2, border: "1px solid black" }}
        onClick={startRecording}
      >
        Record
      </button>
      <button
        style={{ margin: 8, padding: 2, border: "1px solid black" }}
        onClick={stopRecording}
      >
        Stop
      </button>
      <button
        style={{ margin: 8, padding: 2, border: "1px solid black" }}
        onClick={transcribe}
      >
        Transcribe
      </button>
      <p>{status}</p>
      {audioUrl && <audio src={audioUrl} controls />}
      {transcript && <p>Transcript: {transcript}</p>}
    </div>
  );
}

export default AudioRecorder;
