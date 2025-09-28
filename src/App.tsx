import React from 'react';
import { AuthProvider, useAuthContext } from './api';
import { LandingScreen } from './screens/LandingScreen';
import MainContent from './screens/MainContent';
import { Toaster } from './components/ui/sonner';
import { NavigationProvider } from './navigation/Navigation';
import { Route } from 'react-router-dom';
import { Navigate, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import { SeasonHub } from './screens/season-hub/SeasonHub';
import { ArtifactsHub } from './screens/artifacts/ArtifactsHub';

// Компонент приложения с проверкой авторизации
const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuthContext();

  return isAuthenticated ? (
    <Routes>
      <Route path="/" element={<Navigate to="/season-hub" replace />} />
      <Route path="/season-hub" element={<AppLayout />}>
        <Route index element={
          <SeasonHub
            onSkillPathOpen={() => {}}
            onMissionLaunch={() => {}}
            onMissionDetails={() => {}}
            onSquadronDetails={() => {}}
            onShipLogOpen={() => {}}
            onMentorRatingOpen={() => {}}
            onSeasonSettings={() => {}}
            onBranchOpen={() => {}}
          />
        } />
      </Route>
      <Route path="/progress" element={<AppLayout />}>
        <Route index element={<MainContent />} />
      </Route>
      <Route path="/store" element={<AppLayout />}>
        <Route index element={<MainContent />} />
      </Route>
      <Route path="/artifact-hub" element={<AppLayout />}>
        <Route index element={<ArtifactsHub />} />
      </Route>
      <Route path="/profile" element={<AppLayout />}>
        <Route index element={<MainContent />} />
      </Route>
      <Route path="/mentors" element={<AppLayout />}>
        <Route index element={<MainContent />} />
      </Route>
      <Route path="*" element={<Navigate to="/season-hub" replace />} />
    </Routes>
  ) : (
    <Routes>
      <Route path="/" element={<LandingScreen />} />
      <Route path="/auth" element={<LandingScreen />} />
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
