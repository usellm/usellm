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
  function_call?: string;
  stream?: boolean;
  agent?: string;
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

export interface LLMServiceHandleResponse {
  result: ReadableStream | string;
}

export type LLMAction = (options: object) => Promise<ReadableStream | object>;

export interface OpenAIFunction {
  call: (...args: any[]) => any;
  schema: {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: {
        [key: string]: {
          type: string;
          description: string;
        };
      };
      required: string[];
    };
  };
}

export interface LLMAgent {
  model: string;
  messages?: OpenAIMessage[];
  functions?: OpenAIFunction[];
  function_call?: string;
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  stop?: string | string[];
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: object;
  user?: string;
}

export interface CreateLLMServiceOptions {
  openaiApiKey?: string;
  elvenLabsApiKey?: string;
  playHtApiKey?: string;
  playHtUserId?: string;
  replicateApiKey?: string;
  huggingFaceApiKey?: string;
  googleRefreshToken?: string;
  googleClientID?: string;
  googleClientSecret?: string;
  actions?: string[];
  fetcher?: typeof fetch;
  templates?: { [id: string]: LLMServiceTemplate }; // deprecated
  agents?: { [id: string]: LLMAgent };
  debug?: boolean;
  isAllowed?: (options: LLMServiceHandleOptions) => boolean | Promise<boolean>;
}

export interface LLMCloneVoiceOptions {
  $action: string;
  //for cloning voice
  audioUrl: string;
  voice_name: string;
}

export interface LLMGenerateClonedAudioOptions {
  $action: string;
  //for message to voice
  quality?: string;
  output_format?: string;
  speed?: number;
  sample_rate?: number;
  text: string;
  voiceID: string;
}

export interface LLMServiceCallReplicateOptions {
  input: object;
  version: string;
  timeout?: number;
}

export interface LLMServiceCallHuggingFace {
  data: { inputs: string | object; [key: string]: any } | string;
  model: string;
}

export interface LLMServiceSpeakMultilingualOptions {
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