import { LLMProvider } from "../types";

interface OpenAIProviderOptions {
  openaiApiKey: string;
  fetcher: typeof fetch;
  debug: boolean;
}

export function createOpenAIProvider({
  openaiApiKey,
  fetcher,
  debug,
}: OpenAIProviderOptions): LLMProvider {
  return {
    async chat(body: LLMServiceChatOptions): Promise<LLMServiceHandleResponse> {
      const template = {
        ...defaultTemplate,
        ...(this.templates[body.template || ""] || {}),
      };

      let filledMessages: OpenAIMessage[] = [];

      if (template.systemPrompt) {
        filledMessages.push({
          role: "system",
          content: fillPrompt(template.systemPrompt, body.inputs),
        });
      }

      if (template.userPrompt) {
        filledMessages.push({
          role: "user",
          content: fillPrompt(template.userPrompt, body.inputs),
        });
      }

      if (body.messages) {
        body.messages.forEach((message) => {
          filledMessages.push({
            role: message.role,
            content: message.content,
            user: message.user,
          });
        });
      }

      if (filledMessages.length == 0) {
        throw makeErrorResponse(
          "Empty message list. Please provide at least one message!",
          400
        );
      }

      const preparedBody = {
        messages: filledMessages,
        stream: body.stream,
        user: body.user,
        model: template.model,
        temperature: template.temperature,
        top_p: template.top_p,
        n: template.n,
        max_tokens: template.max_tokens,
        presence_penalty: template.presence_penalty,
        frequency_penalty: template.frequency_penalty,
        logit_bias: template.logit_bias,
      };

      if (this.debug) {
        console.log("[LLMService] preparedBody", preparedBody);
      }

      if (preparedBody.stream) {
        const result = await OpenAIStream({
          body: preparedBody,
          openaiApiKey: this.openaiApiKey,
          fetcher: this.fetcher,
        });
        return { result };
      } else {
        const response = await this.fetcher(CHAT_COMPLETIONS_API_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.openaiApiKey}`,
          },
          method: "POST",
          body: JSON.stringify(preparedBody),
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }
        const result = await response.text();
        return { result };
      }
    },

    async transcribe(options) {},

    async embed(options) {},

    async generateImage(options) {},
  };
}
