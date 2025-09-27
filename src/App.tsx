import React from 'react';
import { AuthProvider, useAuthContext } from './api';
import { LandingScreen } from './screens/LandingScreen';
import MainContent from './screens/MainContent';
import { Toaster } from './components/ui/sonner';
import { NavigationProvider } from './navigation/Navigation';
import { Route } from 'react-router-dom';
import { Navigate, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';

// Компонент приложения с проверкой авторизации
const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuthContext();

  return isAuthenticated ? (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="/app/*" element={<AppLayout />}>
        <Route index element={<MainContent />} />
        <Route path="missions" element={<MainContent />} />
        <Route path="progress" element={<MainContent />} />
        <Route path="store" element={<MainContent />} />
        <Route path="badges" element={<MainContent />} />
        <Route path="profile" element={<MainContent />} />
        <Route path="mentors" element={<MainContent />} />
      </Route>
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
