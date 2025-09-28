import React, { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useNavigation } from '../navigation/Navigation';
import { DesktopNavigationTopBar } from './DesktopNavigationTopBar';
import { useIsMobile } from '../components/ui/use-mobile';
import { MobileNavigationBottomBar } from './MobileNavigationBottomBar';
import { useNavigationStore } from '../stores/useNavigationStore';

const TAB_TO_PATH = {
  season: 'season-hub',
  progress: 'progress',
  store: 'store',
  badges: 'artifact-hub',
  profile: 'profile',
  mentors: 'mentors',
} as const;

const PATH_TO_TAB: Record<string, keyof typeof TAB_TO_PATH> = {
  'season-hub': 'season',
  'progress': 'progress',
  'store': 'store',
  'artifact-hub': 'badges',
  'profile': 'profile',
  'mentors': 'mentors',
};

export default function AppLayout() {
  const { push } = useNavigation();
  const { pathname } = useLocation();
  const { isTopNavigationVisible, openAdminPanel } = useNavigationStore();

  const isMobile = useIsMobile();

  const activeTab = useMemo(() => {
    // Получаем первый сегмент пути (после /)
    const seg = pathname.split('/')[1] || '';
    return PATH_TO_TAB[seg] ?? 'season';
  }, [pathname]);

  const handleTabChange = (tab: string) => {
    const seg = (TAB_TO_PATH as any)[tab] ?? 'season-hub';
    push(`/${seg}`);
  };

  const handleAdminOpen = () => {
    openAdminPanel();
    push('/admin');
  };

  return (
    <div className="min-h-screen flex flex-col">
      { !isMobile && isTopNavigationVisible && <DesktopNavigationTopBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAdminOpen={handleAdminOpen}
        onNotificationsOpen={() => {}}
        onSettingsOpen={() => {}}
      />}
      <main className={`flex-1 ${isMobile ? 'pb-16' : ''}`}>
        <Outlet />
        {isMobile && (
          <div
            aria-hidden
            style={{ height: 'calc(4rem + env(safe-area-inset-bottom, 0px))' }}
          />
        )}
      </main>
      { isMobile && <MobileNavigationBottomBar activeTab={activeTab} onTabChange={handleTabChange} />}
    </div>
  );
}