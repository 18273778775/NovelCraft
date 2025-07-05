// User types
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

// Project types
export interface Project {
  id: string;
  title: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Chapter types
export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  wordCount: number;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Document types
export const DocumentType = {
  OUTLINE: 'OUTLINE',
  CHARACTERS: 'CHARACTERS',
  WORLDBUILDING: 'WORLDBUILDING',
  OTHER: 'OTHER',
} as const;

export type DocumentTypeValue = typeof DocumentType[keyof typeof DocumentType];

export interface Document {
  id: string;
  title: string;
  content: string;
  type: DocumentTypeValue;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Edit History types
export interface EditHistory {
  id: string;
  contentDiff: string;
  chapterId: string;
  createdAt: Date;
}

// Import Record types
export interface ImportRecord {
  id: string;
  fileName: string;
  chaptersCreated: number;
  projectId: string;
  createdAt: Date;
}

// AI Context types
export interface AiContext {
  outline?: string;
  characters?: string;
  worldbuilding?: string;
  previousChapters?: string[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
