export interface OpenAIMessage {
  content: string;
  role: string;
  user?: string;
}

export type ChatStreamCallback = (options: {
  message: OpenAIMessage;
  isFirst: boolean;
  isLast: boolean;
}) => void;

export const CHAT_COMPLETIONS_API_URL =
  "https://api.openai.com/v1/chat/completions";

export function makeErrorResponse(message: string) {
  return new Error(JSON.stringify({ message }));
}

export async function streamOpenAIResponse(
  response: Response,
  callback?: ChatStreamCallback
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
    const message = { content: text, role: "assistant" };
    callback && callback({ message, isFirst, isLast: done });
    isFirst = false;
  }
  const message = { content: text, role: "assistant" };
  return { message };
}

export function fillPrompt(str: string, data: object = {}) {
  return Object.entries(data).reduce((res, [key, value]) => {
    // lookbehind expression, only replaces if mustache was not preceded by a backslash
    const mainRe = new RegExp(`(?<!\\\\){{\\s*${key}\\s*}}`, "g");
    // this regex is actually (?<!\\){{\s*<key>\s*}} but because of escaping it looks like that...
    const escapeRe = new RegExp(`\\\\({{\\s*${key}\\s*}})`, "g");
    // the second regex now handles the cases that were skipped in the first case.
    return res.replace(mainRe, value.toString()).replace(escapeRe, "$1");
  }, str);
}
