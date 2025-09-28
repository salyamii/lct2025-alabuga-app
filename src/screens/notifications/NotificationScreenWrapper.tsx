import React from 'react';
import { NotificationsScreen } from './NotificationScreen';
import { useNavigationStore } from '../../stores/useNavigationStore';
import { useNavigation } from '../../navigation/Navigation';

export const NotificationScreenWrapper: React.FC = () => {
  const { closeNotifications } = useNavigationStore();
  const { push } = useNavigation();

  const handleBack = () => {
    closeNotifications(); // Закрываем уведомления и показываем топ-бар
    push('/season-hub'); // Возвращаемся на главную страницу
  };

  return (
    <NotificationsScreen 
      onBack={handleBack}
    />
  );
};
