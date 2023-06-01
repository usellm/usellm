import { LLMAction, LLMProvider, LLMCallOptions, LLMTemplate } from "./types";
import { makeErrorResponse } from "./utils";

export class LLMService {
  templates: { [key: string]: LLMTemplate } = {};
  actions: { [key: string]: LLMAction } = {};
  providers: { [key: string]: LLMProvider } = {};

  // perform preprocessing on request body
  async registerTemplate(id: string, template: LLMTemplate) {
    this.templates[id] = template;
  }

  // register a provider that provides many options
  async registerProvider(id: string, provider: LLMProvider) {
    this.providers[id] = provider;
  }

  // register a custom action
  async registerAction(id: string, action: LLMAction) {
    this.actions[id] = action;
  }

  // apply a template to options
  async applyTemplate(
    options: LLMCallOptions,
    template?: LLMTemplate
  ): Promise<LLMCallOptions> {
    if (!template) return options;
    if (typeof template === "function") {
      return template(options);
    }
    const { $action, $provider } = options;
    if (template.$action && template.$action !== $action) {
      return options;
    }
    if (template.$provider && template.$provider !== $provider) {
      return options;
    }
    return { ...options, ...template };
  }

  // call a particular action and get back response
  async call(options: LLMCallOptions) {
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
  async handle(options: LLMCallOptions) {
    const result = await this.call(options);
    if (typeof result === "object") {
      return { result: JSON.stringify(result) };
    }
    return { result };
  }
}
