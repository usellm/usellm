import {
  OpenAIMessage,
  OpenAIResponseCallback,
  streamOpenAIResponse,
} from "./utils.js";

export interface UseLLMChatOptions {
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
  }: UseLLMChatOptions) {
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
      if (onError) {
        return onError(error);
      } else {
        throw error;
      }
    }

    if (stream) {
      return streamOpenAIResponse(response, onStream);
    } else {
      const resJson = await response.json();
      const message = resJson.choices[0].message;
      onSuccess && onSuccess(message);
      return message;
    }
  }

  return { chat };
}
