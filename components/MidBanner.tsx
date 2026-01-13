import React, { useState } from 'react';
import { Banner } from '../types';
import { X, ArrowRight, Gift, Sparkles } from 'lucide-react';

interface MidBannerProps {
  banner: Banner | undefined;
  onDismiss?: () => void;
}

export const MidBanner: React.FC<MidBannerProps> = ({ banner, onDismiss }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!banner || isDismissed) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div className="mb-12 animate-fade-in-up">
      <a
        href={banner.link_url || '#'}
        target={banner.link_target || '_blank'}
        rel="noopener noreferrer"
        className="block relative group"
      >
        {/* Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-acg-yellow/20 via-acg-yellow/10 to-acg-yellow/20 rounded-2xl blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-300" />

        <div className="relative px-5 sm:px-8 py-5 sm:py-6 rounded-2xl border border-acg-yellow/30 hover:border-acg-yellow/60 transition-all duration-300 bg-[#0d0d0d]">

          {/* Left accent */}
          <div className="absolute left-0 top-4 bottom-4 w-1 bg-acg-yellow rounded-r-full" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pl-4">

            {/* Icon */}
            <div className="flex w-12 h-12 sm:w-14 sm:h-14 bg-acg-yellow/10 rounded-xl items-center justify-center flex-shrink-0 border border-acg-yellow/20">
              <Gift className="text-acg-yellow" size={24} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-lg sm:text-xl text-white mb-1 leading-tight">
                {banner.title}
              </h4>
              {banner.subtitle && (
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                  {banner.subtitle}
                </p>
              )}
            </div>

            {/* CTA */}
            {banner.cta_text && (
              <div className="flex-shrink-0 w-full sm:w-auto">
                <span className="flex sm:inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-acg-yellow/10 hover:bg-acg-yellow text-acg-yellow hover:text-black text-sm font-bold rounded-lg transition-all duration-300 border border-acg-yellow/30 hover:border-acg-yellow group/btn">
                  {banner.cta_text}
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </div>
            )}
          </div>

          {/* Close */}
          {onDismiss && (
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </a>
    </div>
  );
};
