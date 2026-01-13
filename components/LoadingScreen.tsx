'use client';

import React, { useEffect, useState, useRef } from 'react';

interface LoadingScreenProps {
  isDataLoaded?: boolean;
  onLoadingComplete?: () => void;
  minDuration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isDataLoaded = false,
  onLoadingComplete,
  minDuration = 1500
}) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const hasCompleted = useRef(false);

  // Progress bar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95 && !isDataLoaded) return 95; // Pause at 95% until data loads
        if (prev >= 100) return 100;
        const increment = Math.max(1, (100 - prev) / 10);
        return Math.min(isDataLoaded ? 100 : 95, prev + increment);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isDataLoaded]);

  // Minimum duration timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration]);

  // Complete when both conditions are met
  useEffect(() => {
    if (isDataLoaded && minTimeElapsed && !hasCompleted.current) {
      hasCompleted.current = true;
      setProgress(100);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          onLoadingComplete?.();
        }, 500);
      }, 200);
    }
  }, [isDataLoaded, minTimeElapsed, onLoadingComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-acg-yellow/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-acg-yellow/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,210,0,0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,210,0,0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Logo container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated logo */}
        <div className="relative mb-8">
          {/* Glow effect behind logo */}
          <div className="absolute inset-0 blur-2xl bg-acg-yellow/20 animate-pulse scale-150" />

          {/* Main logo */}
          <h1 className="relative font-black text-6xl md:text-7xl tracking-tighter">
            <span
              className="inline-block text-acg-yellow drop-shadow-[0_0_30px_rgba(255,210,0,0.5)] animate-bounce"
              style={{ animationDuration: '1s', animationDelay: '0s' }}
            >
              A
            </span>
            <span
              className="inline-block text-acg-yellow drop-shadow-[0_0_30px_rgba(255,210,0,0.5)] animate-bounce"
              style={{ animationDuration: '1s', animationDelay: '0.1s' }}
            >
              C
            </span>
            <span
              className="inline-block text-acg-yellow drop-shadow-[0_0_30px_rgba(255,210,0,0.5)] animate-bounce"
              style={{ animationDuration: '1s', animationDelay: '0.2s' }}
            >
              G
            </span>
            <span className="text-white ml-3">Market</span>
          </h1>
        </div>

        {/* Loading bar */}
        <div className="w-64 md:w-80 h-1 bg-zinc-800 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-acg-yellow via-yellow-300 to-acg-yellow rounded-full transition-all duration-100 ease-out"
            style={{
              width: `${progress}%`,
              boxShadow: '0 0 20px rgba(255,210,0,0.5)'
            }}
          />
        </div>

        {/* Loading text with dots animation */}
        <div className="flex items-center gap-1 text-zinc-500 text-sm font-medium">
          <span>Загрузка</span>
          <span className="flex gap-0.5">
            <span className="animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0s' }}>.</span>
            <span className="animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.2s' }}>.</span>
            <span className="animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.4s' }}>.</span>
          </span>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 border border-acg-yellow/10 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 border border-acg-yellow/10 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
      </div>

      {/* Bottom tagline */}
      <div className="absolute bottom-8 text-zinc-600 text-xs font-medium tracking-wider uppercase">
        Маркетплейс рекламы в Telegram
      </div>
    </div>
  );
};

export default LoadingScreen;
