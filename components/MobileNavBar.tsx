'use client';

import React from 'react';
import { LayoutGrid, Mic2, MessageCircle, ShoppingCart, Package } from 'lucide-react';
import { FilterType } from '@/lib/types';
import { translations } from '@/lib/translations';

type TranslationType = typeof translations.ru;

interface MobileNavBarProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  cartCount: number;
  onCartOpen: () => void;
  onPackagesClick: () => void;
  t: TranslationType;
  hidden?: boolean;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  filter,
  onFilterChange,
  cartCount,
  onCartOpen,
  onPackagesClick,
  t,
  hidden = false
}) => {
  if (hidden) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-xl border-t border-white/5 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex items-center justify-around px-2 py-2">
        {/* All */}
        <button
          onClick={() => onFilterChange('all')}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all haptic-tap min-w-[60px] ${
            filter === 'all'
              ? 'text-acg-yellow bg-acg-yellow/10'
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          <LayoutGrid size={20} />
          <span className="text-[10px] font-bold">{t.sidebar.all}</span>
        </button>

        {/* Channels */}
        <button
          onClick={() => onFilterChange('channel')}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all haptic-tap min-w-[60px] ${
            filter === 'channel'
              ? 'text-acg-yellow bg-acg-yellow/10'
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          <Mic2 size={20} />
          <span className="text-[10px] font-bold">{t.sidebar.channels}</span>
        </button>

        {/* Chats */}
        <button
          onClick={() => onFilterChange('chat')}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all haptic-tap min-w-[60px] ${
            filter === 'chat'
              ? 'text-acg-yellow bg-acg-yellow/10'
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          <MessageCircle size={20} />
          <span className="text-[10px] font-bold">{t.sidebar.chats}</span>
        </button>

        {/* Packages */}
        <button
          onClick={onPackagesClick}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all haptic-tap min-w-[60px] text-zinc-500 hover:text-white"
        >
          <Package size={20} />
          <span className="text-[10px] font-bold">{t.sidebar.packages}</span>
        </button>

        {/* Cart */}
        <button
          onClick={onCartOpen}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all haptic-tap min-w-[60px] text-zinc-500 hover:text-white relative"
        >
          <div className="relative">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-acg-yellow text-black text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">{t.sidebar.cart}</span>
        </button>
      </div>
    </nav>
  );
};
