import React from 'react';
import { AdminScreen } from './AdminHub';
import { useNavigationStore } from '../../stores/useNavigationStore';
import { useNavigation } from '../../navigation/Navigation';

export const AdminHubWrapper: React.FC = () => {
  const { closeAdminPanel } = useNavigationStore();
  const { push } = useNavigation();

  const handleBack = () => {
    closeAdminPanel();
    push('/season-hub'); // Возвращаемся на главную страницу
  };

  const handleUserDetailOpen = (userId: string) => {
    // Здесь можно добавить логику для открытия детальной информации о пользователе
    console.log('Opening user details for:', userId);
  };

  return (
    <AdminScreen 
      onBack={handleBack}
      onUserDetailOpen={handleUserDetailOpen}
    />
  );
};
