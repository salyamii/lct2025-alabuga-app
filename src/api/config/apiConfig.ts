export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export const getApiConfig = (): ApiConfig => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    baseURL: isDevelopment 
      ? process.env.REACT_APP_API_URL || '/api'  // Используем прокси в dev режиме
      : process.env.REACT_APP_API_URL || 'http://91.219.150.15',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/users/login',
    REGISTER_HR: '/users/register',
    REGISTER_CANDIDATE: '/mobile/users/register',
    PROFILE: '/users/me',
  },
} as const;
