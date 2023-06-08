import { OpenAIMessage } from "../shared/types";

export interface LLMServiceTemplate {
  id: string;
  systemPrompt?: string;
  userPrompt?: string;
  model?: string;
  temperature?: number;
  top_p?: number;
  n?: number;
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: number;
}

export interface LLMServiceChatOptions {
  $action?: string;
  messages?: OpenAIMessage[];
  stream?: boolean;
  template?: string;
  inputs?: object;
  user?: string;
}

export interface LLMServiceTranscribeOptions {
  $action?: string;
  audioUrl?: string;
  language?: string;
  prompt?: string;
}

export interface LLMServiceEmbedOptions {
  $action?: string;
  input?: string | string[];
  user?: string;
  model?: string;
}

export interface LLMServiceHandleOptions {
  body: object;
  request?: Request;
}

export interface LLMServiceSpeakOptions {
  $action?: string;
  text?: string;
  model_id?: string;
  voice_id?: string;
  voice_settings?: { stability: number; similarity_boost: number };
}

export interface LLMServiceGenerateImageOptions {
  $action?: string;
  prompt: string;
  n?: number;
  size?: string;
  response_format?: string;
  user?: string;
}

export interface LLMServiceEditImageOptions {
  $action?: string;
  image: string;
  mask?: string;
  prompt?: string;
  n?: number;
  size?: string;
  response_format?: string;
  user?: string;
}

export interface LLMServiceImageVariationOptions {
  $action?: string;
  image: string;
  n?: number;
  size?: string;
  response_format?: string;
  user?: string;
}

export interface LLMServiceVoiceChatOptions {
  $action?: string;
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

export interface LLMServiceHandleResponse {
  result: ReadableStream | string;
}

export type LLMAction = (options: object) => Promise<ReadableStream | object>;

export interface CreateLLMServiceOptions {
  openaiApiKey?: string;
  elvenLabsApiKey?: string;
  replicateApiKey?: string;
  actions?: string[];
  fetcher?: typeof fetch;
  templates?: { [id: string]: LLMServiceTemplate };
  debug?: boolean;
  isAllowed?: (options: LLMServiceHandleOptions) => boolean | Promise<boolean>;
}

export interface LLMServiceCallReplicateOptions {
  input: object;
  version: string;
  timeout?: number;
}
