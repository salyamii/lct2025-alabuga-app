import { create } from 'zustand';
import { User } from '../domain';
import authService from '../api/services/authService';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  fetchUserProfile: () => Promise<void>;
  clearUserData: () => void;
  updateUser: (user: User) => void;
}

export const useUserStore = create<UserState & UserActions>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchUserProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.getProfile();
      const user = User.fromResponse(response.data);
      set({ user, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить профиль пользователя', isLoading: false });
    }
  },

  clearUserData: () => {
    set({ user: null, error: null });
  },

  updateUser: (user: User) => {
    set({ user });
  },
}));
