import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserResponse, ApiError } from '../types/apiTypes';

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: ApiError | null;
  login: (credentials: { login: string; password: string }) => Promise<any>;
  logout: () => Promise<void>;
  registerHR: (userData: {
    login: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) => Promise<any>;
  registerCandidate: (userData: {
    login: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
