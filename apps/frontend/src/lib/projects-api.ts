import { api, handleApiResponse, handleApiError } from './api';
import { 
  CreateProjectDto, 
  UpdateProjectDto, 
  Project, 
  PaginationParams,
  PaginatedResponse 
} from '@novel-craft/shared';

export interface ProjectWithStats extends Project {
  _count: {
    chapters: number;
    documents: number;
  };
}

export interface ProjectStats {
  chapterCount: number;
  totalWords: number;
  documentCount: number;
}

export const projectsApi = {
  async getProjects(params?: PaginationParams & { search?: string }): Promise<PaginatedResponse<ProjectWithStats>> {
    try {
      const response = await api.get('/projects', { params });
      return handleApiResponse<PaginatedResponse<ProjectWithStats>>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async getProject(id: string): Promise<ProjectWithStats> {
    try {
      const response = await api.get(`/projects/${id}`);
      return handleApiResponse<ProjectWithStats>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async createProject(data: CreateProjectDto): Promise<ProjectWithStats> {
    try {
      const response = await api.post('/projects', data);
      return handleApiResponse<ProjectWithStats>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async updateProject(id: string, data: UpdateProjectDto): Promise<ProjectWithStats> {
    try {
      const response = await api.patch(`/projects/${id}`, data);
      return handleApiResponse<ProjectWithStats>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async deleteProject(id: string): Promise<{ id: string; title: string }> {
    try {
      const response = await api.delete(`/projects/${id}`);
      return handleApiResponse<{ id: string; title: string }>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async getProjectStats(id: string): Promise<ProjectStats> {
    try {
      const response = await api.get(`/projects/${id}/stats`);
      return handleApiResponse<ProjectStats>(response);
    } catch (error) {
      handleApiError(error);
    }
  },
};
