import { IsEmail, IsString, IsOptional, MinLength, IsEnum, IsNumber, Min } from 'class-validator';
import { DocumentType, DocumentTypeValue } from '../types';

// Auth DTOs
export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(3)
  username!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

// Project DTOs
export class CreateProjectDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

// Chapter DTOs
export class CreateChapterDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;
}

export class UpdateChapterDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;
}

// Document DTOs
export class CreateDocumentDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsString()
  type!: DocumentTypeValue;
}

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  type?: DocumentTypeValue;
}

// AI DTOs
export class PolishTextDto {
  @IsString()
  @MinLength(1)
  text!: string;

  @IsString()
  chapterId!: string;
}

export class RewriteTextDto {
  @IsString()
  @MinLength(1)
  text!: string;

  @IsString()
  @MinLength(1)
  instruction!: string;

  @IsString()
  chapterId!: string;
}
