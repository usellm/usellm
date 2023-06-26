import OpenAIStream from "./OpenAIStream";
import {
  AUDIO_TRANSCRIPTIONS_API_URL,
  CHAT_COMPLETIONS_API_URL,
  EDIT_IMAGE_API_URL,
  REPLICATE_API_URL,
  HUGGING_FACE_API_URL,
  ELVEN_LABS_DEFAULT_MODEL_ID,
  ELVEN_LABS_DEFAULT_VOICE_ID,
  EMBEDDINGS_API_URL,
  IMAGE_GENERATION_API_URL,
  IMAGE_VARIATIONS_API_URL,
  cosineSimilarity,
  dataURLToBlob,
  dataUrlToExtension,
  fillPrompt,
  getTextToSpeechApiUrl,
  makeErrorResponse,
  scoreEmbeddings,
  GENERATE_CLONE_VOICE_URL,
  MESSAGE_TO_VOICE_URL,
  removeUndefined,
} from "../shared/utils";
import {
  CreateLLMServiceOptions,
  LLMAction,
  LLMServiceChatOptions,
  LLMServiceEditImageOptions,
  LLMServiceEmbedOptions,
  LLMServiceGenerateImageOptions,
  LLMServiceHandleOptions,
  LLMServiceHandleResponse,
  LLMServiceImageVariationOptions,
  LLMServiceSpeakOptions,
  LLMServiceTemplate,
  LLMServiceTranscribeOptions,
  LLMServiceVoiceChatOptions,
  LLMCloneVoiceOptions,
  LLMServiceCallReplicateOptions,
  LLMServiceCallHuggingFace,
  LLMGenerateClonedAudioOptions,
  LLMAgent,
} from "./types";
import { OpenAIMessage } from "../shared/types";

const defaultTemplate = {
  model: "gpt-3.5-turbo",
  max_tokens: 1000,
  temperature: 0.8,
};

export class LLMService {
  templates: { [id: string]: LLMServiceTemplate };
  openaiApiKey: string;
  elvenLabsApiKey: string;
  playHtApiKey: string;
  playHtUserId: string;
  replicateApiKey: string;
  huggingFaceApiKey: string;
  fetcher: typeof fetch;
  debug: boolean;
  actions: string[];
  isAllowed: (options: LLMServiceHandleOptions) => boolean | Promise<boolean>;
  customActions: { [id: string]: LLMAction } = {};
  agents: { [id: string]: LLMAgent } = {};

  cosineSimilarity = cosineSimilarity;
  scoreEmbeddings = scoreEmbeddings;

  constructor({
    openaiApiKey = "",
    elvenLabsApiKey = "",
    playHtApiKey = "",
    playHtUserId = "",
    replicateApiKey = "",
    huggingFaceApiKey = "",
    fetcher = fetch,
    templates = {}, // deprecated
    debug = false,
    isAllowed = () => true,
    actions = [],
    agents = {},
  }: CreateLLMServiceOptions) {
    this.openaiApiKey = openaiApiKey;
    this.elvenLabsApiKey = elvenLabsApiKey;
    this.replicateApiKey = replicateApiKey;
    this.huggingFaceApiKey = huggingFaceApiKey;
    this.fetcher = fetcher;
    this.templates = templates;
    this.debug = debug;
    this.isAllowed = isAllowed;
    this.actions = actions;
    this.playHtApiKey = playHtApiKey;
    this.playHtUserId = playHtUserId;
    this.agents = agents;
  }

  registerTemplate(template: LLMServiceTemplate) {
    this.templates[template.id] = template;
  }

  registerAction(id: string, action: LLMAction) {
    this.customActions[id] = action;
  }

  async callAction(action: string, body = {}) {
    if (!this.actions.includes(action) && !this.customActions[action]) {
      throw makeErrorResponse(
        `Action "${action}" is not allowed. Add it to the list of allowed actions in "createLLMService".`,
        400
      );
    }

    if (action === "chat") {
      return this.chat(body as LLMServiceChatOptions);
    }
    if (action === "transcribe") {
      return this.transcribe(body as LLMServiceTranscribeOptions);
    }
    if (action === "embed") {
      return this.embed(body as LLMServiceEmbedOptions);
    }
    if (action === "speak") {
      return this.speak(body as LLMServiceSpeakOptions);
    }
    if (action === "generateImage") {
      return this.generateImage(body as LLMServiceGenerateImageOptions);
    }
    if (action === "editImage") {
      return this.editImage(body as LLMServiceEditImageOptions);
    }
    if (action === "imageVariation") {
      return this.imageVariation(body as LLMServiceImageVariationOptions);
    }
    if (action === "voiceChat") {
      return this.voiceChat(body as LLMServiceVoiceChatOptions);
    }
    if (action === "cloneVoice") {
      return this.cloneVoice(body as LLMCloneVoiceOptions);
    }
    if (action === "generateClonedAudio") {
      return this.generateClonedAudio(body as LLMGenerateClonedAudioOptions);
    }
    if (action === "callReplicate") {
      return this.callReplicate(body as LLMServiceCallReplicateOptions);
    }
    if (action === "callHuggingFace") {
      return this.callHuggingFace(body as LLMServiceCallHuggingFace);
    }
    if (action === "callAgentFunction") {
      return this.callAgentFunction(body as CallAgentFunctionOptions);
    }
    const actionFunc = this.customActions[action];
    if (!actionFunc) {
      throw makeErrorResponse(`Action "${action}" is not supported`, 400);
    }
    return actionFunc(body);
  }

  prepareChatBody(body: LLMServiceChatOptions) {
    const template = {
      ...defaultTemplate,
      ...(this.templates[body.template || ""] || {}),
      ...(this.agents[body.agent || ""] || {}),
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

    if (template.messages) {
      template.messages.forEach((message) => {
        filledMessages.push({
          role: message.role,
          content: message.content,
          name: message.name,
          function_call: message.function_call,
        });
      });
    }

    if (body.messages) {
      body.messages.forEach((message) => {
        filledMessages.push({
          role: message.role,
          content: message.content,
          name: message.name,
          function_call: message.function_call,
        });
      });
    }

    if (filledMessages.length == 0) {
      throw makeErrorResponse(
        "Empty message list. Please provide at least one message!",
        400
      );
    }

    const preparedBody = removeUndefined({
      model: template.model,
      messages: filledMessages,
      functions: template.functions?.map((f) => f.schema) || undefined,
      function_call: body.function_call ?? template.function_call,
      temperature: template.temperature,
      top_p: template.top_p,
      n: template.n,
      stream: body.stream ?? template.stream,
      stop: template.stop,
      max_tokens: template.max_tokens,
      presence_penalty: template.presence_penalty,
      frequency_penalty: template.frequency_penalty,
      logit_bias: template.logit_bias,
      user: body.user ?? template.user,
    });

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
    const result = await this.callAction($action as string, rest);
    if ("stream" in body && body.stream) {
      return result;
    }
    return { result: JSON.stringify(result) };
  }

  async chat(body: LLMServiceChatOptions) {
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
      return response.json();
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
    return { embeddings };
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
    return response.json();
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

    return { audioUrl };
  }

  async generateImage(options: LLMServiceGenerateImageOptions) {
    const { prompt, n = 1, size = "256x256" } = options;

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
        n: Math.min(n, 4),
        size: size,
        response_format: "url",
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
    const { data } = await response.json();
    const images = data.map((d: any) => d.url || d.b64_json);
    return { images };
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
    n && formData.append("n", Math.max(n, 4).toString());
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
    return { images };
  }

  async imageVariation(options: LLMServiceImageVariationOptions) {
    const { image, n, size, user } = options;
    const formData = new FormData();
    formData.append(
      "image",
      dataURLToBlob(image),
      `image.${dataUrlToExtension(image)}`
    );
    n && formData.append("n", Math.max(n, 4).toString());
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
    return { images };
  }

  async voiceChat(options: LLMServiceVoiceChatOptions) {
    const { transcribeAudioUrl, transcribeLanguage, transcribePrompt } =
      options;
    const { text } = await this.transcribe({
      audioUrl: transcribeAudioUrl,
      language: transcribeLanguage,
      prompt: transcribePrompt,
    });
    const { chatMessages, chatTemplate, chatInputs } = options;
    const messages = [...(chatMessages || []), { role: "user", content: text }];
    const chatResult = await this.chat({
      messages,
      template: chatTemplate,
      inputs: chatInputs,
    });
    const { choices } = chatResult as any;
    const { speakModelId, speechVoideId, speechVoiceSettings } = options;
    const { audioUrl } = await this.speak({
      text: choices[0].message.content,
      model_id: speakModelId,
      voice_id: speechVoideId,
      voice_settings: speechVoiceSettings,
    });

    return {
      audioUrl,
      messages: [
        { role: "user", content: text },
        { role: "assistant", content: choices[0].message.content },
      ],
    };
  }

  async cloneVoice(options: LLMCloneVoiceOptions) {
    const { audioUrl, voice_name } = options;

    if (!audioUrl) {
      throw makeErrorResponse("'audioUrl' is required", 400);
    }

    if (!voice_name) {
      throw makeErrorResponse("'voice_name' is required", 400);
    }

    const audioBlob = dataURLToBlob(audioUrl);
    const form = new FormData();
    form.append("voice_name", voice_name);
    form.append("sample_file", audioBlob);

    const response1 = await this.fetcher(GENERATE_CLONE_VOICE_URL, {
      method: "POST",
      body: form,
      headers: {
        accept: "application/json",
        AUTHORIZATION: `Bearer ${this.playHtApiKey}`,
        "X-USER-ID": this.playHtUserId,
      },
    });

    if (!response1.ok && !(response1.status === 201)) {
      throw makeErrorResponse("Failed to generate cloned voice", 500);
    }

    const json = await response1.json();
    const voiceID = json.id;

    return { voiceID };
  }

  async generateClonedAudio(options: LLMGenerateClonedAudioOptions) {
    const {
      quality = "medium",
      output_format = "mp3",
      voiceID,
      speed = 1,
      sample_rate = 24000,
      text,
    } = options;
    if (!text) {
      throw makeErrorResponse("'text' is required'", 400);
    }
    if (!voiceID) {
      throw makeErrorResponse("'voiceID' is required'", 400);
    }
    const response1 = await this.fetcher(MESSAGE_TO_VOICE_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        AUTHORIZATION: `Bearer ${this.playHtApiKey}`,
        "X-USER-ID": this.playHtUserId,
      },
      body: JSON.stringify({
        quality,
        output_format,
        speed,
        sample_rate,
        text,
        voice: voiceID,
      }),
    });

    if (!response1.ok) {
      throw makeErrorResponse("Failed to generate audio", 500);
    }

    if (!response1.ok) {
      throw makeErrorResponse("Failed to generate audio", 500);
    }

    const json1 = await response1.json();
    const href = json1["_links"][2].href;

    const response2 = await this.fetcher(href, {
      method: "GET",
      headers: {
        AUTHORIZATION: `Bearer ${this.playHtApiKey}`,
        "X-USER-ID": this.playHtUserId,
      },
    });
    const responseBlob = await response2.blob();

    const responseBuffer = Buffer.from(await responseBlob.arrayBuffer());
    const audioUrlReturn =
      "data:" +
      responseBlob.type +
      ";base64," +
      responseBuffer.toString("base64");

    return { audioUrlReturn };
  }

  async callReplicate(options: LLMServiceCallReplicateOptions) {
    const { version, input, timeout = 10000 } = options;

    if (!input) {
      throw makeErrorResponse("'input' is required", 400);
    }
    // Create Prediction Model
    const createPredictionResponse = await this.fetcher(REPLICATE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${this.replicateApiKey}`,
      },
      body: JSON.stringify({
        version: version,
        input: input,
      }),
    });
    if (!createPredictionResponse.ok) {
      throw makeErrorResponse(await createPredictionResponse.text());
    }
    const { id: prediction_id } = await createPredictionResponse.json();
    const GET_PREDICTION_URL = REPLICATE_API_URL + "/" + prediction_id;

    // Wait for 10 seconds(by default) to run the model
    const sleep = async (milliseconds: number) => {
      await new Promise((resolve) => {
        return setTimeout(resolve, milliseconds);
      });
    };
    await sleep(timeout);

    const statusResponse = await this.fetcher(GET_PREDICTION_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${this.replicateApiKey}`,
      },
    });

    if (!statusResponse.ok) {
      throw new Error(await statusResponse.text());
    }

    const getResponse = await statusResponse.json();

    if (getResponse && getResponse.status === "succeeded") {
      return {
        id: getResponse.id,
        urls: getResponse.urls,
        status: getResponse.status,
        output: getResponse.output,
        metrics: getResponse.metrics,
      };
    } else {
      return {
        output:
          "Training Not Completed! Please increase the value of timeout and try again.",
      };
    }
  }

  async callHuggingFace(options: LLMServiceCallHuggingFace) {
    const { data, model } = options;
    /* data can be a object with input as the required key or 
    a string represneting a binary file path, the binary file can then 
    be converted to binary format and passed to data
    */
    const link = HUGGING_FACE_API_URL + model;
    const response = await this.fetcher(link, {
      method: "POST",
      headers: { Authourization: `Bearer ${this.huggingFaceApiKey}` },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw makeErrorResponse(await response.text());
    }
    const result = await response.json();
    return result;
  }

  async registerAgent(id: string, agent: LLMAgent) {
    this.agents[id] = agent;
  }

  async callAgentFunction({
    agent,
    function: func,
    arguments: args,
  }: CallAgentFunctionOptions) {
    if (!this.agents[agent]) {
      throw makeErrorResponse(`Agent "${agent}" is not registered`, 400);
    }
    const agentFunc = this.agents[agent]?.functions?.find(
      (f) => f.schema.name === func
    );
    if (!agentFunc) {
      throw makeErrorResponse(`Function "${func}" is not supported`, 400);
    }
    return agentFunc.call(args);
  }
}

interface CallAgentFunctionOptions {
  agent: string;
  function: string;
  arguments: object;
}

export function createLLMService(options: CreateLLMServiceOptions = {}) {
  return new LLMService(options);
}
