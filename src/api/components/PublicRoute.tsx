import React from 'react';
import { useAuthContext } from '../context/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Компонент для публичных маршрутов
 * Показывает children только если пользователь НЕ авторизован
 * Используется для страниц входа, регистрации и т.д.
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  fallback = <div>Загрузка...</div>,
  redirectTo = '/dashboard'
}) => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <>{fallback}</>;
  }

  if (isAuthenticated) {
    // Если пользователь уже авторизован, перенаправляем на главную страницу
    if (redirectTo) {
      window.location.href = redirectTo;
    }
    return <div>Вы уже авторизованы</div>;
  }

  return <>{children}</>;
};

export default PublicRoute;
