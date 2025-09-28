import { create } from 'zustand';

interface NavigationState {
  // Состояние видимости топ-навигации
  isTopNavigationVisible: boolean;
  
  // Действия для управления состоянием
  setTopNavigationVisible: (visible: boolean) => void;
}

export const useNavigationStore = create<NavigationState>()((set) => ({
  // Начальное состояние
  isTopNavigationVisible: true,
  
  // Действия для управления видимостью навигации
  setTopNavigationVisible: (visible: boolean) => {
    set({ isTopNavigationVisible: visible });
  },
}));
