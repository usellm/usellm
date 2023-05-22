import { llmService } from "@/lib/llm-service";
import { getChatResponseHeaders } from "@/lib/utils";

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
    return new Response(error.message, {
      status: error?.status,
      headers,
    });
  }
}
