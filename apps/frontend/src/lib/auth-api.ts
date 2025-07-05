import { api, handleApiResponse, handleApiError } from './api';
import { LoginDto, RegisterDto, User } from '@novel-craft/shared';

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const authApi = {
  async login(data: LoginDto): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', data);
      return handleApiResponse<AuthResponse>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', data);
      return handleApiResponse<AuthResponse>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async getProfile(): Promise<User> {
    try {
      const response = await api.get('/auth/profile');
      return handleApiResponse<User>(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/refresh');
      return handleApiResponse<AuthResponse>(response);
    } catch (error) {
      handleApiError(error);
    }
  },
};
