import { api, handleApiResponse, handleApiError } from './api';
import { CreateDocumentDto, UpdateDocumentDto, Document } from '@novel-craft/shared';

export interface DocumentListItem {
  id: string;
  title: string;
  type: DocumentType;
  createdAt: string;
  updatedAt: string;
}

export interface GroupedDocuments {
  outline: Document[];
  characters: Document[];
  worldbuilding: Document[];
  other: Document[];
}

export const documentsApi = {
  async getDocuments(projectId: string, type?: DocumentType): Promise<DocumentListItem[]> {
    try {
      const params = type ? { type } : {};
      const response = await api.get(`/projects/${projectId}/documents`, { params });
      return handleApiResponse<DocumentListItem[]>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async getGroupedDocuments(projectId: string): Promise<GroupedDocuments> {
    try {
      const response = await api.get(`/projects/${projectId}/documents/grouped`);
      return handleApiResponse<GroupedDocuments>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async getDocument(documentId: string): Promise<Document> {
    try {
      const response = await api.get(`/projects/*/documents/${documentId}`);
      return handleApiResponse<Document>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async createDocument(projectId: string, data: CreateDocumentDto): Promise<Document> {
    try {
      const response = await api.post(`/projects/${projectId}/documents`, data);
      return handleApiResponse<Document>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async createDefaultDocuments(projectId: string): Promise<Document[]> {
    try {
      const response = await api.post(`/projects/${projectId}/documents/defaults`);
      return handleApiResponse<Document[]>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async updateDocument(documentId: string, data: UpdateDocumentDto): Promise<Document> {
    try {
      const response = await api.patch(`/projects/*/documents/${documentId}`, data);
      return handleApiResponse<Document>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async deleteDocument(documentId: string): Promise<{ id: string; title: string; type: DocumentType }> {
    try {
      const response = await api.delete(`/projects/*/documents/${documentId}`);
      return handleApiResponse<{ id: string; title: string; type: DocumentType }>(response);
    } catch (error) {
      handleApiError(error);
    }
  },
};
