
'use client';

import { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import SplashScreen from '@/components/splash-screen';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const showLoading = useCallback(() => {
    setIsLoading(true);
  }, []);


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
