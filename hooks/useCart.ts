import { useState, useCallback, useMemo } from 'react';
import { Channel, Product, Package, CartItem } from '@/lib/types';
import { translations, Language } from '@/lib/translations';
import { useTelegram } from '@/contexts/TelegramContext';

interface UseCartOptions {
  language: Language;
}

export function useCart({ language }: UseCartOptions) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { hapticFeedback } = useTelegram();

  const t = translations[language];

  const createCartItem = useCallback((
    channel: Channel,
    product: Product,
    extras: string[],
    price: number
  ): CartItem => {
    const extraNames: Record<string, string> = {
      top6: t.product.top6,
      pin24: t.product.pin24,
      pin48: t.product.pin48
    };
    const details = `${product.name}` + (extras.length > 0 ? ` + ${extras.map(e => extraNames[e]).join(', ')}` : '');

    return {
      id: Date.now(),
      type: 'product',
      referenceId: product.id,
      name: product.name,
      channelName: channel.name,
      details,
      price,
      extras
    };
  }, [t.product.top6, t.product.pin24, t.product.pin48]);

  const addToCart = useCallback((
    channel: Channel,
    product: Product,
    extras: string[],
    price: number
  ) => {
    const newItem = createCartItem(channel, product, extras, price);
    setCart(prev => [...prev, newItem]);
    setIsCartOpen(true);
    hapticFeedback('success');
  }, [createCartItem, hapticFeedback]);

  const buyNow = useCallback((
    channel: Channel,
    product: Product,
    extras: string[],
    price: number
  ) => {
    const newItem = createCartItem(channel, product, extras, price);
    setCart(prev => [...prev, newItem]);
    setIsCartOpen(true);
    hapticFeedback('success');
  }, [createCartItem, hapticFeedback]);

  const addPackageToCart = useCallback((pkg: Package) => {
    const newItem: CartItem = {
      id: Date.now(),
      type: 'package',
      referenceId: pkg.id,
      name: pkg.name,
      details: t.cart.package,
      price: pkg.price
    };
    setCart(prev => [...prev, newItem]);
    setIsCartOpen(true);
    hapticFeedback('success');
  }, [t.cart.package, hapticFeedback]);

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
    hapticFeedback('light');
  }, [hapticFeedback]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + item.price, 0), [cart]);

  const cartCount = cart.length;

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  return {
    cart,
    isCartOpen,
    cartTotal,
    cartCount,
    addToCart,
    buyNow,
    addPackageToCart,
    removeFromCart,
    clearCart,
    openCart,
    closeCart,
    setIsCartOpen
  };
}
