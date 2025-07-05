import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  aiApi, 
  PolishRequest, 
  RewriteRequest, 
  SuggestionRequest, 
  BatchPolishRequest,
  AnalysisRequest 
} from '@/lib/ai-api';

export function useAiProviders() {
  return useQuery({
    queryKey: ['ai', 'providers'],
    queryFn: () => aiApi.getProviders(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function usePolishText() {
  return useMutation({
    mutationFn: (request: PolishRequest) => aiApi.polishText(request),
  });
}

export function useRewriteText() {
  return useMutation({
    mutationFn: (request: RewriteRequest) => aiApi.rewriteText(request),
  });
}

export function useGenerateSuggestions() {
  return useMutation({
    mutationFn: (request: SuggestionRequest) => aiApi.generateSuggestions(request),
  });
}

export function usePolishChapter() {
  return useMutation({
    mutationFn: ({ chapterId, options }: { chapterId: string; options?: Partial<PolishRequest> }) =>
      aiApi.polishChapter(chapterId, options),
  });
}

export function useBatchPolish() {
  return useMutation({
    mutationFn: (request: BatchPolishRequest) => aiApi.batchPolish(request),
  });
}

export function useAnalyzeText() {
  return useMutation({
    mutationFn: (request: AnalysisRequest) => aiApi.analyzeText(request),
  });
}
