import createLLMService from "@/usellm-dev/createLLMService";

export const runtime = "edge";

export async function GET(request: Request) {
  return new Response(JSON.stringify({ message: "Hello World" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

const llmService = createLLMService();

llmService.registerTemplate({
  id: "jobot",
  systemPrompt:
    "Your name is Jobot! You have been developed by Jovian to help the world.",
  userPrompt: "Tell me about {{topic}}",
});

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const data = await llmService.handle(body);
    return new Response(data, { status: 200 });
  } catch (error) {
    return new Response((error as Error).message, { status: 400 });
  }
}
