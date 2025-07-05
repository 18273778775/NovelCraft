import { api, handleApiResponse, handleApiError } from './api';
import { CreateChapterDto, UpdateChapterDto, Chapter } from '@novel-craft/shared';

export interface ChapterListItem {
  id: string;
  title: string;
  order: number;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChapterContent {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  order: number;
  projectId: string;
}

export const chaptersApi = {
  async getChapters(projectId: string): Promise<ChapterListItem[]> {
    try {
      const response = await api.get(`/projects/${projectId}/chapters`);
      return handleApiResponse<ChapterListItem[]>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async getChapter(chapterId: string): Promise<Chapter> {
    try {
      const response = await api.get(`/projects/*/chapters/${chapterId}`);
      return handleApiResponse<Chapter>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async getChapterContent(chapterId: string): Promise<ChapterContent> {
    try {
      const response = await api.get(`/projects/*/chapters/${chapterId}/content`);
      return handleApiResponse<ChapterContent>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async createChapter(projectId: string, data: CreateChapterDto): Promise<Chapter> {
    try {
      const response = await api.post(`/projects/${projectId}/chapters`, data);
      return handleApiResponse<Chapter>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async updateChapter(chapterId: string, data: UpdateChapterDto): Promise<Chapter> {
    try {
      const response = await api.patch(`/projects/*/chapters/${chapterId}`, data);
      return handleApiResponse<Chapter>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async updateChapterOrder(chapterId: string, order: number): Promise<Chapter> {
    try {
      const response = await api.patch(`/projects/*/chapters/${chapterId}/order`, { order });
      return handleApiResponse<Chapter>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async deleteChapter(chapterId: string): Promise<{ id: string; title: string }> {
    try {
      const response = await api.delete(`/projects/*/chapters/${chapterId}`);
      return handleApiResponse<{ id: string; title: string }>(response);
    } catch (error) {
      handleApiError(error);
    }
  },
};
