import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chaptersApi } from '@/lib/chapters-api';
import { CreateChapterDto, UpdateChapterDto } from '@novel-craft/shared';

export function useChapters(projectId: string) {
  return useQuery({
    queryKey: ['chapters', projectId],
    queryFn: () => chaptersApi.getChapters(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useChapter(chapterId: string) {
  return useQuery({
    queryKey: ['chapters', chapterId],
    queryFn: () => chaptersApi.getChapter(chapterId),
    enabled: !!chapterId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useChapterContent(chapterId: string) {
  return useQuery({
    queryKey: ['chapters', chapterId, 'content'],
    queryFn: () => chaptersApi.getChapterContent(chapterId),
    enabled: !!chapterId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: CreateChapterDto }) =>
      chaptersApi.createChapter(projectId, data),
    onSuccess: (_, { projectId }) => {
      // Invalidate chapters list
      queryClient.invalidateQueries({ queryKey: ['chapters', projectId] });
      
      // Invalidate project data to update chapter count
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
    },
  });
}

export function useUpdateChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chapterId, data }: { chapterId: string; data: UpdateChapterDto }) =>
      chaptersApi.updateChapter(chapterId, data),
    onSuccess: (updatedChapter) => {
      // Update specific chapter cache
      queryClient.setQueryData(['chapters', updatedChapter.id], updatedChapter);
      
      // Invalidate chapters list
      queryClient.invalidateQueries({ queryKey: ['chapters', updatedChapter.projectId] });
      
      // Update chapter content cache if it exists
      queryClient.invalidateQueries({ queryKey: ['chapters', updatedChapter.id, 'content'] });
    },
  });
}

export function useUpdateChapterOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chapterId, order }: { chapterId: string; order: number }) =>
      chaptersApi.updateChapterOrder(chapterId, order),
    onSuccess: (updatedChapter) => {
      // Invalidate chapters list to reflect new order
      queryClient.invalidateQueries({ queryKey: ['chapters', updatedChapter.projectId] });
    },
  });
}

export function useDeleteChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chapterId: string) => chaptersApi.deleteChapter(chapterId),
    onSuccess: (_, chapterId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['chapters', chapterId] });
      
      // Invalidate all chapters lists (we don't know which project it belonged to)
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
      
      // Invalidate all projects to update chapter counts
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
