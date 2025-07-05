export interface AppConfig {
  nodeEnv: string;
  port: number;
  corsOrigin: string;
}

export interface DatabaseConfig {
  url: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface AiConfig {
  doubao: {
    apiKey: string;
    apiUrl: string;
    modelId: string;
  };
  deepseek: {
    apiKey: string;
    apiUrl: string;
    model: string;
  };
}

export interface FileUploadConfig {
  maxFileSize: number;
  uploadDest: string;
}

export interface ThrottleConfig {
  ttl: number;
  limit: number;
}
