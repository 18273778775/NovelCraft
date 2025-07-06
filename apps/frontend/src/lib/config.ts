// Environment variables with validation
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = (import.meta as any).env?.[key];
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || defaultValue || '';
};

export const config = {
  apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:3001/api'),
  appName: getEnvVar('VITE_APP_NAME', 'Novel Craft'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  isDev: getEnvVar('VITE_DEV_MODE') === 'true' || (import.meta as any).env?.DEV,
} as const;
