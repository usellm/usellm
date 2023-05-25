import OpenAIStream from "./OpenAIStream";
import {
  AUDIO_TRANSCRIPTIONS_API_URL,
  CHAT_COMPLETIONS_API_URL,
  EDIT_IMAGE_API_URL,
  ELVEN_LABS_DEFAULT_MODEL_ID,
  ELVEN_LABS_DEFAULT_VOICE_ID,
  EMBEDDINGS_API_URL,
  IMAGE_GENERATION_API_URL,
  IMAGE_VARIATIONS_API_URL,
  OpenAIMessage,
  dataURLToBlob,
  dataUrlToExtension,
  fillPrompt,
  getTextToSpeechApiUrl,
  makeErrorResponse,
} from "./utils";

export interface CreateLLMServiceOptions {
  openaiApiKey?: string;
  elvenLabsApiKey?: string;
  actions?: string[];
  fetcher?: typeof fetch;
  templates?: { [id: string]: LLMServiceTemplate };
  debug?: boolean;
  isAllowed?: (options: LLMServiceHandleOptions) => boolean | Promise<boolean>;
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

export interface LLMServiceChatOptions {
  $action?: string;
  messages?: OpenAIMessage[];
  stream?: boolean;
  template?: string;
  inputs?: object;
  user?: string;
}

export interface LLMServiceTranscribeOptions {
  $action?: string;
  audioUrl?: string;
  language?: string;
  prompt?: string;
}

export interface LLMServiceEmbedOptions {
  $action?: string;
  input?: string | string[];
  user?: string;
  model?: string;
}

export interface LLMServiceHandleOptions {
  body: object;
  request?: Request;
}

export interface LLMServiceSpeakOptions {
  $action?: string;
  text?: string;
  model_id?: string;
  voice_id?: string;
  voice_settings?: { stability: number; similarity_boost: number };
}

export interface LLMServiceGenerateImageOptions {
  $action?: string;
  prompt: string;
  n?: number;
  size?: string;
  response_format?: string;
  user?: string;
}

export interface LLMServiceEditImageOptions {
  $action?: string;
  image: string;
  mask?: string;
  prompt?: string;
  n?: number;
  size?: string;
  response_format?: string;
  user?: string;
}

export interface LLMServiceImageVariationOptions {
  $action?: string;
  image: string;
  n?: number;
  size?: string;
  response_format?: string;
  user?: string;
}

export interface LLMServiceHandleResponse {
  result: ReadableStream | string;
}

export class LLMService {
  templates: { [id: string]: LLMServiceTemplate };
  openaiApiKey: string;
  elvenLabsApiKey: string;
  fetcher: typeof fetch;
  debug: boolean;
  actions: string[];
  isAllowed: (options: LLMServiceHandleOptions) => boolean | Promise<boolean>;

  constructor({
    openaiApiKey = "",
    elvenLabsApiKey = "",
    fetcher = fetch,
    templates = {},
    debug = false,
    isAllowed = () => true,
    actions = [],
  }: CreateLLMServiceOptions) {
    this.openaiApiKey = openaiApiKey;
    this.elvenLabsApiKey = elvenLabsApiKey;
    this.fetcher = fetcher;
    this.templates = templates;
    this.debug = debug;
    this.isAllowed = isAllowed;
    this.actions = actions;
  }

  registerTemplate(template: LLMServiceTemplate) {
    this.templates[template.id] = template;
  }

  prepareChatBody(body: LLMServiceChatOptions) {
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

    return preparedBody;
  }

  async handle({
    body = {},
    request,
  }: LLMServiceHandleOptions): Promise<LLMServiceHandleResponse> {
    if (!(await this.isAllowed({ body, request }))) {
      throw makeErrorResponse("Request not allowed", 405);
    }

    if (!this.openaiApiKey) {
      throw makeErrorResponse("OpenAI API key is required.", 400);
    }
    if (!("$action" in body)) {
      throw makeErrorResponse(
        "`handle` expects a key $action in the body",
        400
      );
    }
    const { $action, ...rest } = body;

    if (this.actions.length > 0 && !this.actions.includes($action as string)) {
      throw makeErrorResponse(`Action "${$action}" is not supported`, 400);
    }

    if ($action === "chat") {
      return this.chat(rest as LLMServiceChatOptions);
    }
    if ($action === "transcribe") {
      return this.transcribe(rest as LLMServiceTranscribeOptions);
    }
    if ($action === "embed") {
      return this.embed(rest as LLMServiceEmbedOptions);
    }
    if ($action === "speak") {
      return this.speak(rest as LLMServiceSpeakOptions);
    }
    if ($action === "generateImage") {
      return this.generateImage(rest as LLMServiceGenerateImageOptions);
    }
    if ($action === "editImage") {
      return this.editImage(rest as LLMServiceEditImageOptions);
    }
    if ($action === "imageVariation") {
      return this.imageVariation(rest as LLMServiceImageVariationOptions);
    }
    throw makeErrorResponse(`Action "${$action}" is not supported`, 400);
  }

  async chat(body: LLMServiceChatOptions): Promise<LLMServiceHandleResponse> {
    const preparedBody = this.prepareChatBody(body);
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
  }

  async embed(options: LLMServiceEmbedOptions) {
    const { input, user } = options;
    const model = "text-embedding-ada-002";

    if (!input) {
      throw makeErrorResponse("'input' is required", 400);
    }

    if (typeof input !== "string" && !Array.isArray(input)) {
      throw makeErrorResponse(
        "'input' must be a string or a list of strings",
        400
      );
    }

    let santizedInput: string | string[];

    if (typeof input === "string") {
      santizedInput = input.trim();
    } else {
      santizedInput = input.map((s) => {
        const trimmed = s.trim();
        if (!trimmed) {
          throw makeErrorResponse("'input' must not contain any empty strings");
        }
        return s.trim();
      });
    }

    if (santizedInput.length === 0) {
      throw makeErrorResponse("'input' must not be empty", 400);
    }

    const response = await this.fetcher(EMBEDDINGS_API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.openaiApiKey}`,
      },
      method: "POST",
      body: JSON.stringify({ input, user, model }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
    const { data } = await response.json();
    const embeddings = data.map((d: any) => d.embedding);
    return { result: JSON.stringify({ embeddings }) };
  }

  async transcribe(options: LLMServiceTranscribeOptions) {
    const { audioUrl, language, prompt } = options;

    if (!audioUrl) {
      throw makeErrorResponse("'audioUrl' is required", 400);
    }

    const audioBlob = dataURLToBlob(audioUrl);

    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
    formData.append("model", "whisper-1");
    if (language) {
      formData.append("language", language);
    }
    if (prompt) {
      formData.append("prompt", prompt);
    }

    const response = await this.fetcher(AUDIO_TRANSCRIPTIONS_API_URL, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${this.openaiApiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
    const result = await response.text();
    return { result };
  }

  async editImage(options: LLMServiceEditImageOptions) {
    const { image, mask, prompt, n, size, user } = options;
    const formData = new FormData();
    formData.append(
      "image",
      dataURLToBlob(image),
      `image.${dataUrlToExtension(image)}`
    );
    mask &&
      formData.append(
        "mask",
        dataURLToBlob(mask),
        `mask.${dataUrlToExtension(mask)}`
      );
    prompt && formData.append("prompt", prompt);
    n && formData.append("n", n.toString());
    size && formData.append("size", size);
    user && formData.append("user", user);

    const response = await this.fetcher(EDIT_IMAGE_API_URL, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${this.openaiApiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
    const { data } = await response.json();
    const images = data.map((d: any) => d.url || d.b64_json);
    const result = JSON.stringify({ images });
    return { result };
  }

  async imageVariation(options: LLMServiceImageVariationOptions) {
    const { image, n, size, user } = options;
    const formData = new FormData();
    formData.append(
      "image",
      dataURLToBlob(image),
      `image.${dataUrlToExtension(image)}`
    );
    n && formData.append("n", n.toString());
    size && formData.append("size", size);
    user && formData.append("user", user);

    const response = await this.fetcher(IMAGE_VARIATIONS_API_URL, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${this.openaiApiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
    const { data } = await response.json();
    const images = data.map((d: any) => d.url || d.b64_json);
    const result = JSON.stringify({ images });
    return { result };
  }

  async speak(options: LLMServiceSpeakOptions) {
    const {
      text,
      model_id = ELVEN_LABS_DEFAULT_MODEL_ID,
      voice_id = ELVEN_LABS_DEFAULT_VOICE_ID,
      voice_settings,
    } = options;

    const response = await this.fetcher(getTextToSpeechApiUrl(voice_id), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": this.elvenLabsApiKey,
      },
      body: JSON.stringify({
        text,
        model_id,
        voice_settings,
      }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const responseBlob = await response.blob();
    const responseBuffer = Buffer.from(await responseBlob.arrayBuffer());
    const audioUrl =
      "data:" +
      responseBlob.type +
      ";base64," +
      responseBuffer.toString("base64");

    return { result: JSON.stringify({ audioUrl }) };
  }

  async generateImage(options: LLMServiceGenerateImageOptions) {
    const { prompt } = options;

    if (!prompt) {
      throw makeErrorResponse("'prompt' is required", 400);
    }

    const response = await this.fetcher(IMAGE_GENERATION_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.openaiApiKey}`,
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "256x256",
        response_format: "url",
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
    const { data } = await response.json();
    const images = data.map((d: any) => d.url || d.b64_json);
    const result = JSON.stringify({ images });
    return { result };
  }
}

export default function createLLMService(
  options: CreateLLMServiceOptions = {}
) {
  return new LLMService(options);
}
