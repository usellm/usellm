import { llmService } from "@/lib/llm-service";
import { getChatResponseHeaders } from "@/lib/utils";

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

export async function POST(request: Request) {
  const body = await request.json();
  const headers = getChatResponseHeaders();

  try {
    const data = await llmService.handle({ body, request });
    return new Response(data, { status: 200, headers });
  } catch (error) {
    return new Response((error as Error).message, { status: 400, headers });
  }
}
