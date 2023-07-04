import { OpenAIMessage, ChatStreamCallback } from "../shared/types";

export interface LLMChatOptions {
  messages?: OpenAIMessage[];
  stream?: boolean;
  agent?: string;
  function_call?: string;
  onStream?: ChatStreamCallback;
  [key: string]: any;
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
  voice: {
    languageCode: string;
    name?: string;
    ssmlGender?: "SSML_VOICE_GENDER_UNSPECIFIED" | "MALE" | "FEMALE" | "NEUTRAL" | null | undefined;
    customVoice?: {
      model: string;
      reportedUsage?: "REPORTED_USAGE_UNSPECIFIED" | "REALTIME" | "OFFLINE" | null | undefined;
    }
  }
  audioConfig: {
    audioEncoding: "LINEAR16" | "MP3" | "OGG_OPUS" | "MULAW" | "ALAW";
    speakingRate?: number;
    pitch?: number;
    volumeGainDb?: number;
    sampleRateHertz?: number;
    effectsProfileId?: [string];
  }
}

export interface LLMCloneVoiceOptions {
  //for cloning voice
  audioUrl: string;
  voice_name: string;
}

export interface LLMGenerateClonedAudioOptions {
  //for message to voice
  quality?: string;
  output_format?: string;
  speed?: number;
  sample_rate?: number;
  text: string;
  voiceID: string;
}

export interface LLMCallReplicateOptions {
  input: object;
  version: string;
  timeout: number;
}

export interface LLMCallHuggingFaceOptions {
  data: { inputs: string | object; [key: string]: any } | string;
  model: string;
}

export interface LLMCallAgentFunctionOptions {
  agent: string;
  function: string;
  arguments: any;
}

export interface LLMSpeakMultilingualOptions {
  $action?: string;
  input: {
    text: string;
  };
  voice: {
    languageCode: string;
    name?: string;
    ssmlGender?: "SSML_VOICE_GENDER_UNSPECIFIED" | "MALE" | "FEMALE" | "NEUTRAL" | null | undefined;
    customVoice?: {
      model: string;
      reportedUsage?: "REPORTED_USAGE_UNSPECIFIED" | "REALTIME" | "OFFLINE" | null | undefined;
    }
  }
  audioConfig: {
    audioEncoding: "LINEAR16" | "MP3" | "OGG_OPUS" | "MULAW" | "ALAW";
    speakingRate?: number;
    pitch?: number;
    volumeGainDb?: number;
    sampleRateHertz?: number;
    effectsProfileId?: [string];
  }
}
