import createLLMService, { CreateLLMServiceArgs } from "./createLLMService";
import {
  OpenAIMessage,
  OpenAIResponseCallback,
  streamOpenAIResponse,
} from "./utils";

export interface ChatOptions {
  messages?: OpenAIMessage[];
  stream?: boolean;
  template?: string;
  inputs?: object;
  onStream?: OpenAIResponseCallback;
  onSuccess?: (message: OpenAIMessage) => void;
  onError?: (error: Error) => void;
}

export default function useLLM(
  serviceUrl: string,
  fetcher: typeof fetch = fetch
) {
  async function chat({
    messages = [],
    stream = false,
    template,
    inputs,
    onStream,
    onSuccess,
    onError,
  }: ChatOptions) {
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

    if (!response.ok || !response.body) {
      const error = new Error(await response.text());
      onError ? onError(error) : console.error("Chat request failed", error);
      return;
    }

    if (stream) {
      const logStream: OpenAIResponseCallback = (message, isFirst, isLast) =>
        console.log("streaming:", { message, isFirst, isLast });
      await streamOpenAIResponse(response, onStream || logStream);
    } else {
      const resJson = await response.json();
      const message = resJson.choices[0].message;
      onSuccess
        ? onSuccess(message)
        : console.log("Received message:", message);
    }
  }

  return { chat };
}

export { createLLMService };