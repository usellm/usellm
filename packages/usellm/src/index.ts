import createLLMService from "./createLLMService";
import useLLM from "./usellm";
export type { OpenAIMessage, ChatStreamCallback, LLMChatResult } from "./utils";
export type { LLMChatOptions, UseLLMOptions } from "./usellm";
export type {
  CreateLLMServiceOptions,
  LLMServiceChatOptions,
  LLMServiceTemplate,
} from "./createLLMService";

export default useLLM;

export { createLLMService };
