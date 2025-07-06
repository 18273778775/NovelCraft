import axios, { AxiosError } from 'axios';
import { config } from './config';

// API configuration constants
const API_TIMEOUT = 10000; // 10 seconds
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Create axios instance
export const api = axios.create({
  baseURL: config.apiUrl,
  timeout: API_TIMEOUT,
  headers: DEFAULT_HEADERS,
});

// Token management
const TOKEN_KEY = 'novel_craft_token';

export const tokenManager = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      tokenManager.remove();
      window.location.href = '/login';
    }

    // Handle network errors
    if (!error.response) {
      // Only log in development environment
      if ((import.meta as any).env?.DEV) {
        console.error('Network error:', error.message);
      }
    }

    return Promise.reject(error);
  }
);

// API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

// Generic API error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to handle API responses
export function handleApiResponse<T>(response: any): T {
  if (response.data?.success === false) {
    throw new ApiError(
      response.data.message || 'API request failed',
      response.status,
      response.data.error
    );
  }

  return response.data?.data || response.data;
}

// Helper function to handle API errors
export function handleApiError(error: any): never {
  if (error.response?.data) {
    const { message, error: errorCode } = error.response.data;
    throw new ApiError(
      message || 'An error occurred',
      error.response.status,
      errorCode
    );
  }

  if (error.message) {
    throw new ApiError(error.message);
  }

  throw new ApiError('An unknown error occurred');
}
