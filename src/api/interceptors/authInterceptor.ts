import { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Интерцептор для добавления токена авторизации
export const authInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  
  return config;
};

// Интерцептор для обработки ответов и обновления токенов
export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  // Здесь можно добавить логику для обработки успешных ответов
  return response;
};

// Интерцептор для обработки ошибок
export const errorInterceptor = (error: any) => {
  if (error.response?.status === 401) {
    // Токен истек или недействителен
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Перенаправляем на страницу входа
    window.location.href = '/login';
  }
  
  if (error.response?.status === 403) {
    // Недостаточно прав
    console.error('Доступ запрещен');
  }
  
  if (error.response?.status >= 500) {
    // Серверная ошибка
    console.error('Ошибка сервера');
  }
  
  return Promise.reject(error);
};
