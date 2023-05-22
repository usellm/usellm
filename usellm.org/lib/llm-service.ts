import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createLLMService } from "usellm";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export const llmService = createLLMService({
  openaiApiKey: process.env.OPENAI_API_KEY,
  actions: ["chat", "transcribe", "embed"],
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
