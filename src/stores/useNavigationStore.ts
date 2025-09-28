import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavigationState {
  // Состояние видимости топ-навигации
  isTopNavigationVisible: boolean;
  
  // Состояние админ-панели
  isAdminPanelOpen: boolean;
  
  // Состояние настроек
  isSettingsOpen: boolean;
  
  // Состояние уведомлений
  isNotificationsOpen: boolean;
  
  // Действия для управления состоянием
  setTopNavigationVisible: (visible: boolean) => void;
  setAdminPanelOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  
  // Действия для управления админ-панелью
  openAdminPanel: () => void;
  closeAdminPanel: () => void;
  toggleAdminPanel: () => void;
  
  // Действия для управления настройками
  openSettings: () => void;
  closeSettings: () => void;
  toggleSettings: () => void;
  
  // Действия для управления уведомлениями
  openNotifications: () => void;
  closeNotifications: () => void;
  toggleNotifications: () => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      isTopNavigationVisible: true,
      isAdminPanelOpen: false,
      isSettingsOpen: false,
      isNotificationsOpen: false,
      
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
      
      // Действия для управления настройками
      setSettingsOpen: (open: boolean) => {
        set({ 
          isSettingsOpen: open,
          // Автоматически скрываем топ-навигацию при открытии настроек
          isTopNavigationVisible: !open
        });
      },
      
      openSettings: () => {
        set({ 
          isSettingsOpen: true,
          isTopNavigationVisible: false
        });
      },
      
      closeSettings: () => {
        set({ 
          isSettingsOpen: false,
          isTopNavigationVisible: true
        });
      },
      
      toggleSettings: () => {
        const { isSettingsOpen } = get();
        if (isSettingsOpen) {
          get().closeSettings();
        } else {
          get().openSettings();
        }
      },
      
      // Действия для управления уведомлениями
      setNotificationsOpen: (open: boolean) => {
        set({ 
          isNotificationsOpen: open,
          // Автоматически скрываем топ-навигацию при открытии уведомлений
          isTopNavigationVisible: !open
        });
      },
      
      openNotifications: () => {
        set({ 
          isNotificationsOpen: true,
          isTopNavigationVisible: false
        });
      },
      
      closeNotifications: () => {
        set({ 
          isNotificationsOpen: false,
          isTopNavigationVisible: true
        });
      },
      
      toggleNotifications: () => {
        const { isNotificationsOpen } = get();
        if (isNotificationsOpen) {
          get().closeNotifications();
        } else {
          get().openNotifications();
        }
      },
    }),
    {
      name: 'navigation-storage', // ключ для localStorage
      // Сохраняем состояние админ-панели, настроек и уведомлений, видимость навигации восстанавливаем по умолчанию
      partialize: (state) => ({ 
        isAdminPanelOpen: state.isAdminPanelOpen,
        isSettingsOpen: state.isSettingsOpen,
        isNotificationsOpen: state.isNotificationsOpen
      }),
    }
  )
);
