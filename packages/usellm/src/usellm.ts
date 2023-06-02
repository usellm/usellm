"use client";
import { useContext, useRef } from "react";
import {
  OpenAIMessage,
  ChatStreamCallback,
  streamOpenAIResponse,
  LLMChatResult,
  cosineSimilarity,
  scoreEmbeddings,
} from "./utils";
import { LLMContext } from "./llm-provider";

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

export interface GenerateImageOptions {
  prompt: string;
  n?: number;
  size?: "256x256" | "512x512" | "1024x1024";
}

export interface LLMCallActionOptions {
  $action: string;
  [key: string]: any;
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

export interface EditImageOptions {
  imageUrl: string;
  maskUrl?: string;
  prompt?: string;
  n?: number;
  size?: "256x256" | "512x512" | "1024x1024";
}

export interface ImageVariationOptions {
  imageUrl: string;
  n?: number;
  size?: "256x256" | "512x512" | "1024x1024";
}

export interface LLMVoiceChatOptions {
  // transcribe
  transcribeAudioUrl?: string;
  transcribeLanguage?: string;
  transcribePrompt?: string;
  // chat
  chatMessages?: OpenAIMessage[];
  chatTemplate?: string;
  chatInputs?: object;
  // speak
  speakModelId?: string;
  speechVoideId?: string;
  speechVoiceSettings?: { stability: number; similarity_boost: number };
}

export default function useLLM({
  serviceUrl: argServiceUrl,
  fetcher = fetch,
}: UseLLMOptions = {}) {
  const { serviceUrl: contextServiceUrl } = useContext(LLMContext);

  const serviceUrl = argServiceUrl || contextServiceUrl || "";

  if (!serviceUrl) {
    throw new Error(
      "No serviceUrl provided. Provide one or use LLMProvider to set it globally."
    );
  }

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

  async function generateImage(options: GenerateImageOptions) {
    const response = await fetcher(`${serviceUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...options,
        $action: "generateImage",
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async function editImage(options: EditImageOptions) {
    const { imageUrl, maskUrl, prompt, n, size } = options;

    const response = await fetcher(`${serviceUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        n,
        size,
        image: imageUrl,
        mask: maskUrl,
        $action: "editImage",
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async function imageVariation(options: ImageVariationOptions) {
    const { imageUrl, n, size } = options;

    const response = await fetcher(`${serviceUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: imageUrl,
        n: n,
        size: size,
        $action: "imageVariation",
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async function fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function imageToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, img.width, img.height);
        const dataUrl = canvas.toDataURL("image/png");
        resolve(dataUrl);
      };
      img.onerror = reject;
    });
  }

  async function voiceChat(options: LLMVoiceChatOptions) {
    return callAction({
      ...options,
      $action: "voiceChat",
    });
  }

  async function callAction(options: LLMCallActionOptions) {
    const response = await fetcher(`${serviceUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  return {
    callAction,
    chat,
    voiceChat,
    record,
    stopRecording,
    transcribe,
    embed,
    cosineSimilarity,
    scoreEmbeddings,
    speak,
    generateImage,
    fileToDataURL,
    imageToDataURL,
    editImage,
    imageVariation,
  };
}
