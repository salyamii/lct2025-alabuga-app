import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getApiConfig } from './config/apiConfig';
import { authInterceptor, responseInterceptor, errorInterceptor } from './interceptors/authInterceptor';
import { ApiResponse, ApiError } from './types/apiTypes';

class HttpClient {
  private client: AxiosInstance;

  constructor() {
    const config = getApiConfig();
    
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: config.headers,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Интерцептор запросов
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => authInterceptor(config),
      (error) => Promise.reject(error)
    );

    // Интерцептор ответов
    this.client.interceptors.response.use(
      responseInterceptor,
      errorInterceptor
    );
  }

  // Базовые HTTP методы
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, config);
      return this.formatResponse(response);
    } catch (error) {
      throw this.formatError(error);
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data, config);
      return this.formatResponse(response);
    } catch (error) {
      throw this.formatError(error);
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data, config);
      return this.formatResponse(response);
    } catch (error) {
      throw this.formatError(error);
    }
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.patch(url, data, config);
      return this.formatResponse(response);
    } catch (error) {
      throw this.formatError(error);
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url, config);
      return this.formatResponse(response);
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Форматирование успешного ответа
  private formatResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      success: true,
      status: response.status,
      message: 'Success',
    };
  }

  // Форматирование ошибки
  private formatError(error: any): ApiError {
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        timeout: error.config?.timeout
      }
    });

    if (error.response) {
      // Сервер ответил с кодом ошибки
      return {
        message: error.response.data?.message || error.message || 'Ошибка сервера',
        status: error.response.status,
        code: error.response.data?.code || `HTTP_${error.response.status}`,
        details: error.response.data?.details,
      };
    } else if (error.request) {
      // Запрос был отправлен, но ответа не получено
      let message = 'Сервер недоступен';
      let code = 'NETWORK_ERROR';
      
      // Проверяем на CORS ошибки
      if (error.message?.includes('CORS') || error.message?.includes('cors')) {
        message = 'CORS ошибка';
        code = 'CORS_ERROR';
      } else if (error.code === 'ECONNREFUSED') {
        message = 'Соединение отклонено';
        code = 'CONNECTION_REFUSED';
      } else if (error.code === 'ENOTFOUND') {
        message = 'Сервер не найден';
        code = 'DNS_ERROR';
      } else if (error.code === 'ECONNABORTED') {
        message = 'Таймаут подключения';
        code = 'TIMEOUT_ERROR';
      }
      
      return {
        message,
        status: 0,
        code,
        details: {
          url: error.config?.url,
          method: error.config?.method,
          timeout: error.config?.timeout,
          originalError: error.message,
          isCORS: error.message?.includes('CORS') || error.message?.includes('cors')
        }
      };
    } else {
      // Ошибка при настройке запроса
      return {
        message: error.message || 'Неизвестная ошибка',
        status: 0,
        code: 'UNKNOWN_ERROR',
        details: error
      };
    }
  }

  // Метод для обновления базового URL (полезно для переключения между окружениями)
  updateBaseURL(newBaseURL: string): void {
    this.client.defaults.baseURL = newBaseURL;
  }


  // Метод для обновления заголовков
  updateHeaders(headers: Record<string, string>): void {
    this.client.defaults.headers = {
      ...this.client.defaults.headers,
      ...headers,
    };
  }

}

// Экспортируем единственный экземпляр HTTP клиента
export const httpClient = new HttpClient();
export default httpClient;
