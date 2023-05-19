"use client";
import { useRef } from "react";
import {
  OpenAIMessage,
  ChatStreamCallback,
  streamOpenAIResponse,
  LLMChatResult,
  makeErrorResponse,
} from "./utils";

export interface LLMChatOptions {
  messages?: OpenAIMessage[];
  stream?: boolean;
  template?: string;
  inputs?: object;
  onStream?: ChatStreamCallback;
}

export interface LLMRecordOptions {
  deviceId?: string;
}

export interface LLMTranscribeOptions {
  audioUrl: string;
}

export interface UseLLMOptions {
  serviceUrl?: string;
  fetcher?: typeof fetch;
}

export default function useLLM({
  serviceUrl,
  fetcher = fetch,
}: UseLLMOptions = {}) {
  async function chat({
    messages = [],
    stream = false,
    template,
    inputs,
    onStream,
  }: LLMChatOptions): Promise<LLMChatResult> {
    const response = await fetcher(`${serviceUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        stream,
        $action: "chat",
        template,
        inputs,
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    if (stream) {
      return streamOpenAIResponse(response, onStream);
    } else {
      const resJson = await response.json();
      const message = resJson.choices[0].message;
      return { message };
    }
  }

  const recordingRef = useRef<{
    mediaRecorder: MediaRecorder;
    audioChunks: Blob[];
  } | null>(null);

  async function record({ deviceId }: LLMRecordOptions = {}) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: deviceId ? { deviceId } : true,
    });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: Blob[] = [];
    recordingRef.current = { mediaRecorder, audioChunks };
    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });
    mediaRecorder.start();
  }

  async function stopRecording() {
    return new Promise<{ audioUrl: string }>((resolve, reject) => {
      if (!recordingRef.current) {
        reject("No recording in progress");
        return;
      }
      const { mediaRecorder, audioChunks } = recordingRef.current;
      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        recordingRef.current = null;
        const audioUrl = URL.createObjectURL(audioBlob);
        resolve({ audioUrl });
      });
      mediaRecorder.stop();
    });
  }

  async function transcribe({ audioUrl }: LLMTranscribeOptions) {
    const response = await fetcher(`${serviceUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audioUrl,
        $action: "transcribe",
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  return { chat, record, stopRecording, transcribe };
}
