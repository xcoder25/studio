
'use client';

import { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import SplashScreen from '@/components/splash-screen';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: (duration?: number) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTimer, setLoadingTimer] = useState<NodeJS.Timeout | null>(null);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    if (loadingTimer) {
      clearTimeout(loadingTimer);
      setLoadingTimer(null);
    }
  }, [loadingTimer]);

  const showLoading = useCallback((duration: number = 3000) => {
    setIsLoading(true);
    if (loadingTimer) {
      clearTimeout(loadingTimer);
    }
    const timer = setTimeout(() => {
      hideLoading();
    }, duration);
    setLoadingTimer(timer);
  }, [hideLoading, loadingTimer]);


  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {isLoading && <SplashScreen />}
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
