export const config = {
  apiUrl: (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api',
  appName: (import.meta as any).env?.VITE_APP_NAME || 'Novel Craft',
  appVersion: (import.meta as any).env?.VITE_APP_VERSION || '1.0.0',
  isDev: (import.meta as any).env?.VITE_DEV_MODE === 'true' || (import.meta as any).env?.DEV,
} as const;
