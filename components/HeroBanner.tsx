import React, { useState, useEffect, useCallback } from 'react';
import { Banner } from '../types';
import { ChevronLeft, ChevronRight, ArrowRight, Zap, TrendingUp, Gift } from 'lucide-react';

interface HeroBannerProps {
  banners: Banner[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [banners.length, isPaused, goToNext]);

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div className="mb-10 -mx-4 sm:-mx-8 px-4 sm:px-8">
      <div
        className="relative overflow-hidden rounded-none sm:rounded-3xl group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Outer glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-acg-yellow/20 via-acg-yellow/5 to-acg-yellow/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

        <a
          href={currentBanner.link_url || '#'}
          target={currentBanner.link_target || '_blank'}
          rel="noopener noreferrer"
          className="block relative"
        >
          <div className="relative px-6 sm:px-10 md:px-14 py-8 sm:py-10 md:py-12 border-2 border-acg-yellow/40 hover:border-acg-yellow/70 rounded-none sm:rounded-3xl transition-all duration-500 bg-[#0a0a0a]">

            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-acg-yellow/5 via-transparent to-acg-yellow/5 rounded-none sm:rounded-3xl" />

            {/* Decorative lines */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-acg-yellow/30 to-transparent" />
            <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-acg-yellow/30 to-transparent" />

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">

              {/* Icon */}
              <div className="hidden md:flex w-20 h-20 rounded-2xl bg-acg-yellow/10 border border-acg-yellow/30 items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-acg-yellow/20 transition-all duration-300">
                <Zap className="text-acg-yellow" size={40} />
              </div>

              {/* Text */}
              <div className="flex-1 text-center md:text-left">
                {/* Small label */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-acg-yellow/10 border border-acg-yellow/20 rounded-full mb-4">
                  <span className="w-2 h-2 bg-acg-yellow rounded-full animate-pulse" />
                  <span className="text-acg-yellow text-xs font-bold uppercase tracking-wider">
                    Специальное предложение
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
                  {currentBanner.title}
                </h3>

                {/* Subtitle */}
                {currentBanner.subtitle && (
                  <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
                    {currentBanner.subtitle}
                  </p>
                )}
              </div>

              {/* CTA */}
              {currentBanner.cta_text && (
                <div className="flex-shrink-0 mt-2 md:mt-0">
                  <span className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-acg-yellow hover:bg-white text-black text-sm sm:text-base font-black rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,210,0,0.5)] group/btn">
                    {currentBanner.cta_text}
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </div>
              )}
            </div>
          </div>
        </a>

        {/* Navigation */}
        {banners.length > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); goToPrev(); }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/80 hover:bg-acg-yellow text-white hover:text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10 hover:border-acg-yellow"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); goToNext(); }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/80 hover:bg-acg-yellow text-white hover:text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10 hover:border-acg-yellow"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 px-3 py-2 rounded-full backdrop-blur-sm">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-acg-yellow w-6' : 'bg-white/40 hover:bg-white/60 w-2'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
