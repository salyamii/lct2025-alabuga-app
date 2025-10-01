import React, { useState, useEffect } from "react";
import { AuthProvider, useAuthContext } from "./api";
import { LandingScreen } from "./screens/LandingScreen";
import MainContent from "./screens/MainContent";
import { Toaster } from "./components/ui/sonner";
import { NavigationProvider, useNavigation } from "./navigation/Navigation";
import { Route } from "react-router-dom";
import { Navigate, Routes, useNavigate, useLocation } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import { SeasonHub } from "./screens/season-hub/SeasonHub";
import { ArtifactsHub } from "./screens/artifacts/ArtifactsHub";
import { StoreHub } from "./screens/store/StoreHub";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { AdminHubScreen } from "./screens/admin/AdminHub";
import { MentorshipScreen } from "./screens/mentor-hub/MentorHub";
import { UserProfileHub } from "./screens/profile-hub/UserProfileHub";
import { ProgressHub } from "./screens/progress-hub/ProgressHub";
import { SettingsScreen } from "./screens/settings/SettingsScreen";
import { useNavigationStore } from "./stores/useNavigationStore";
import { NotificationsScreen } from "./screens/notifications/NotificationScreen";
import {
  MissionExecutionScreen,
  MissionDetailScreen,
} from "./screens/mission-execution";
import { useStoreStore } from "./stores/useStoreStore";
import { useUserStore } from "./stores/useUserStore";
import { toast } from "sonner";

// Компонент приложения с проверкой авторизации
const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuthContext();
  const navigate = useNavigate();
  const { back } = useNavigation();
  const location = useLocation();
  const { setTopNavigationVisible } = useNavigationStore();
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(() => {
    return localStorage.getItem("shouldShowOnboarding") === "true";
  });

  // Сброс флага онбординга при разлогине
  useEffect(() => {
    if (!isAuthenticated) {
      setShouldShowOnboarding(false);
      localStorage.removeItem("shouldShowOnboarding");
    }
  }, [isAuthenticated]);

  // Сохранение состояния в localStorage
  useEffect(() => {
    localStorage.setItem(
      "shouldShowOnboarding",
      shouldShowOnboarding.toString()
    );
  }, [shouldShowOnboarding]);

  // Управление видимостью навигационных вкладок на основе маршрута
  useEffect(() => {
    const pathname = location.pathname;

    // Маршруты, где навигационные вкладки должны быть скрыты
    const hideNavigationTabsRoutes = [
      "/notifications",
      "/admin",
      "/settings",
      "/mission",
      "/mission-detail",
    ];

    // Проверяем, начинается ли текущий путь с любого из маршрутов для скрытия
    const shouldHideNavigationTabs = hideNavigationTabsRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    setTopNavigationVisible(!shouldHideNavigationTabs);
  }, [location.pathname, setTopNavigationVisible]);

  return isAuthenticated ? (
    <Routes>
      <Route
        path="/onboarding"
        element={
          <OnboardingScreen
            onComplete={() => {
              setShouldShowOnboarding(false);
              navigate("/season-hub");
            }}
          />
        }
      />
      <Route path="/season-hub" element={<AppLayout />}>
        <Route
          index
          element={
            <SeasonHub
              onMissionLaunch={(missionId) => navigate(`/mission/${missionId}`)}
              onMissionDetails={(missionId) =>
                navigate(`/mission-detail/${missionId}`)
              }
              onSquadronDetails={() => {}}
              onShipLogOpen={() => {}}
              onMentorRatingOpen={() => {}}
              onMissionChainOpen={() => {}}
            />
          }
        />
      </Route>
      <Route path="/progress" element={<AppLayout />}>
        <Route
          index
          element={
            <ProgressHub
              onMissionDetails={(missionId) =>
                navigate(`/mission/${missionId}`)
              }
            />
          }
        />
      </Route>
      <Route path="/store" element={<AppLayout />}>
        <Route
          index
          element={
            <StoreHub
              onPurchase={async (itemId) => {
                const { purchaseItem } = useStoreStore.getState();
                const { user, fetchUserProfile } = useUserStore.getState();

                if (!user) {
                  toast.error("Необходимо авторизоваться");
                  return;
                }

                // Покупаем товар
                const result = await purchaseItem({ storeItemId: itemId });

                if (result) {
                  // Обновляем профиль пользователя для актуальной маны
                  await fetchUserProfile();
                }
              }}
            />
          }
        />
      </Route>
      <Route path="/artifact-hub" element={<AppLayout />}>
        <Route index element={<ArtifactsHub />} />
      </Route>
      <Route path="/profile" element={<AppLayout />}>
        <Route
          index
          element={
            <UserProfileHub
              onMentorshipOpen={() => navigate("/mentors")}
              onSettingsOpen={() => navigate("/settings")}
              onGuildProgressOpen={() => {}}
              onArtifactsOpen={() => navigate("/artifact-hub")}
            />
          }
        />
      </Route>
      <Route path="/mentors" element={<AppLayout />}>
        <Route index element={<MentorshipScreen onBack={back} />} />
      </Route>
      <Route path="/admin" element={<AdminHubScreen onBack={back} />} />
      <Route path="/settings" element={<SettingsScreen onBack={back} />} />
      <Route
        path="/notifications"
        element={<NotificationsScreen onBack={back} />}
      />
      <Route
        path="/mission/:missionId"
        element={
          <MissionExecutionScreen
            onBack={back}
          />
        }
      />
      <Route
        path="/mission-detail/:missionId"
        element={<MissionDetailScreen onBack={back} />}
      />
      <Route
        path="*"
        element={
          <Navigate
            to={shouldShowOnboarding ? "/onboarding" : "/season-hub"}
            replace
          />
        }
      />
    </Routes>
  ) : (
    <Routes>
      <Route
        path="/auth"
        element={
          <LandingScreen
            onLoginSuccess={() => navigate("/season-hub")}
            onRegisterSuccess={() => {
              setShouldShowOnboarding(true);
              navigate("/onboarding");
            }}
          />
        }
      />
      <Route
        path="/onboarding"
        element={
          <OnboardingScreen
            onComplete={() => {
              setShouldShowOnboarding(false);
              navigate("/season-hub");
            }}
          />
        }
      />
      <Route path="*" element={<Navigate to="/auth" replace />} />
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
