'use client';

import { TelegramProvider } from '@/contexts/TelegramContext';
import { CartProvider } from '@/contexts/CartContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TelegramProvider>
      <CartProvider language="ua">
        {children}
      </CartProvider>
    </TelegramProvider>
  );
}
