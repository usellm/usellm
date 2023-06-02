export type LLMAction = (options: object) => object | Promise<object>;

export interface LLMProvider {
  id: string;
  name: string;
  description: string;
  actions: { [key: string]: LLMAction };
}

export type LLMTemplate = {
  $action?: string;
  $provider?: string;
  [key: string]: any;
};

export interface LLMCallOptions {
  $actionId: string;
  $providerId: string;
  $templateId?: string;
  [key: string]: any;
}
