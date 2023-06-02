import {
  LLMAction,
  LLMProvider,
  LLMCallOptions,
  LLMTemplate,
} from "./server/types";
import { makeErrorResponse } from "./utils";

export class LLMService {
  templates: { [key: string]: LLMTemplate } = {};
  actions: { [key: string]: LLMAction } = {};
  providers: { [key: string]: LLMProvider } = {};

  // perform preprocessing on request body
  async registerTemplate(id: string, templateData: LLMTemplate) {
    this.templates[id] = templateData;
  }

  // register a provider that provides many options
  async registerProvider(id: string, providerData: LLMProvider) {
    this.providers[id] = providerData;
  }

  // register a custom action
  async registerAction(id: string, actionFunc: LLMAction) {
    this.actions[id] = actionFunc;
  }

  // call a particular action and get back response
  async call(options: LLMCallOptions) {
    const { $action, $provider, $template, ...otherOptions } = options;
    const providerData = this.providers[$provider];
    const actionFunc = providerData
      ? providerData.actions[$action]
      : this.actions[$action];
    let $templateData = $template ? this.templates[$template] : undefined;
    if (!actionFunc) {
      throw makeErrorResponse(`Action ${$action} not found`, 404);
    }
    if ($templateData && $templateData?.$action !== $action) {
      $templateData = undefined;
    }
    if ($templateData && $templateData?.$provider !== $provider) {
      $templateData = undefined;
    }
    return await actionFunc({ ...otherOptions, $templateData });
  }

  // for use in API routes (return a string/stream result)
  async handle(options: LLMCallOptions) {
    const result = await this.call(options);
    return {
      result: typeof result === "object" ? JSON.stringify(result) : result,
    };
  }
}
