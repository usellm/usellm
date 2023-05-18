import { getChatResponseHeaders } from "@/lib/utils";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createLLMService } from "usellm";

export const runtime = "edge";

export async function OPTIONS(request: Request) {
  const headers = getChatResponseHeaders();
  return new Response(JSON.stringify({ message: "Hello World" }), {
    status: 200,
    headers,
  });
}

export async function GET(request: Request) {
  const headers = getChatResponseHeaders();
  return new Response(JSON.stringify({ message: "Hello World" }), {
    status: 200,
    headers,
  });
}

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

const llmService = createLLMService({
  openaiApiKey: process.env.OPENAI_API_KEY,
  isAllowed: async () => {
    const { success } = await ratelimit.limit("api");
    return success;
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

export async function POST(request: Request) {
  const body = await request.json();
  const headers = getChatResponseHeaders();

  try {
    const data = await llmService.handle({ body });
    return new Response(data, { status: 200, headers });
  } catch (error) {
    return new Response((error as Error).message, { status: 400, headers });
  }
}
