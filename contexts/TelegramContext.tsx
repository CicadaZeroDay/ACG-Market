'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useTelegramWebApp, UseTelegramWebAppReturn } from '@/hooks/useTelegramWebApp';

const TelegramContext = createContext<UseTelegramWebAppReturn | null>(null);

interface TelegramProviderProps {
  children: ReactNode;
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const telegram = useTelegramWebApp();

  return (
    <TelegramContext.Provider value={telegram}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram(): UseTelegramWebAppReturn {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
}

export default TelegramContext;
