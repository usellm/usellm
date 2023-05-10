import createLLMService from "@/usellm-dev/createLLMService";

export const runtime = "edge";

export const config = {
  runtime: "edge",
};

export async function GET(request: Request) {
  return new Response(JSON.stringify({ message: "Hello World" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

const llmService = createLLMService({
  openaiApiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const data = await llmService.handle(body);
    console.log("body", body);
    console.log("data", data);
    return new Response(data, { status: 200 });
  } catch (error) {
    return new Response((error as Error).message, { status: 400 });
  }
}
