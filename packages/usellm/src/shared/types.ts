export interface OpenAIMessage {
  content: string;
  role: string;
  name?: string;
  function_call?: {
    name: string;
    arguments: any;
  };
}

export type ChatStreamCallback = (result: {
  message: OpenAIMessage;
  isFirst: boolean;
  isLast: boolean;
}) => void;

export interface LLMChatResult {
  message: OpenAIMessage;
}

export interface ScoreEmbeddingsOptions {
  embeddings: Array<Array<number>>;
  query: number[];
  top?: number;
}
