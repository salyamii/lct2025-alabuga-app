import React, { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useNavigation } from '../navigation/Navigation';
import { TopAppBar } from './TopAppBar';
import { TopNavigationTabs } from './TopNavigationTabs';
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
  const { isTopNavigationVisible } = useNavigationStore();

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
    push('/admin');
  };

  const handleSettingsOpen = () => {
    push('/settings');
  };

  const handleNotificationsOpen = () => {
    push('/notifications');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* TopAppBar - всегда видимый на всех устройствах */}
      <div className="cosmic-gradient">
        <TopAppBar
          onAdminOpen={handleAdminOpen}
          onNotificationsOpen={handleNotificationsOpen}
          onSettingsOpen={handleSettingsOpen}
        />
        {/* TopNavigationTabs - только на десктопе и скрывается на определенных страницах */}
        { !isMobile && isTopNavigationVisible && (
          <TopNavigationTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        )}
      </div>
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