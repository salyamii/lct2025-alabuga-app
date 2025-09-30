import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { 
  UserLoginRequest, 
  UserTokenResponse, 
  UserResponse, 
  HRUserRegistrationRequest,
  CandidateUserRegistrationRequest,
  ApiResponse 
} from '../types/apiTypes';

export class AuthService {
  // Вход в систему
  async login(credentials: UserLoginRequest): Promise<ApiResponse<UserTokenResponse>> {
    const response = await httpClient.post<UserTokenResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    // Сохраняем токен в localStorage
    if (response.data) {
      localStorage.setItem('accessToken', response.data.token);
    }
    
    return response;
  }

  // Регистрация HR пользователя
  async registerHR(userData: HRUserRegistrationRequest): Promise<ApiResponse<void>> {
    return httpClient.post<void>(API_ENDPOINTS.AUTH.REGISTER_HR, userData);
  }

  // Регистрация кандидата
  async registerCandidate(userData: CandidateUserRegistrationRequest): Promise<ApiResponse<void>> {
    return httpClient.post<void>(API_ENDPOINTS.AUTH.REGISTER_CANDIDATE, userData);
  }

  // Выход из системы
  async logout(): Promise<void> {
    // Очищаем токен из localStorage
    localStorage.removeItem('accessToken');
  }

  // Проверка авторизации
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // Получение текущего токена
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

// Экспортируем единственный экземпляр сервиса
export const authService = new AuthService();
export default authService;
