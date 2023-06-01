import { LLMProvider } from "../types";

interface OpenAIProviderOptions {
  openaiApiKey: string;
  fetcher: typeof fetch;
  debug: boolean;
}

export function createOpenAIProvider({
  openaiApiKey,
  fetcher,
  debug,
}: OpenAIProviderOptions): LLMProvider {
  return {
    id: "openai",
    name: "OpenAI",
    description: "Provides access to OpenAI APIs",
    actions: {
      async chat(options) {},

      async transcribe(options) {},

      async embed(options) {},

      async generateImage(options) {},
    },
  };
}
