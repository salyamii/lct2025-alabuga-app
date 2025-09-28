import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavigationState {
  // Состояние видимости топ-навигации
  isTopNavigationVisible: boolean;
  
  // Состояние админ-панели
  isAdminPanelOpen: boolean;
  
  // Действия для управления состоянием
  setTopNavigationVisible: (visible: boolean) => void;
  setAdminPanelOpen: (open: boolean) => void;
  
  // Действия для управления админ-панелью
  openAdminPanel: () => void;
  closeAdminPanel: () => void;
  
  // Действие для скрытия навигации при открытии админ-панели
  toggleAdminPanel: () => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      isTopNavigationVisible: true,
      isAdminPanelOpen: false,
      
      // Действия для управления видимостью навигации
      setTopNavigationVisible: (visible: boolean) => {
        set({ isTopNavigationVisible: visible });
      },
      
      // Действия для управления админ-панелью
      setAdminPanelOpen: (open: boolean) => {
        set({ 
          isAdminPanelOpen: open,
          // Автоматически скрываем топ-навигацию при открытии админ-панели
          isTopNavigationVisible: !open
        });
      },
      
      openAdminPanel: () => {
        set({ 
          isAdminPanelOpen: true,
          isTopNavigationVisible: false
        });
      },
      
      closeAdminPanel: () => {
        set({ 
          isAdminPanelOpen: false,
          isTopNavigationVisible: true
        });
      },
      
      toggleAdminPanel: () => {
        const { isAdminPanelOpen } = get();
        if (isAdminPanelOpen) {
          get().closeAdminPanel();
        } else {
          get().openAdminPanel();
        }
      },
    }),
    {
      name: 'navigation-storage', // ключ для localStorage
      // Сохраняем только состояние админ-панели, видимость навигации восстанавливаем по умолчанию
      partialize: (state) => ({ 
        isAdminPanelOpen: state.isAdminPanelOpen 
      }),
    }
  )
);
