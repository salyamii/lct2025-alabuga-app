import { useAuth } from './useAuth';

/**
 * Хук для проверки статуса авторизации на любом экране
 * Возвращает информацию о том, авторизован ли пользователь
 */
export function useAuthStatus() {
  const { user, isAuthenticated, loading, error } = useAuth();

  return {
    // Основные статусы
    isAuthenticated,
    isLoading: loading,
    hasError: !!error,
    
    // Информация о пользователе
    user,
    userRole: user?.role,
    userName: user ? `${user.firstName} ${user.lastName}` : null,
    userLogin: user?.login,
    
    // Дополнительные проверки
    isHR: user?.role === 'hr',
    isCandidate: user?.role === 'candidate',
    
    // Ошибки
    error,
  };
}
