'use client';

import React from 'react';
import {
  LayoutGrid,
  MessageCircle,
  Mic2,
  ShoppingCart,
  TrendingUp,
  Crown,
  Rocket,
  Sparkles,
  Globe
} from 'lucide-react';
import { FilterType, Package } from '@/lib/types';
import { translations, Language } from '@/lib/translations';

interface SidebarProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  channelCount: number;
  chatCount: number;
  totalCount: number;
  cartCount: number;
  onCartOpen: () => void;
  onPackageClick: (pkgId: string) => void;
  packages: Package[];
  language: Language;
  onLanguageChange: (lang: Language) => void;
  t: typeof translations.ru;
}

// Иконки для пакетов по индексу
const PACKAGE_ICONS = [Rocket, TrendingUp, Crown];

export function Sidebar({
  filter,
  onFilterChange,
  channelCount,
  chatCount,
  totalCount,
  cartCount,
  onCartOpen,
  onPackageClick,
  packages,
  language,
  onLanguageChange,
  t
}: SidebarProps) {
  return (
    <aside className="hidden lg:flex w-[280px] bg-[#0f0f0f] border-r border-white/5 flex-col fixed h-full z-20">
      <div className="p-8 pb-6">
        <div className="cursor-pointer group flex items-center gap-0">
          <h1 className="font-black text-3xl tracking-tighter transform group-hover:scale-[1.02] transition-transform duration-300">
            <span className="text-acg-yellow drop-shadow-[0_0_8px_rgba(255,210,0,0.4)]">ACG</span>
            <span className="text-white ml-1.5">Market</span>
          </h1>
        </div>
        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mt-1 pl-1">
          {t.sidebar.officialStore}
        </p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
        <div>
          <h3 className="text-[10px] uppercase text-zinc-500 font-extrabold tracking-wider mb-3 px-4">
            {t.sidebar.catalog}
          </h3>
          <div className="space-y-1">
            <FilterButton
              active={filter === 'all'}
              onClick={() => onFilterChange('all')}
              icon={LayoutGrid}
              label={t.sidebar.all}
              count={totalCount}
            />
            <FilterButton
              active={filter === 'channel'}
              onClick={() => onFilterChange('channel')}
              icon={Mic2}
              label={t.sidebar.channels}
              count={channelCount}
            />
            <FilterButton
              active={filter === 'chat'}
              onClick={() => onFilterChange('chat')}
              icon={MessageCircle}
              label={t.sidebar.chats}
              count={chatCount}
            />
          </div>
        </div>

        <div>
          <h3 className="text-[10px] uppercase text-zinc-500 font-extrabold tracking-wider mb-3 px-4">
            {t.sidebar.packages}
          </h3>
          <div className="space-y-1">
            {packages.map((pkg, index) => (
              <PackageButton
                key={pkg.id}
                onClick={() => onPackageClick(pkg.slug || pkg.id)}
                icon={PACKAGE_ICONS[index] || Rocket}
                label={pkg.name}
                price={`$${pkg.price}`}
                badge={pkg.is_popular ? 'ХИТ' : undefined}
                highlight={index === packages.length - 1}
              />
            ))}
            <a
              href="https://t.me/kyshkovinsta_bot?start=ai_custom"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Sparkles size={16} className="group-hover:text-acg-yellow transition-colors" /> CUSTOM
              </div>
              <span className="text-xs text-zinc-600">→</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Language Switcher */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 p-2.5 bg-black/40 rounded-xl border border-white/5">
          <Globe size={14} className="text-zinc-500 ml-1" />
          <div className="flex gap-3 text-xs font-bold mx-auto">
            <button
              onClick={() => onLanguageChange('ru')}
              className={`${language === 'ru' ? 'text-acg-yellow' : 'text-zinc-600 hover:text-white'} transition-colors`}
            >
              RU
            </button>
            <span className="text-zinc-800">|</span>
            <button
              onClick={() => onLanguageChange('ua')}
              className={`${language === 'ua' ? 'text-acg-yellow' : 'text-zinc-600 hover:text-white'} transition-colors`}
            >
              UA
            </button>
            <span className="text-zinc-800">|</span>
            <button
              onClick={() => onLanguageChange('en')}
              className={`${language === 'en' ? 'text-acg-yellow' : 'text-zinc-600 hover:text-white'} transition-colors`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-white/5 bg-black/20">
        <button
          onClick={onCartOpen}
          className="w-full bg-gradient-to-r from-acg-yellow to-[#FFAA00] text-black font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-between hover:translate-y-[-2px] hover:shadow-[0_4px_20px_rgba(255,210,0,0.25)] transition-all duration-300"
        >
          <span className="flex items-center gap-2.5">
            <ShoppingCart size={20} /> {t.sidebar.cart}
          </span>
          <span className="bg-black text-acg-yellow min-w-[24px] h-6 flex items-center justify-center rounded-full text-xs font-bold">
            {cartCount}
          </span>
        </button>
      </div>
    </aside>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  count: number;
}

function FilterButton({ active, onClick, icon: Icon, label, count }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
        active
          ? 'bg-acg-yellow text-black shadow-[0_0_15px_rgba(255,210,0,0.3)]'
          : 'text-zinc-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={active ? 'text-black' : 'group-hover:text-acg-yellow transition-colors'} />
        {label}
      </div>
      <span className={`text-xs font-bold ${active ? 'opacity-100 bg-black/20 px-2 py-0.5 rounded-md' : 'opacity-40'}`}>
        {count}
      </span>
    </button>
  );
}

interface PackageButtonProps {
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  price: string;
  badge?: string;
  highlight?: boolean;
}

function PackageButton({ onClick, icon: Icon, label, price, badge, highlight }: PackageButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
    >
      <div className="flex items-center gap-3">
        <Icon size={16} className="group-hover:text-acg-yellow transition-colors" /> {label}
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="px-1.5 py-0.5 rounded bg-acg-yellow/20 text-acg-yellow text-[9px] font-bold">
            {badge}
          </span>
        )}
        <span className={`text-xs font-bold ${highlight ? 'text-acg-yellow' : 'text-zinc-500'}`}>
          {price}
        </span>
      </div>
    </button>
  );
}
