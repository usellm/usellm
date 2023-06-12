import { createLLMService } from "./server/llm-service";
import useLLM from "./client/usellm";
import { LLMProvider } from "./client/llm-provider";
export type {
  OpenAIMessage,
  ChatStreamCallback,
  LLMChatResult,
  ScoreEmbeddingsOptions,
} from "./shared/types";
export type {
  LLMChatOptions,
  LLMEmbedOptions,
  LLMRecordOptions,
  LLMTranscribeOptions,
  GenerateImageOptions,
  LLMCallActionOptions,
  UseLLMOptions,
  SpeakOptions,
  EditImageOptions,
  ImageVariationOptions,
  LLMVoiceChatOptions,
} from "./client/types";
export type {
  LLMServiceTemplate,
  LLMServiceChatOptions,
  LLMServiceTranscribeOptions,
  LLMServiceEmbedOptions,
  LLMServiceHandleOptions,
  LLMServiceSpeakOptions,
  LLMServiceGenerateImageOptions,
  LLMServiceEditImageOptions,
  LLMServiceImageVariationOptions,
  LLMServiceVoiceChatOptions,
  LLMServiceHandleResponse,
  LLMAction,
  CreateLLMServiceOptions,
} from "./server/types";

export default useLLM;

export { createLLMService, LLMProvider };
