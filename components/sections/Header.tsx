'use client';

import React from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { translations, Language } from '@/lib/translations';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  onCartOpen: () => void;
  t: typeof translations.ru;
}

export function Header({ searchQuery, onSearchChange, cartCount, onCartOpen, t }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="lg:hidden flex items-center gap-3 w-full">
        <h1 className="font-black text-2xl tracking-tighter">
          <span className="text-acg-yellow drop-shadow-[0_0_5px_rgba(255,210,0,0.5)]">ACG</span>
          <span className="text-white ml-1">Market</span>
        </h1>
        <button
          onClick={onCartOpen}
          className="ml-auto relative w-10 h-10 flex items-center justify-center bg-white/5 rounded-full active:scale-95 transition-transform"
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-acg-yellow text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <h2 className="hidden md:block text-2xl font-black text-white/90">
        {t.header.title}
      </h2>

      <div className="relative w-full md:w-[320px] group">
        <input
          type="text"
          placeholder={t.header.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#151515] border border-white/10 text-white px-5 py-3 pl-11 rounded-xl focus:outline-none focus:border-acg-yellow/50 focus:ring-1 focus:ring-acg-yellow/50 focus:bg-white/5 transition-all placeholder:text-zinc-600"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-acg-yellow transition-colors" size={18} />
      </div>
    </header>
  );
}
