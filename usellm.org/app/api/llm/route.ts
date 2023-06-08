import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createLLMService } from "usellm";
import { makeErrorResponse } from "@/usellm/shared/utils";

const llmService = createLLMService({
  openaiApiKey: process.env.OPENAI_API_KEY,
  elvenLabsApiKey: process.env.ELVEN_LABS_API_KEY,
  replicateApiKey: process.env.REPLICATE_API_TOKEN,
  actions: [
    "chat",
    "voiceChat",
    "transcribe",
    "embed",
    "speak",
    "generateImage",
    "editImage",
    "imageVariation",
    "generateHighResImage",
    "callReplicate",
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

// Register new action
llmService.registerAction("generateHighResImage", async (options: any) => {
  const { prompt } = options;
  if (!prompt) {
    throw makeErrorResponse("'prompt' is required", 400);
  }

  const REPLICATE_API_URL = "https://api.replicate.com/v1/predictions";
  const STABLE_DIFFUSION_MODEL_ID =
    "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf";

  const response1 = await fetch(REPLICATE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
    },
    body: JSON.stringify({
      version: STABLE_DIFFUSION_MODEL_ID,
      input: {
        prompt: prompt,
      },
    }),
  });

  if (!response1.ok) {
    throw new Error(await response1.text());
  }
  const { id: prediction_id } = await response1.json();

  // Wait for 30 seconds to run the model
  const sleep = async (milliseconds: number) => {
    await new Promise((resolve) => {
      return setTimeout(resolve, milliseconds);
    });
  };
  await sleep(30000);

  // Get the model response from Replicate
  const link = REPLICATE_API_URL + "/" + prediction_id;

  const response2 = await fetch(link, {
    method: "GET",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
    },
  });

  const data = await response2.json();
  return { data };
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
