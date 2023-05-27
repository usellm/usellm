import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createLLMService } from "usellm";

const llmService = createLLMService({
  openaiApiKey: process.env.OPENAI_API_KEY,
  elvenLabsApiKey: process.env.ELVEN_LABS_API_KEY,
  actions: [
    "chat",
    "transcribe",
    "embed",
    "speak",
    "generateImage",
    "editImage",
    "imageVariation",
  ],
  isAllowed: async () => {
    // check if rate limiting has been set up using Upstash Redis REST API
    if (
      process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      const { success } = await ratelimit.limit("api");
      return success;
    }
    return true;
  },
});

llmService.registerTemplate({
  id: "jobot",
  systemPrompt:
    "Your name is Jobot! You have been developed by Jovian to help the world.",
  userPrompt: "Tell me about {{topic}}",
});

llmService.registerTemplate({
  id: "tutorial-generator",
  systemPrompt:
    "You job is to create a short tutorial on a given topic. Use simple words, avoid jargon. Start with an introduction, then provide a few points of explanation, and end with a conclusion",
  userPrompt: "Topic: {{topic}}",
  max_tokens: 200,
  temperature: 0.7,
});

export const runtime = "edge";

export async function OPTIONS(request: Request) {
  const headers = getChatResponseHeaders();
  return new Response(
    JSON.stringify({ message: "Use me as a service URL with useLLM" }),
    {
      status: 200,
      headers,
    }
  );
}

export async function GET(request: Request) {
  const headers = getChatResponseHeaders();
  return new Response(
    JSON.stringify({ message: "Use me as a service URL with useLLM" }),
    {
      status: 200,
      headers,
    }
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const headers = getChatResponseHeaders();

  try {
    const { result } = await llmService.handle({ body, request });
    return new Response(result, { status: 200, headers });
  } catch (error: any) {
    console.error("[LLM Service]", error);
    return new Response(error.message, {
      status: error?.status,
      headers,
    });
  }
}

function getChatResponseHeaders() {
  return {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Referer, Authorization, API_URL",
  };
}

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "10 s"),
});
