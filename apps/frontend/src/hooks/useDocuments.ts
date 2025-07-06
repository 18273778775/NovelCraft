import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/lib/documents-api';
import { CreateDocumentDto, UpdateDocumentDto } from '@novel-craft/shared';

export function useDocuments(projectId: string, type?: DocumentType) {
  return useQuery({
    queryKey: ['documents', projectId, type],
    queryFn: () => documentsApi.getDocuments(projectId, type),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useGroupedDocuments(projectId: string) {
  return useQuery({
    queryKey: ['documents', projectId, 'grouped'],
    queryFn: () => documentsApi.getGroupedDocuments(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useDocument(documentId: string) {
  return useQuery({
    queryKey: ['documents', documentId],
    queryFn: () => documentsApi.getDocument(documentId),
    enabled: !!documentId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: CreateDocumentDto }) =>
      documentsApi.createDocument(projectId, data),
    onSuccess: (_, { projectId }) => {
      // Invalidate documents list
      queryClient.invalidateQueries({ queryKey: ['documents', projectId] });
      
      // Invalidate project data to update document count
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
    },
  });
}

export function useCreateDefaultDocuments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => documentsApi.createDefaultDocuments(projectId),
    onSuccess: (_, projectId) => {
      // Invalidate documents list
      queryClient.invalidateQueries({ queryKey: ['documents', projectId] });
      
      // Invalidate project data to update document count
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, data }: { documentId: string; data: UpdateDocumentDto }) =>
      documentsApi.updateDocument(documentId, data),
    onSuccess: (updatedDocument) => {
      // Update specific document cache
      queryClient.setQueryData(['documents', updatedDocument.id], updatedDocument);
      
      // Invalidate documents list
      queryClient.invalidateQueries({ queryKey: ['documents', updatedDocument.projectId] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => documentsApi.deleteDocument(documentId),
    onSuccess: (_, documentId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['documents', documentId] });
      
      // Invalidate all documents lists
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      
      // Invalidate all projects to update document counts
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
