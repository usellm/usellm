import { OpenAIMessage, ChatStreamCallback } from "../shared/types";

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
  transcribeAudioUrl: string;
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

export interface LLMCallReplicateOptions {
  input: object;
  version: string;
  timeout: number;
}
