import React from 'react';
import { AuthProvider, useAuthContext } from './api';
import { LandingScreen } from './screens/LandingScreen';
import MainContent from './screens/MainContent';
import { Toaster } from './components/ui/sonner';
import { NavigationProvider } from './navigation/Navigation';
import { Route } from 'react-router-dom';
import { Navigate, Routes } from 'react-router-dom';

// Компонент приложения с проверкой авторизации
const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuthContext();

  // Показываем загрузку при проверке авторизации
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-background">
  //       <div className="text-center">
  //         <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
  //         <p className="text-muted-foreground">Проверка авторизации...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return isAuthenticated ? (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="/app/*" element={<MainContent />} />
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  ) : (
    <Routes>
      <Route path="/" element={<LandingScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Главный компонент приложения с провайдером авторизации
const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <NavigationProvider>
          <AppContent />
          <Toaster position="top-left" />
        </NavigationProvider>
      </div>
    </AuthProvider>
  );
};

export default App;
