import React, { useState } from 'react';
import { X, Trash2, CreditCard, Bitcoin, ShoppingCart } from 'lucide-react';
import { CartItem } from '../types';
import { translations } from '../translations';

type TranslationType = typeof translations.ru;

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: number) => void;
  total: number;
  t: TranslationType;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, total, t }) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'crypto'>('stripe');

  const handleCheckout = () => {
    if (paymentMethod === 'stripe') {
      alert(`💳 Stripe Checkout initialized for $${total}\n(Integration placeholder)`);
    } else {
      alert(`₿ Crypto Payment\nSend ${total} USDT (TRC20) to:\nTHoQdnRed3faebgF8iZE68zwJYkCYh6EB9`);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-acg-card border-l border-acg-border z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-acg-border flex justify-between items-center bg-zinc-900/50">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="text-acg-yellow" /> {t.cart.title}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
              <ShoppingCart size={64} className="opacity-20" />
              <p>{t.cart.empty}</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-zinc-900/50 border border-acg-border rounded-xl p-4 hover:border-acg-yellow/50 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">
                    {item.type === 'package' ? '🎁 ' : ''}{item.channelName || item.name}
                  </h3>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-zinc-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="text-sm text-zinc-400 mb-3">
                  {item.details}
                </div>
                <div className="font-bold text-acg-yellow">
                  ${item.price}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-acg-border bg-zinc-900">
          <div className="flex justify-between items-center mb-6">
            <span className="text-zinc-400">{t.cart.total}:</span>
            <span className="text-3xl font-bold text-acg-yellow">${total}</span>
          </div>

          {items.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase text-zinc-500 font-bold tracking-wider">{t.cart.method}</label>
                <button 
                  onClick={() => setPaymentMethod('stripe')}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${paymentMethod === 'stripe' ? 'border-acg-yellow bg-acg-yellow/10' : 'border-acg-border bg-acg-card hover:border-zinc-600'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'stripe' ? 'border-acg-yellow' : 'border-zinc-600'}`}>
                    {paymentMethod === 'stripe' && <div className="w-2.5 h-2.5 rounded-full bg-acg-yellow" />}
                  </div>
                  <CreditCard className={paymentMethod === 'stripe' ? 'text-acg-yellow' : 'text-zinc-400'} />
                  <div className="text-left">
                    <div className="text-sm font-bold">{t.cart.card}</div>
                    <div className="text-[10px] text-zinc-400">Visa, Mastercard, Apple Pay</div>
                  </div>
                </button>

                <button 
                  onClick={() => setPaymentMethod('crypto')}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${paymentMethod === 'crypto' ? 'border-acg-yellow bg-acg-yellow/10' : 'border-acg-border bg-acg-card hover:border-zinc-600'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'crypto' ? 'border-acg-yellow' : 'border-zinc-600'}`}>
                    {paymentMethod === 'crypto' && <div className="w-2.5 h-2.5 rounded-full bg-acg-yellow" />}
                  </div>
                  <Bitcoin className={paymentMethod === 'crypto' ? 'text-acg-yellow' : 'text-zinc-400'} />
                  <div className="text-left">
                    <div className="text-sm font-bold">{t.cart.crypto}</div>
                    <div className="text-[10px] text-zinc-400">USDT, BTC, ETH</div>
                  </div>
                </button>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full py-4 bg-acg-yellow hover:bg-[#ffaa00] text-black font-bold text-lg rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,210,0,0.3)] active:scale-95"
              >
                {paymentMethod === 'stripe' ? `💳 ${t.cart.checkoutCard}` : `₿ ${t.cart.checkoutCrypto}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};