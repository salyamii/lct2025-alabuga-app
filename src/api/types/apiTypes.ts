// Базовые типы для API ответов
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Типы для авторизации из реального API
export interface UserLoginRequest {
  login: string;
  password: string;
}

export interface UserTokenResponse {
  token: string;
}

export interface UserResponse {
  login: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Типы для регистрации HR пользователей
export interface HRUserRegistrationRequest {
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Типы для регистрации кандидатов
export interface CandidateUserRegistrationRequest {
  login: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Типы для HTTP методов
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

// Типы для обработки ошибок
export interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: any;
  };
  status: number;
}
