'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CryptoCheckout from '@/components/CryptoCheckout';
import { useCartContext } from '@/contexts/CartContext';

function CheckoutContent() {
  const router = useRouter();
  const { cart, cartTotal, clearCart, isCartLoaded } = useCartContext();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  useEffect(() => {
    // Generate order ID on mount
    setOrderId(`order_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  }, []);

  // Redirect if cart is empty (only after cart is loaded from localStorage, and not after payment)
  useEffect(() => {
    if (isCartLoaded && orderId && cart.length === 0 && !paymentCompleted) {
      router.push('/');
    }
  }, [cart, orderId, router, isCartLoaded, paymentCompleted]);

  const handleSuccess = () => {
    setPaymentCompleted(true);
    clearCart();
  };

  const handleCancel = () => {
    router.back();
  };

  if (!orderId || !isCartLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Завантаження...</div>
      </div>
    );
  }

  if (cart.length === 0 && !paymentCompleted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Кошик порожній</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors"
          >
            Повернутися до каталогу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-white text-center mb-8">
          Оформлення замовлення
        </h1>

        <CryptoCheckout
          orderId={orderId}
          amountUsd={cartTotal}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />

        {/* Order summary */}
        <div className="mt-8 p-6 bg-gray-800 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Ваше замовлення</h3>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-gray-300">
                <div>
                  <span>{item.name}</span>
                  {item.channelName && (
                    <span className="text-gray-500 text-sm ml-2">({item.channelName})</span>
                  )}
                </div>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-700 mt-4 pt-4 flex justify-between">
            <span className="text-white font-semibold">Всього:</span>
            <span className="text-white font-bold text-xl">${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Завантаження...</div>
      </div>
    );
  }

  return <CheckoutContent />;
}
