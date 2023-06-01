export type LLMAction = (options: object) => object | Promise<object>;

export interface LLMProvider {
  id: string;
  name: string;
  description: string;
  actions: { [key: string]: LLMAction };
}

export type LLMTemplate =
  | { $action?: string; $provider?: string; [key: string]: any }
  | ((options: LLMCallOptions) => LLMCallOptions | Promise<LLMCallOptions>);

export interface LLMCallOptions {
  $action: string;
  $provider: string;
  $template?: string;
  [key: string]: any;
}
