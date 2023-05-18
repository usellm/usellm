import createLLMService from "./createLLMService";
import useLLM from "./usellm";
export type { OpenAIMessage } from "./utils";
export type { UseLLMChatOptions } from "./usellm";
export type {
  CreateLLMServiceOptions as CreateLLMServiceArgs,
  LLMServiceBody,
  LLMServiceTemplate,
} from "./createLLMService";

export default useLLM;

export { createLLMService };
