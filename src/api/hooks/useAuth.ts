import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { 
  UserResponse, 
  UserLoginRequest, 
  HRUserRegistrationRequest,
  CandidateUserRegistrationRequest,
  ApiError 
} from '../types/apiTypes';

interface UseAuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: ApiError | null;
}

export function useAuth() {
  const [state, setState] = useState<UseAuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  // Проверяем авторизацию при инициализации
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const response = await authService.getProfile();
          setState({
            user: response.data,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (error) {
          setState({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: error as ApiError,
          });
        }
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials: UserLoginRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authService.login(credentials);
      
      // После успешного входа получаем профиль пользователя
      const profileResponse = await authService.getProfile();
      setState({
        user: profileResponse.data,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error as ApiError,
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      await authService.logout();
    } catch (error) {
      // Игнорируем ошибки при выходе
    } finally {
      setState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  }, []);

  const registerHR = useCallback(async (userData: HRUserRegistrationRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authService.registerHR(userData);
      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error as ApiError,
      }));
      throw error;
    }
  }, []);

  const registerCandidate = useCallback(async (userData: CandidateUserRegistrationRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authService.registerCandidate(userData);
      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error as ApiError,
      }));
      throw error;
    }
  }, []);

  return {
    ...state,
    login,
    logout,
    registerHR,
    registerCandidate,
  };
}
