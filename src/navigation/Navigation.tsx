import React, { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

type NavCtx = {
  navigate: (to: string, opts?: { replace?: boolean }) => void;
  push: (to: string) => void;
  replace: (to: string) => void;
  back: () => void;
  go: (n: number) => void;
};

const NavigationContext = createContext<NavCtx | null>(null);

export const NavigationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const rrdNavigate = useNavigate();

  const api = useMemo<NavCtx>(() => ({
    navigate: (to, opts) => rrdNavigate(to, { replace: opts?.replace }),
    push: (to) => rrdNavigate(to),
    replace: (to) => rrdNavigate(to, { replace: true }),
    back: () => rrdNavigate(-1),
    go: (n) => rrdNavigate(n),
  }), [rrdNavigate]);

  return (
    <NavigationContext.Provider value={api}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavCtx => {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
};