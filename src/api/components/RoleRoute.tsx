import React from 'react';
import { useAuthContext } from '../context/AuthContext';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Компонент для маршрутов с проверкой ролей
 * Показывает children только если пользователь авторизован и имеет нужную роль
 */
export const RoleRoute: React.FC<RoleRouteProps> = ({ 
  children, 
  allowedRoles,
  fallback = <div>Загрузка...</div>,
  redirectTo = '/unauthorized'
}) => {
  const { isAuthenticated, loading, user } = useAuthContext();

  if (loading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    if (redirectTo) {
      window.location.href = '/login';
    }
    return <div>Необходима авторизация</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    if (redirectTo) {
      window.location.href = redirectTo;
    }
    return <div>Недостаточно прав для доступа к этой странице</div>;
  }

  return <>{children}</>;
};

export default RoleRoute;
