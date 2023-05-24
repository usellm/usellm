export interface OpenAIMessage {
  content: string;
  role: string;
  user?: string;
}

export type ChatStreamCallback = (result: {
  message: OpenAIMessage;
  isFirst: boolean;
  isLast: boolean;
}) => void;

export interface LLMChatResult {
  message: OpenAIMessage;
}

export const CHAT_COMPLETIONS_API_URL =
  "https://api.openai.com/v1/chat/completions";

export const AUDIO_TRANSCRIPTIONS_API_URL =
  "https://api.openai.com/v1/audio/transcriptions";

export const EMBEDDINGS_API_URL = "https://api.openai.com/v1/embeddings";

export const getTextToSpeechApiUrl = (voice_id: string) =>
  `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`;

export const ELVEN_LABS_DEFAULT_MODEL_ID = "eleven_monolingual_v1";

export const ELVEN_LABS_DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

export class ResponseError extends Error {
  status?: number;
}

export function makeErrorResponse(
  message: string,
  status?: number
): ResponseError {
  const error = new ResponseError(JSON.stringify({ message }));
  (error as any).status = status || 500;
  return error;
}

export async function streamOpenAIResponse(
  response: Response,
  callback?: ChatStreamCallback
): Promise<LLMChatResult> {
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

export function dataURLToBlob(dataurl: string): Blob {
  let arr = dataurl.split(",");

  if (!arr || arr.length < 2) {
    throw new Error("Invalid data URL");
  }

  let mimeMatch = arr[0]?.match(/:(.*?);/);

  if (!mimeMatch || !arr[1]) {
    throw new Error("Invalid data URL");
  }

  let mime = mimeMatch[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}
