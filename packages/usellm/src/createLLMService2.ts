import {
  LLMAction,
  LLMProvider,
  LLMServiceCallOptions,
  LLMTemplate,
} from "./types";
import { makeErrorResponse } from "./utils";

export class LLMService {
  templates: { [key: string]: LLMTemplate } = {};
  actions: { [key: string]: LLMAction } = {};
  providers: { [key: string]: LLMProvider } = {};

  // register a provider that provides many options
  async registerProvider() {}

  // register a custom action
  async registerAction() {}

  // perform preprocessing on request body
  async registerTemplate() {}

  // apply a template to options
  async applyTemplate(options: LLMServiceCallOptions, template?: LLMTemplate) {
    if (!template) return options;
    if (typeof template === "function") {
      return template(options);
    }
    return { ...options, ...template };
  }

  // call a particular action and get back response
  async call(options: LLMServiceCallOptions) {
    const { $template, ...otherOptions } = options;
    const revisedOptions = await this.applyTemplate(
      otherOptions,
      $template ? this.templates[$template] : undefined
    );
    const { $action, $provider, ...finalOptions } = revisedOptions;
    const provider = this.providers[$provider];
    const action = provider ? provider.actions[$action] : this.actions[$action];
    if (!action) {
      throw makeErrorResponse(`Action ${$action} not found`, 404);
    }
    return await action(finalOptions);
  }

  // for use in API routes (return a string/stream result)
  async handle(options: LLMServiceCallOptions) {
    const result = await this.call(options);
    if (typeof result === "object") {
      return { result: JSON.stringify(result) };
    }
    return { result };
  }
}
