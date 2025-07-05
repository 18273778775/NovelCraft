export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
  finishReason?: string;
}

export interface AiProviderConfig {
  apiKey: string;
  apiUrl: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AiProvider {
  name: string;
  generateText(messages: AiMessage[], config?: Partial<AiProviderConfig>): Promise<AiResponse>;
  isAvailable(): boolean;
}

export enum AiProviderType {
  DOUBAO = 'doubao',
  DEEPSEEK = 'deepseek',
}

export interface PolishRequest {
  text: string;
  style?: 'formal' | 'casual' | 'literary' | 'modern';
  focus?: 'grammar' | 'style' | 'flow' | 'all';
  context?: string;
}

export interface RewriteRequest {
  text: string;
  tone?: 'serious' | 'humorous' | 'dramatic' | 'romantic';
  length?: 'shorter' | 'longer' | 'same';
  perspective?: 'first' | 'third';
  context?: string;
}

export interface SuggestionRequest {
  text: string;
  type: 'plot' | 'character' | 'dialogue' | 'description';
  context?: string;
}
