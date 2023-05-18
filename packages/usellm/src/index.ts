import createLLMService from "./createLLMService";
import useLLM from "./usellm";
export type { OpenAIMessage, ChatStreamCallback } from "./utils";
export type { UseLLMChatOptions, LLMChatResult } from "./usellm";
export type {
  CreateLLMServiceOptions,
  LLMServiceBody,
  LLMServiceTemplate,
} from "./createLLMService";

export default useLLM;

export { createLLMService };
