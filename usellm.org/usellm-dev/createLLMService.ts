import OpenAIStream from "./OpenAiStream";
import { CHAT_COMPLETIONS_API_URL, makeErrorResponse } from "./utils";

export interface CreateLLMServiceArgs {
  openaiApiKey?: string;
  fetcher?: typeof fetch;
  options?: object;
}

const defaultOptions = {
  model: "gpt-3.5-turbo",
  max_tokens: 200,
  temperature: 0.8,
};

export default function createLLMService({
  openaiApiKey,
  fetcher = fetch,
  options = defaultOptions,
}: CreateLLMServiceArgs = {}) {
  async function chat(body: object): Promise<ReadableStream | string> {
    if (!("messages" in body)) {
      throw makeErrorResponse(
        "chat expects a key messages containing list of messages"
      );
    }
    if (!("stream" in body)) {
      throw makeErrorResponse("chat expects a key stream set to true or false");
    }
    if (!openaiApiKey) {
      throw makeErrorResponse(
        "OpenAI API key is required. Either pass it directly or set the environgment variable OPENAI_API_KEY"
      );
    }

    const fullBody = { ...body, ...options };
    console.log("fullBody", fullBody);
    if (fullBody.stream) {
      return OpenAIStream({ body: fullBody, openaiApiKey, fetcher });
    } else {
      const response = await fetcher(CHAT_COMPLETIONS_API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        method: "POST",
        body: JSON.stringify(fullBody),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.text();
    }
  }

  async function handle(body: object) {
    if (!("$action" in body)) {
      throw makeErrorResponse("`handle` expects a key $action in the body");
    }
    const { $action, ...rest } = body;
    if ($action === "chat") {
      return chat(rest);
    } else {
      throw makeErrorResponse(`Action "${$action}" is not supported`);
    }
  }

  return { chat, handle };
}
