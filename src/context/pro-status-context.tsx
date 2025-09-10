
'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

interface ProStatusContextType {
  isProPlan: boolean;
  setIsProPlan: (isPro: boolean) => void;
  isAgencyPlan: boolean;
  setIsAgencyPlan: (isAgency: boolean) => void;
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
}

const ProStatusContext = createContext<ProStatusContextType | undefined>(undefined);

export function ProStatusProvider({ children }: { children: ReactNode }) {
  const [isProPlan, setIsProPlan] = useState(false);
  const [isAgencyPlan, setIsAgencyPlan] = useState(false);
  const [credits, setCredits] = useState(50);

  return (
    <ProStatusContext.Provider value={{ isProPlan, setIsProPlan, isAgencyPlan, setIsAgencyPlan, credits, setCredits }}>
      {children}
    </ProStatusContext.Provider>
  );
}

export function useProStatus() {
  const context = useContext(ProStatusContext);
  if (context === undefined) {
    throw new Error('useProStatus must be used within a ProStatusProvider');
  }
  return context;
}
