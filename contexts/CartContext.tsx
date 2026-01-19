'use client';

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useTelegram } from '@/contexts/TelegramContext';
import { Channel, Product, Package, CartItem } from '@/lib/types';
import { Language } from '@/lib/translations';

interface CartContextValue {
  cart: CartItem[];
  isCartLoaded: boolean;
  isCartOpen: boolean;
  cartTotal: number;
  cartCount: number;
  addToCart: (channel: Channel, product: Product, extras: string[], price: number) => void;
  buyNow: (channel: Channel, product: Product, extras: string[], price: number) => void;
  addPackageToCart: (pkg: Package) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: ReactNode;
  language: Language;
}

export function CartProvider({ children, language }: CartProviderProps) {
  const cartState = useCart({ language });
  const { isMiniApp, showBackButton, hideBackButton, hapticFeedback } = useTelegram();

  // Handle back button in Mini App when cart is open
  useEffect(() => {
    if (isMiniApp && cartState.isCartOpen) {
      showBackButton(() => {
        cartState.setIsCartOpen(false);
        hapticFeedback('light');
      });
    } else {
      hideBackButton();
    }
  }, [isMiniApp, cartState.isCartOpen, showBackButton, hideBackButton, hapticFeedback, cartState]);

  return (
    <CartContext.Provider value={cartState}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
