import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "./eventsource-parser";
import { CHAT_COMPLETIONS_API_URL } from "./utils";

export interface OpenAIStreamOptions {
  body: object;
  openaiApiKey?: string;
  fetcher?: typeof fetch;
}

export default async function OpenAIStream(options: OpenAIStreamOptions) {
  const { body, openaiApiKey, fetcher = fetch } = options;

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetcher(CHAT_COMPLETIONS_API_URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiApiKey}`,
    },
    method: "POST",
    body: JSON.stringify(body),
  });

  if (res.status != 200 || !res.body) {
    throw new Error(await res.text());
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      if (res.body) {
        for await (const chunk of res.body as any) {
          parser.feed(decoder.decode(chunk));
        }
      }
    },
  });

  return stream;
}
