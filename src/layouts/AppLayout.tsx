import React, { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useNavigation } from '../navigation/Navigation';
import { DesktopNavigationTopBar } from './DesktopNavigationTopBar';
import { useIsMobile } from '../components/ui/use-mobile';
import { MobileNavigationBottomBar } from './MobileNavigationBottomBar';

const TAB_TO_PATH = {
  missions: 'missions',
  progress: 'progress',
  store: 'store',
  badges: 'badges',
  profile: 'profile',
  mentors: 'mentors',
} as const;

const PATH_TO_TAB: Record<string, keyof typeof TAB_TO_PATH> = {
  '': 'missions',
  missions: 'missions',
  progress: 'progress',
  store: 'store',
  badges: 'badges',
  profile: 'profile',
  mentors: 'mentors',
};

export default function AppLayout() {
  const { push } = useNavigation();
  const { pathname } = useLocation();

  const isMobile = useIsMobile();

  const activeTab = useMemo(() => {
    const afterApp = pathname.replace(/^\/app\/?/, '');
    const seg = afterApp.split('/')[0] || '';
    return PATH_TO_TAB[seg] ?? 'missions';
  }, [pathname]);

  const handleTabChange = (tab: string) => {
    const seg = (TAB_TO_PATH as any)[tab] ?? 'missions';
    push(`/app/${seg}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      { !isMobile && <DesktopNavigationTopBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAdminOpen={() => {}}
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