import createLLMService from "./createLLMService.js";
import useLLM from "./usellm.js";
export type {
  OpenAIMessage,
  ChatStreamCallback,
  LLMChatResult,
} from "./utils.js";
export type { LLMChatOptions, UseLLMOptions } from "./usellm.js";
export type {
  CreateLLMServiceOptions,
  LLMServiceChatOptions,
  LLMServiceTemplate,
} from "./createLLMService";

export default useLLM;

export { createLLMService };
