'use client';

import React from 'react';
import { Banner } from '@/lib/types';
import { Megaphone, ArrowRight, Rocket, Star } from 'lucide-react';
import { translations } from '@/lib/translations';

type TranslationType = typeof translations.ru;

interface GridBannerProps {
  banner: Banner | undefined;
  t: TranslationType;
}

export const GridBanner: React.FC<GridBannerProps> = ({ banner, t }) => {
  if (!banner) return null;

  return (
    <a
      href={banner.link_url || '#'}
      target={banner.link_target || '_blank'}
      rel="noopener noreferrer"
      className="block h-full"
    >
      <div className="relative h-full group">
        {/* Glow */}
        <div className="absolute -inset-0.5 bg-acg-yellow/20 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300" />

        <div className="relative bg-[#0d0d0d] border-2 border-acg-yellow/40 hover:border-acg-yellow rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full">

          {/* Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-acg-yellow text-black text-[10px] font-bold uppercase tracking-wide rounded-full">
              <Megaphone size={10} />
              {t.banners?.ad || 'Реклама'}
            </span>
          </div>

          {/* Header */}
          <div className="p-5 pb-4 border-b border-acg-yellow/10">
            <div className="w-14 h-14 rounded-xl bg-acg-yellow/10 border border-acg-yellow/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Rocket className="text-acg-yellow" size={28} />
            </div>

            <h3 className="font-bold text-lg text-white leading-tight mb-2 pr-16">
              {banner.title}
            </h3>

            {banner.subtitle && (
              <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                {banner.subtitle}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col justify-center">
            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-acg-yellow fill-acg-yellow" />
                ))}
              </div>
              <span className="text-zinc-500 text-xs">Партнёр ACG</span>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <div className="w-1.5 h-1.5 bg-acg-yellow/60 rounded-full" />
                Проверенное качество
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <div className="w-1.5 h-1.5 bg-acg-yellow/60 rounded-full" />
                Быстрый результат
              </div>
            </div>

            {/* Image */}
            {banner.image_url && (
              <div className="mt-4 rounded-lg overflow-hidden">
                <img
                  src={banner.image_url}
                  alt={banner.title || ''}
                  className="w-full h-24 object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 pt-0 mt-auto">
            {banner.cta_text && (
              <button className="w-full px-4 py-3 bg-acg-yellow hover:bg-white text-black text-sm font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,210,0,0.3)] flex items-center justify-center gap-2 group/btn">
                {banner.cta_text}
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};
