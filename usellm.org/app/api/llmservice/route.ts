import { createLLMService } from "usellm";

export const runtime = "edge";

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

const llmService = createLLMService({
  openaiApiKey: process.env.OPENAI_API_KEY,
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
    const data = await llmService.handle(body);
    return new Response(data, { status: 200, headers });
  } catch (error) {
    return new Response((error as Error).message, { status: 400, headers });
  }
}
