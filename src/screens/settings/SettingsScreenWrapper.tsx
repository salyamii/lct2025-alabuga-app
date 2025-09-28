import React from 'react';
import { SettingsScreen } from './SettingsScreen';
import { useNavigationStore } from '../../stores/useNavigationStore';
import { useNavigation } from '../../navigation/Navigation';

export const SettingsScreenWrapper: React.FC = () => {
  const { closeSettings } = useNavigationStore();
  const { push } = useNavigation();

  const handleBack = () => {
    closeSettings(); // Закрываем настройки и показываем топ-бар
    push('/season-hub'); // Возвращаемся на главную страницу
  };

  return (
    <SettingsScreen 
      onBack={handleBack}
    />
  );
};
