'use client';

import { TelegramProvider } from '@/contexts/TelegramContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <TelegramProvider>{children}</TelegramProvider>;
}
