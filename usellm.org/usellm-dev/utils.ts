export interface OpenAIMessage {
  content: string;
  role: string;
  user?: string;
}

export type OpenAIResponseCallback = (
  message: OpenAIMessage,
  isFirst: boolean,
  isLast: boolean
) => void;

export const CHAT_COMPLETIONS_API_URL =
  "https://api.openai.com/v1/chat/completions";

export function makeErrorResponse(message: string) {
  return new Error(JSON.stringify({ message }));
}

export async function streamOpenAIResponse(
  response: Response,
  callback?: OpenAIResponseCallback
) {
  if (!response.body) {
    throw Error("Response has no body");
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let text = "";
  let isFirst = true;
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    text += chunkValue;
    callback && callback({ content: text, role: "assistant" }, isFirst, done);
    isFirst = false;
  }
  return { content: text, role: "assistant" };
}
