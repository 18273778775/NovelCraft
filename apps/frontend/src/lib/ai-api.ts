import { api, handleApiResponse, handleApiError } from './api';

export interface AiProvider {
  type: string;
  name: string;
  available: boolean;
}

export interface PolishRequest {
  text: string;
  style?: 'formal' | 'casual' | 'literary' | 'modern';
  focus?: 'grammar' | 'style' | 'flow' | 'all';
  context?: string;
  provider?: string;
}

export interface RewriteRequest {
  text: string;
  tone?: 'serious' | 'humorous' | 'dramatic' | 'romantic';
  length?: 'shorter' | 'longer' | 'same';
  perspective?: 'first' | 'third';
  context?: string;
  provider?: string;
}

export interface SuggestionRequest {
  text: string;
  type: 'plot' | 'character' | 'dialogue' | 'description';
  context?: string;
  provider?: string;
}

export interface PolishResponse {
  originalText: string;
  polishedText: string;
  provider: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface RewriteResponse {
  originalText: string;
  rewrittenText: string;
  provider: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface SuggestionResponse {
  text: string;
  suggestions: string;
  type: string;
  provider: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface BatchPolishRequest {
  texts: string[];
  options?: Partial<PolishRequest>;
  provider?: string;
}

export interface BatchPolishResponse {
  successful: (PolishResponse & { index: number })[];
  failed: { index: number; error: string }[];
  total: number;
  successCount: number;
  failureCount: number;
}

export interface AnalysisRequest {
  text: string;
  context?: string;
  provider?: string;
}

export interface AnalysisResponse {
  text: string;
  wordCount: number;
  suggestions: {
    grammar: SuggestionResponse | null;
    style: SuggestionResponse | null;
    plot: SuggestionResponse | null;
  };
  provider: string;
}

export const aiApi = {
  async getProviders(): Promise<AiProvider[]> {
    try {
      const response = await api.get('/ai/providers');
      return handleApiResponse<AiProvider[]>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async polishText(request: PolishRequest): Promise<PolishResponse> {
    try {
      const response = await api.post('/ai/polish', request);
      return handleApiResponse<PolishResponse>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async rewriteText(request: RewriteRequest): Promise<RewriteResponse> {
    try {
      const response = await api.post('/ai/rewrite', request);
      return handleApiResponse<RewriteResponse>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async generateSuggestions(request: SuggestionRequest): Promise<SuggestionResponse> {
    try {
      const response = await api.post('/ai/suggestions', request);
      return handleApiResponse<SuggestionResponse>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async polishChapter(chapterId: string, options?: Partial<PolishRequest>): Promise<PolishResponse & { chapterId: string; chapterTitle: string }> {
    try {
      const response = await api.post(`/ai/chapters/${chapterId}/polish`, options || {});
      return handleApiResponse<PolishResponse & { chapterId: string; chapterTitle: string }>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async batchPolish(request: BatchPolishRequest): Promise<BatchPolishResponse> {
    try {
      const response = await api.post('/ai/batch/polish', request);
      return handleApiResponse<BatchPolishResponse>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async analyzeText(request: AnalysisRequest): Promise<AnalysisResponse> {
    try {
      const response = await api.post('/ai/analyze', request);
      return handleApiResponse<AnalysisResponse>(response);
    } catch (error) {
      handleApiError(error);
    }
  },
};
