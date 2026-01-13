'use client';

import React from 'react';
import {
  Rocket,
  TrendingUp,
  Crown,
  Sparkles,
  Check,
  MessageSquare
} from 'lucide-react';
import { Package } from '@/lib/types';
import { translations } from '@/lib/translations';

// Package UUIDs - должны совпадать с базой данных
export const PACKAGE_IDS = {
  gold: '64f43509-ee65-463b-ab9a-84e382f4d421',
  platinum: 'f5ac9447-e9b0-48cc-8abf-968b4ae30ecc',
  exclusive: '695c95c4-7a67-478d-bc9b-e69504e087c9'
} as const;

interface PackagesSectionProps {
  onAddPackage: (pkg: Package) => void;
  t: typeof translations.ru;
}

export function PackagesSection({ onAddPackage, t }: PackagesSectionProps) {
  return (
    <div id="packages" className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black mb-3">
          {t.premiumPackages.sectionTitle}{' '}
          <span className="text-acg-yellow">{t.premiumPackages.sectionTitleHighlight}</span>
        </h2>
        <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
          {t.premiumPackages.sectionSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* GOLD Card */}
        <div
          id="package-gold"
          className="card-gold rounded-2xl p-6 animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Rocket className="text-acg-yellow/60" size={20} />
            <span className="text-xs font-bold uppercase tracking-wider text-acg-yellow/50">
              {t.premiumPackages.goldLabel}
            </span>
          </div>
          <h3 className="text-2xl font-black text-white mb-2">GOLD</h3>
          <p className="text-zinc-500 text-sm mb-6 min-h-[40px]">{t.premiumPackages.goldDesc}</p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Check size={14} className="text-acg-yellow/70" /> 5 {t.premiumPackages.posts}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Check size={14} className="text-acg-yellow/70" /> 1 {t.premiumPackages.pin}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Check size={14} className="text-acg-yellow/70" /> {t.premiumPackages.goldAnalytics}
            </div>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-black text-white">$99</span>
          </div>

          <button
            onClick={() =>
              onAddPackage({
                id: PACKAGE_IDS.gold,
                name: 'GOLD',
                slug: 'gold',
                category: 'ad',
                description: t.premiumPackages.goldDesc,
                price: 99,
                posts_count: 5,
                includes_pin: true,
                pin_count: 1,
                bonus_posts: 0,
                discount_percent: 0,
                is_popular: false
              })
            }
            className="w-full py-3 bg-zinc-800 text-white font-semibold rounded-xl hover:bg-acg-yellow hover:text-black transition-all duration-300"
          >
            {t.premiumPackages.goldButton}
          </button>
        </div>

        {/* PLATINUM Card */}
        <div
          id="package-platinum"
          className="card-platinum rounded-2xl p-6 animate-fade-in-up relative"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="absolute top-4 right-4 bg-acg-yellow/20 text-acg-yellow text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {t.premiumPackages.platinumBadge}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-acg-yellow/70" size={20} />
            <span className="text-xs font-bold uppercase tracking-wider text-acg-yellow/50">
              {t.premiumPackages.platinumLabel}
            </span>
          </div>
          <h3 className="text-2xl font-black text-white mb-2">PLATINUM</h3>
          <p className="text-zinc-500 text-sm mb-6 min-h-[40px]">{t.premiumPackages.platinumDesc}</p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Check size={14} className="text-acg-yellow" /> 15 {t.premiumPackages.posts}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Check size={14} className="text-acg-yellow" /> 5 {t.premiumPackages.pins}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Check size={14} className="text-acg-yellow" /> {t.premiumPackages.platinumSupport}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Check size={14} className="text-acg-yellow" /> {t.premiumPackages.platinumAnalytics}
            </div>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-black text-white">$299</span>
          </div>

          <button
            onClick={() =>
              onAddPackage({
                id: PACKAGE_IDS.platinum,
                name: 'PLATINUM',
                slug: 'platinum',
                category: 'ad',
                description: t.premiumPackages.platinumDesc,
                price: 299,
                posts_count: 15,
                includes_pin: true,
                pin_count: 5,
                bonus_posts: 0,
                discount_percent: 0,
                is_popular: true
              })
            }
            className="w-full py-3 bg-acg-yellow/90 text-black font-semibold rounded-xl hover:bg-acg-yellow transition-all duration-300"
          >
            {t.premiumPackages.platinumButton}
          </button>
        </div>

        {/* EXCLUSIVE Card */}
        <div
          id="package-exclusive"
          className="card-exclusive rounded-2xl p-6 animate-fade-in-up relative"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="absolute top-4 right-4 bg-acg-yellow text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
            <Crown size={10} /> {t.premiumPackages.exclusiveBadge}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Crown className="text-acg-yellow" size={20} />
            <span className="text-xs font-bold uppercase tracking-wider text-acg-yellow/70">
              {t.premiumPackages.exclusiveLabel}
            </span>
          </div>
          <h3 className="text-2xl font-black text-acg-yellow mb-2">EXCLUSIVE</h3>
          <p className="text-zinc-500 text-sm mb-6 min-h-[40px]">{t.premiumPackages.exclusiveDesc}</p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Check size={14} className="text-acg-yellow" /> 50 {t.premiumPackages.posts}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Check size={14} className="text-acg-yellow" /> {t.premiumPackages.unlimitedPins}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Check size={14} className="text-acg-yellow" /> {t.premiumPackages.exclusiveManager}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Check size={14} className="text-acg-yellow" /> {t.premiumPackages.exclusivePlatforms}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Check size={14} className="text-acg-yellow" /> {t.premiumPackages.exclusiveGuarantee}
            </div>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-black text-acg-yellow">$999</span>
          </div>

          <button
            onClick={() =>
              onAddPackage({
                id: PACKAGE_IDS.exclusive,
                name: 'EXCLUSIVE',
                slug: 'exclusive',
                category: 'ad',
                description: t.premiumPackages.exclusiveDesc,
                price: 999,
                posts_count: 50,
                includes_pin: true,
                pin_count: 99,
                bonus_posts: 0,
                discount_percent: 0,
                is_popular: false
              })
            }
            className="w-full py-3 bg-acg-yellow text-black font-bold rounded-xl hover:bg-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,210,0,0.3)]"
          >
            {t.premiumPackages.exclusiveButton}
          </button>
        </div>

        {/* CUSTOM Card */}
        <div
          id="package-custom"
          className="card-custom rounded-2xl p-6 animate-fade-in-up relative"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-acg-yellow/70" size={20} />
            <span className="text-xs font-bold uppercase tracking-wider text-acg-yellow/50">
              {t.premiumPackages.customLabel}
            </span>
          </div>
          <h3 className="text-2xl font-black text-white mb-2">CUSTOM</h3>
          <p className="text-zinc-500 text-sm mb-6 min-h-[40px]">{t.premiumPackages.customDesc}</p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Sparkles size={14} className="text-acg-yellow/70" /> {t.premiumPackages.customAnalysis}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Sparkles size={14} className="text-acg-yellow/70" /> {t.premiumPackages.customSelection}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Sparkles size={14} className="text-acg-yellow/70" /> {t.premiumPackages.customBudget}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <MessageSquare size={14} className="text-acg-yellow/70" /> {t.premiumPackages.customConsult}
            </div>
          </div>

          <div className="mb-6">
            <span className="text-xl font-bold text-zinc-400">{t.premiumPackages.customPrice}</span>
          </div>

          <div className="space-y-2">
            <a
              href="https://t.me/kyshkovinsta_bot?start=ai_custom"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-zinc-800 text-white font-semibold rounded-xl hover:bg-acg-yellow hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Sparkles size={16} /> {t.premiumPackages.customButtonAI}
            </a>
            <a
              href="https://t.me/kyshkovinsta_bot?start=manager"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 border border-zinc-700 text-zinc-400 font-medium rounded-xl hover:border-acg-yellow hover:text-acg-yellow transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <MessageSquare size={14} /> {t.premiumPackages.customButtonManager}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
