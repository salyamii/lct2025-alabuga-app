// Экспорт HTTP клиента
export { httpClient } from './httpClient';

// Экспорт конфигурации
export { getApiConfig, API_ENDPOINTS } from './config/apiConfig';

// Экспорт типов
export type {
  ApiResponse,
  ApiError,
  UserLoginRequest,
  UserTokenResponse,
  UserResponse,
  HRUserRegistrationRequest,
  CandidateUserRegistrationRequest,
  HttpMethod,
  RequestConfig,
  ErrorResponse,
} from './types/apiTypes';


// Экспорт сервисов
export { authService } from './services/authService';

// Экспорт интерцепторов
export {
  authInterceptor,
  responseInterceptor,
  errorInterceptor,
} from './interceptors/authInterceptor';

// Экспорт хуков
export { useApi } from './hooks/useApi';
export { useAuth } from './hooks/useAuth';
export { useAuthRoute } from './hooks/useAuthRoute';
export { useDataLoader } from './hooks/useDataLoader';

// Экспорт контекста
export { AuthProvider, useAuthContext } from './context/AuthContext';

// Экспорт компонентов для роутинга
export { ProtectedRoute } from './components/AuthGuard';
export { PublicRoute } from './components/PublicRoute';
export { RoleRoute } from './components/RoleRoute';
