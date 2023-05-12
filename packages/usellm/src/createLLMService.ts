import OpenAIStream from "./OpenAIStream.js";
import {
  CHAT_COMPLETIONS_API_URL,
  OpenAIMessage,
  fillPrompt,
  makeErrorResponse,
} from "./utils.js";

export interface CreateLLMServiceArgs {
  openaiApiKey?: string;
  fetcher?: typeof fetch;
  templates?: { [id: string]: LLMServiceTemplate };
  debug?: boolean;
  isAllowed?: (body: LLMServiceBody) => boolean | Promise<boolean>;
}

const defaultTemplate = {
  model: "gpt-3.5-turbo",
  max_tokens: 200,
  temperature: 0.8,
};

export interface LLMServiceTemplate {
  id: string;
  systemPrompt?: string;
  userPrompt?: string;
  model?: string;
  temperature?: number;
  top_p?: number;
  n?: number;
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: number;
}

export interface LLMServiceBody {
  $action?: string;
  messages?: OpenAIMessage[];
  stream?: boolean;
  template?: string;
  inputs?: object;
  user?: string;
}

export class LLMService {
  templates: { [id: string]: LLMServiceTemplate };
  openaiApiKey: string;
  fetcher: typeof fetch;
  debug: boolean;
  isAllowed: (body: LLMServiceBody) => boolean | Promise<boolean>;

  constructor({
    openaiApiKey = "",
    fetcher = fetch,
    templates = {},
    debug = false,
    isAllowed = () => true,
  }: CreateLLMServiceArgs) {
    this.openaiApiKey = openaiApiKey;
    this.fetcher = fetcher;
    this.templates = templates;
    this.debug = debug;
    this.isAllowed = isAllowed;
  }

  registerTemplate(template: LLMServiceTemplate) {
    this.templates[template.id] = template;
  }

  prepareBody(body: LLMServiceBody) {
    const template = {
      ...defaultTemplate,
      ...(this.templates[body.template || ""] || {}),
    };

    let filledMessages = [];

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
      filledMessages = [...filledMessages, ...body.messages];
    }

    if (filledMessages.length == 0) {
      throw makeErrorResponse(
        "Empty message list. Please provide at least one message!"
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

    return preparedBody;
  }

  async handle(body: object) {
    if (!(await this.isAllowed(body))) {
      throw makeErrorResponse("Request not allowed");
    }

    if (!this.openaiApiKey) {
      throw makeErrorResponse(
        "OpenAI API key is required. Either pass it directly or set the environgment variable OPENAI_API_KEY"
      );
    }
    if (!("$action" in body)) {
      throw makeErrorResponse("`handle` expects a key $action in the body");
    }
    const { $action, ...rest } = body;
    if ($action === "chat") {
      return this.chat(rest as LLMServiceBody);
    } else {
      throw makeErrorResponse(`Action "${$action}" is not supported`);
    }
  }

  async chat(body: LLMServiceBody): Promise<ReadableStream | string> {
    const preparedBody = this.prepareBody(body);
    if (this.debug) {
      console.log("[LLMService] preparedBody", preparedBody);
    }

    if (preparedBody.stream) {
      return OpenAIStream({
        body: preparedBody,
        openaiApiKey: this.openaiApiKey,
        fetcher: this.fetcher,
      });
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
      return response.text();
    }
  }
}

export default function createLLMService({
  openaiApiKey = "",
  fetcher = fetch,
  templates = {},
  isAllowed = () => true,
  debug = false,
}: CreateLLMServiceArgs = {}) {
  return new LLMService({ openaiApiKey, fetcher, templates, isAllowed, debug });
}
