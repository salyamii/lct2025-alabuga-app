import { useAuthContext } from '../context/AuthContext';

/**
 * Хук для работы с авторизацией в роутинге
 * Предоставляет методы для проверки авторизации и управления маршрутами
 */
export function useAuthRoute() {
  const { isAuthenticated, loading, user } = useAuthContext();

  return {
    // Основные статусы
    isAuthenticated,
    isLoading: loading,
    user,
    
    // Проверки для роутинга
    canAccessProtectedRoute: isAuthenticated && !loading,
    shouldRedirectToLogin: !isAuthenticated && !loading,
    
    // Информация о пользователе для роутинга
    userRole: user?.role,
    userName: user ? `${user.firstName} ${user.lastName}` : null,
    userLogin: user?.login,
    
    // Проверки ролей
    isHR: user?.role === 'hr',
    isCandidate: user?.role === 'candidate',
  };
}
