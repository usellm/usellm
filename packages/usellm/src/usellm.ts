import {
  OpenAIMessage,
  ChatStreamCallback,
  streamOpenAIResponse,
} from "./utils";

export interface UseLLMChatOptions {
  messages?: OpenAIMessage[];
  stream?: boolean;
  template?: string;
  inputs?: object;
  onStream?: ChatStreamCallback;
}

interface LLMChatResult {
  message: OpenAIMessage; // the final message received from OpenAI
}

export interface UseLLMOptions {
  serviceUrl?: string;
  fetcher?: typeof fetch;
}

export default function useLLM({
  serviceUrl,
  fetcher = fetch,
}: UseLLMOptions = {}) {
  async function chat({
    messages = [],
    stream = false,
    template,
    inputs,
    onStream,
  }: UseLLMChatOptions): Promise<LLMChatResult> {
    const response = await fetcher(`${serviceUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        stream,
        $action: "chat",
        template,
        inputs,
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    if (stream) {
      return streamOpenAIResponse(response, onStream);
    } else {
      const resJson = await response.json();
      const message = resJson.choices[0].message;
      return { message };
    }
  }

  return { chat };
}
