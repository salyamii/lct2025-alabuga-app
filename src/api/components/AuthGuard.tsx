import React from 'react';
import { useAuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Компонент для защиты маршрутов
 * Показывает children только если пользователь авторизован
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = <div>Загрузка...</div>,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    // В реальном приложении здесь будет редирект через роутер
    if (redirectTo) {
      window.location.href = redirectTo;
    }
    return <div>Необходима авторизация</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
