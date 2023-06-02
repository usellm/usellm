export interface OpenAIMessage {
  content: string;
  role: string;
  user?: string;
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
