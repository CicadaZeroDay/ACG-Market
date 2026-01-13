'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Channel, Product, Package, Banner, Review } from '@/lib/types';
import { useCart } from '@/hooks/useCart';
import { useFilters } from '@/hooks/useFilters';
import { useLanguage } from '@/hooks/useLanguage';
import { useTelegram } from '@/contexts/TelegramContext';

// Components
import { CartDrawer } from '@/components/CartDrawer';
import { GuaranteesSection } from '@/components/GuaranteesSection';
import { CRMWidget } from '@/components/CRMWidget';
import { HeroBanner } from '@/components/HeroBanner';
import { MidBanner } from '@/components/MidBanner';
import { ReviewsCarousel } from '@/components/ReviewsCarousel';
import { MobileNavBar } from '@/components/MobileNavBar';
import { LoadingScreen } from '@/components/LoadingScreen';

// Section components
import {
  Header,
  Sidebar,
  StatsBar,
  PackagesSection,
  ChannelsGrid
} from '@/components/sections';

interface MarketplacePageProps {
  initialChannels: Channel[];
  initialProducts: Product[];
  initialPackages: Package[];
  initialBanners: Banner[];
  initialReviews: Review[];
}

export function MarketplacePage({
  initialChannels,
  initialProducts,
  initialPackages,
  initialBanners,
  initialReviews
}: MarketplacePageProps) {
  // Use SSR data
  const channels = initialChannels;
  const products = initialProducts;
  const banners = initialBanners;
  const reviews = initialReviews;

  // Banner filtering
  const heroBanners = useMemo(() => banners.filter(b => b.slot === 'hero'), [banners]);
  const midBanner = useMemo(() => banners.find(b => b.slot === 'mid'), [banners]);
  const gridBanner = useMemo(() => banners.find(b => b.slot === 'grid'), [banners]);

  // Language
  const { language, setLanguage, t } = useLanguage();

  // Filters
  const {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    filteredChannels,
    stats
  } = useFilters({ channels, products });

  // Cart
  const {
    cart,
    isCartOpen,
    cartTotal,
    cartCount,
    addToCart,
    buyNow,
    addPackageToCart,
    removeFromCart,
    openCart,
    closeCart,
    setIsCartOpen
  } = useCart({ language });

  // Telegram
  const { isMiniApp, showBackButton, hideBackButton, hapticFeedback, isReady } = useTelegram();

  // Loading screen state
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  // Handle back button in Mini App when cart is open
  useEffect(() => {
    if (isMiniApp && isCartOpen) {
      showBackButton(() => {
        setIsCartOpen(false);
        hapticFeedback('light');
      });
    } else {
      hideBackButton();
    }
  }, [isMiniApp, isCartOpen, showBackButton, hideBackButton, hapticFeedback, setIsCartOpen]);

  // UX: scroll to package
  const scrollToPackage = useCallback((pkgId: string) => {
    const element = document.getElementById(`package-${pkgId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Show loading screen
  if (showLoadingScreen) {
    return (
      <LoadingScreen
        isDataLoaded={true}
        minDuration={1500}
        onLoadingComplete={() => setShowLoadingScreen(false)}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-acg-dark text-white flex font-sans selection:bg-acg-yellow selection:text-black ${isMiniApp ? 'mini-app-mode' : ''}`}>
      {/* Sidebar - Desktop */}
      <Sidebar
        filter={filter}
        onFilterChange={setFilter}
        channelCount={stats.channels}
        chatCount={stats.chats}
        totalCount={channels.length}
        cartCount={cartCount}
        onCartOpen={openCart}
        onPackageClick={scrollToPackage}
        language={language}
        onLanguageChange={setLanguage}
        t={t}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-[280px] flex flex-col min-h-screen bg-[#0a0a0a]">
        {/* Sticky Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          cartCount={cartCount}
          onCartOpen={openCart}
          t={t}
        />

        <div className="p-4 sm:p-8 flex-1 overflow-y-auto custom-scrollbar pb-24 lg:pb-8">
          {/* Mobile Lang Switcher */}
          <div className="lg:hidden mb-6 flex justify-end">
            <div className="flex items-center gap-3 text-sm font-bold bg-[#151515] p-2 rounded-lg border border-white/5 shadow-sm">
              <button
                onClick={() => setLanguage('ru')}
                className={`${language === 'ru' ? 'text-acg-yellow' : 'text-zinc-500'}`}
              >
                RU
              </button>
              <span className="text-zinc-700">|</span>
              <button
                onClick={() => setLanguage('ua')}
                className={`${language === 'ua' ? 'text-acg-yellow' : 'text-zinc-500'}`}
              >
                UA
              </button>
              <span className="text-zinc-700">|</span>
              <button
                onClick={() => setLanguage('en')}
                className={`${language === 'en' ? 'text-acg-yellow' : 'text-zinc-500'}`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Hero Banner Carousel */}
          {heroBanners.length > 0 && <HeroBanner banners={heroBanners} />}

          {/* Stats Bar */}
          <StatsBar stats={stats} t={t} />

          {/* Premium Packages Section */}
          <PackagesSection onAddPackage={addPackageToCart} t={t} />

          {/* Mid Banner */}
          {midBanner && <MidBanner banner={midBanner} />}

          {/* Guarantees Section */}
          <GuaranteesSection t={t} />

          {/* Reviews Carousel */}
          {reviews.length > 0 && <ReviewsCarousel reviews={reviews} t={t} />}

          {/* Channels Grid */}
          <ChannelsGrid
            channels={filteredChannels}
            products={products}
            gridBanner={gridBanner}
            onAddToCart={addToCart}
            onBuyNow={buyNow}
            t={t}
          />
        </div>
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        items={cart}
        onRemove={removeFromCart}
        total={cartTotal}
        t={t}
      />

      {/* CRM Widget - Floating Telegram Button */}
      <CRMWidget t={t} botUsername="kyshkovinsta_bot" hidden={isCartOpen} />

      {/* Mobile Bottom Navigation */}
      <MobileNavBar
        filter={filter}
        onFilterChange={setFilter}
        cartCount={cartCount}
        onCartOpen={openCart}
        onPackagesClick={() => scrollToPackage('gold')}
        t={t}
        hidden={isCartOpen}
      />
    </div>
  );
}
