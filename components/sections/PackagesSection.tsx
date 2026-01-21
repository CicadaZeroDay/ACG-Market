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

interface PackagesSectionProps {
  packages: Package[];
  onAddPackage: (pkg: Package) => void;
  t: typeof translations.ru;
}

// Иконки и стили для разных уровней пакетов
const PACKAGE_STYLES = {
  0: { // Смарт (дешёвый)
    icon: Rocket,
    cardClass: 'card-gold',
    iconClass: 'text-acg-yellow/60',
    labelClass: 'text-acg-yellow/50',
    nameClass: 'text-white',
    priceClass: 'text-white',
    buttonClass: 'bg-zinc-800 text-white hover:bg-acg-yellow hover:text-black',
    checkClass: 'text-acg-yellow/70',
    textClass: 'text-zinc-400',
  },
  1: { // Профи (средний)
    icon: TrendingUp,
    cardClass: 'card-platinum',
    iconClass: 'text-acg-yellow/70',
    labelClass: 'text-acg-yellow/50',
    nameClass: 'text-white',
    priceClass: 'text-white',
    buttonClass: 'bg-acg-yellow/90 text-black hover:bg-acg-yellow',
    checkClass: 'text-acg-yellow',
    textClass: 'text-zinc-400',
  },
  2: { // VIP (дорогой)
    icon: Crown,
    cardClass: 'card-exclusive',
    iconClass: 'text-acg-yellow',
    labelClass: 'text-acg-yellow/70',
    nameClass: 'text-acg-yellow',
    priceClass: 'text-acg-yellow',
    buttonClass: 'bg-acg-yellow text-black font-bold hover:bg-white hover:shadow-[0_0_30px_rgba(255,210,0,0.3)]',
    checkClass: 'text-acg-yellow',
    textClass: 'text-zinc-300',
  },
};

export function PackagesSection({ packages, onAddPackage, t }: PackagesSectionProps) {
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
        {/* Динамические пакеты из БД */}
        {packages.map((pkg, index) => {
          const style = PACKAGE_STYLES[index as keyof typeof PACKAGE_STYLES] || PACKAGE_STYLES[0];
          const Icon = style.icon;

          return (
            <div
              key={pkg.id}
              id={`package-${pkg.slug || pkg.id}`}
              className={`${style.cardClass} rounded-2xl p-6 animate-fade-in-up relative`}
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              {/* Бейдж для популярного пакета */}
              {pkg.is_popular && (
                <div className="absolute top-4 right-4 bg-acg-yellow/20 text-acg-yellow text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  {t.premiumPackages.platinumBadge}
                </div>
              )}

              {/* VIP бейдж */}
              {index === 2 && (
                <div className="absolute top-4 right-4 bg-acg-yellow text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Crown size={10} /> {t.premiumPackages.exclusiveBadge}
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <Icon className={style.iconClass} size={20} />
                <span className={`text-xs font-bold uppercase tracking-wider ${style.labelClass}`}>
                  {pkg.category === 'ad' ? 'Реклама' : 'Вакансии'}
                </span>
              </div>

              <h3 className={`text-2xl font-black mb-2 ${style.nameClass}`}>{pkg.name}</h3>
              <p className="text-zinc-500 text-sm mb-6 min-h-[40px]">{pkg.description}</p>

              <div className="space-y-3 mb-6">
                <div className={`flex items-center gap-2 text-sm ${style.textClass}`}>
                  <Check size={14} className={style.checkClass} /> {pkg.posts_count} {t.premiumPackages.posts}
                </div>
                {pkg.includes_pin && (
                  <div className={`flex items-center gap-2 text-sm ${style.textClass}`}>
                    <Check size={14} className={style.checkClass} /> {pkg.pin_count} {pkg.pin_count > 1 ? t.premiumPackages.pins : t.premiumPackages.pin}
                  </div>
                )}
                {pkg.bonus_posts > 0 && (
                  <div className={`flex items-center gap-2 text-sm ${style.textClass}`}>
                    <Check size={14} className={style.checkClass} /> +{pkg.bonus_posts} бонус
                  </div>
                )}
                {pkg.discount_percent > 0 && (
                  <div className={`flex items-center gap-2 text-sm ${style.textClass}`}>
                    <Check size={14} className={style.checkClass} /> -{pkg.discount_percent}% скидка
                  </div>
                )}
              </div>

              <div className="mb-6">
                <span className={`text-3xl font-black ${style.priceClass}`}>${pkg.price}</span>
              </div>

              <button
                onClick={() => onAddPackage(pkg)}
                className={`w-full py-3 font-semibold rounded-xl transition-all duration-300 ${style.buttonClass}`}
              >
                {t.premiumPackages.goldButton}
              </button>
            </div>
          );
        })}

        {/* CUSTOM Card - статическая карточка */}
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
