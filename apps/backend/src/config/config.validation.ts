import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),

  // Database
  DATABASE_URL: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),

  // AI Services
  DOUBAO_API_KEY: Joi.string().optional(),
  DOUBAO_API_URL: Joi.string().default('https://ark.cn-beijing.volces.com/api/v3'),
  DOUBAO_MODEL_ID: Joi.string().optional(),
  DEEPSEEK_API_KEY: Joi.string().required(),
  DEEPSEEK_API_URL: Joi.string().default('https://api.deepseek.com'),
  DEEPSEEK_MODEL: Joi.string().default('deepseek-chat'),

  // CORS
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),

  // File Upload
  MAX_FILE_SIZE: Joi.number().default(10485760), // 10MB
  UPLOAD_DEST: Joi.string().default('./uploads'),

  // Rate Limiting
  THROTTLE_TTL: Joi.number().default(60000), // 1 minute
  THROTTLE_LIMIT: Joi.number().default(100), // requests per TTL
});
