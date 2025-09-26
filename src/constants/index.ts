// Константы приложения
export const APP_NAME = 'Alabuga App';
export const APP_VERSION = '1.0.0';

// Роли пользователей
export const USER_ROLES = {
  HR: 'hr',
  CANDIDATE: 'candidate',
} as const;

// Сообщения
export const MESSAGES = {
  LOADING: 'Загрузка...',
  CHECKING_AUTH: 'Проверка авторизации...',
  LOGIN_SUCCESS: 'Успешный вход в систему',
  LOGOUT_SUCCESS: 'Успешный выход из системы',
  REGISTRATION_SUCCESS: 'Успешная регистрация',
  ERROR_OCCURRED: 'Произошла ошибка',
} as const;

// Размеры
export const SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
} as const;

// Цвета
export const COLORS = {
  PRIMARY: '#3498db',
  SUCCESS: '#27ae60',
  WARNING: '#f39c12',
  ERROR: '#e74c3c',
  INFO: '#17a2b8',
} as const;
