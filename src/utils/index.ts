// Утилиты для работы с данными

// Форматирование имени пользователя
export const formatUserName = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return 'Пользователь';
  return `${firstName || ''} ${lastName || ''}`.trim();
};

// Форматирование роли пользователя
export const formatUserRole = (role?: string): string => {
  const roleMap: Record<string, string> = {
    hr: 'HR',
    candidate: 'Кандидат',
  };
  return roleMap[role || ''] || role || 'Пользователь';
};

// Валидация email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Валидация пароля
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Дебаунс функция
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Генерация случайного ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Форматирование даты
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Форматирование времени
export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
