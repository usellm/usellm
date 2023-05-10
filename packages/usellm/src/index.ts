import createLLMService from "./createLLMService.js";
import useLLM from "./usellm.js";
export type { OpenAIMessage } from "./utils.js";
export type { UseLLMChatOptions } from "./usellm.js";
export type {
  CreateLLMServiceArgs,
  LLMServiceBody,
  LLMServiceTemplate,
} from "./createLLMService.js";

export default useLLM;

export { createLLMService };
