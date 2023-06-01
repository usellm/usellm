export type LLMAction = (options: object) => object | Promise<object>;

export interface LLMProvider {
  id: string;
  name: string;
  description: string;
  actions: { [key: string]: LLMAction };
}

export type LLMTemplate =
  | object
  | ((options: object) => object | Promise<object>);

export interface LLMServiceCallOptions {
  $action: string;
  $provider: string;
  $template?: string;
  [key: string]: any;
}
