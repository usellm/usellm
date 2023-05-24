"use client";
import { useRef } from "react";
import {
  OpenAIMessage,
  ChatStreamCallback,
  streamOpenAIResponse,
  LLMChatResult,
} from "./utils";

export interface LLMChatOptions {
  messages?: OpenAIMessage[];
  stream?: boolean;
  template?: string;
  inputs?: object;
  onStream?: ChatStreamCallback;
}

export interface LLMEmbedOptions {
  input: string | string[];
  user?: string;
}

export interface LLMRecordOptions {
  deviceId?: string;
}

export interface LLMTranscribeOptions {
  audioUrl: string;
  language?: string;
  prompt?: string;
}

export interface UseLLMOptions {
  serviceUrl?: string;
  fetcher?: typeof fetch;
}

export interface SpeakOptions {
  text: string;
  model_id?: string;
  voice_id?: string;
  voice_settings?: { stability: number; similarity_boost: number };
}

export interface ScoreEmbeddingsOptions {
  embeddings: Array<Array<number>>;
  query: number[];
  top?: number;
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
    audioStream: MediaStream;
  } | null>(null);

  async function record({ deviceId }: LLMRecordOptions = {}) {
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: deviceId ? { deviceId } : true,
    });
    const mediaRecorder = new MediaRecorder(audioStream);
    const audioChunks: Blob[] = [];
    recordingRef.current = { mediaRecorder, audioChunks, audioStream };
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
      const { mediaRecorder, audioChunks, audioStream } = recordingRef.current;
      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, {
          type: "audio/ogg; codecs=opus",
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve({ audioUrl: base64data });
        };
        reader.readAsDataURL(audioBlob);
      });
      mediaRecorder.stop();
      audioStream.getTracks().forEach((track) => track.stop());
    });
  }

  async function transcribe({
    audioUrl,
    language,
    prompt,
  }: LLMTranscribeOptions) {
    const response = await fetcher(`${serviceUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audioUrl,
        language,
        prompt,
        $action: "transcribe",
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async function embed({ input, user }: LLMEmbedOptions) {
    const response = await fetcher(`${serviceUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input,
        user,
        $action: "embed",
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  function dotProduct(vecA: number[], vecB: number[]): number {
    let product = 0;
    if (vecA.length !== vecB.length)
      throw new Error("Vectors must be same length");
    for (let i = 0; i < vecA.length; i++) {
      product += (vecA[i] as number) * (vecB[i] as number);
    }
    return product;
  }

  function magnitude(vec: number[]): number {
    let sum = 0;
    for (let i = 0; i < vec.length; i++) {
      sum += (vec[i] as number) * (vec[i] as number);
    }
    return Math.sqrt(sum);
  }

  function cosineSimilarity(vecA: number[], vecB: number[]): number {
    return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
  }

  function scoreEmbeddings(options: ScoreEmbeddingsOptions) {
    const { embeddings, query, top } = options;
    const scores = embeddings.map((vector) => cosineSimilarity(query, vector));
    const sortedScores = scores
      .map((score, index) => ({ score, index }))
      .sort((a, b) => b.score - a.score)
      .slice(0, top || undefined);
    return sortedScores;
  }

  async function speak(options: SpeakOptions) {
    const response = await fetcher(`${serviceUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...options,
        $action: "speak",
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  return {
    chat,
    record,
    stopRecording,
    transcribe,
    embed,
    cosineSimilarity,
    scoreEmbeddings,
    speak,
  };
}
