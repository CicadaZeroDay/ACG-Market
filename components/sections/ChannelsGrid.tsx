'use client';

import React from 'react';
import { LayoutGrid, Search } from 'lucide-react';
import { Channel, Product, Banner } from '@/lib/types';
import { ChannelCard } from '@/components/ChannelCard';
import { GridBanner } from '@/components/GridBanner';
import { translations } from '@/lib/translations';

interface ChannelsGridProps {
  channels: Channel[];
  products: Product[];
  gridBanner?: Banner;
  onAddToCart: (channel: Channel, product: Product, extras: string[], price: number) => void;
  onBuyNow: (channel: Channel, product: Product, extras: string[], price: number) => void;
  t: typeof translations.ru;
}

export function ChannelsGrid({
  channels,
  products,
  gridBanner,
  onAddToCart,
  onBuyNow,
  t
}: ChannelsGridProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-acg-yellow/10 rounded-lg">
          <LayoutGrid className="text-acg-yellow" size={20} />
        </div>
        <h2 className="text-xl font-bold tracking-tight">{t.sidebar.all}</h2>
      </div>

      {channels.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 bg-[#111] rounded-3xl border border-white/5">
          <Search size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">{t.product.notFound}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {channels.map((channel, index) => (
            <React.Fragment key={channel.id}>
              {/* Insert GridBanner at position 4 (5th item) */}
              {index === 4 && gridBanner && <GridBanner banner={gridBanner} t={t} />}
              <ChannelCard
                channel={channel}
                products={products.filter(p => p.channel_id === channel.id)}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                t={t}
              />
            </React.Fragment>
          ))}
          {/* If less than 5 channels, show GridBanner at the end */}
          {channels.length < 5 && channels.length > 0 && gridBanner && (
            <GridBanner banner={gridBanner} t={t} />
          )}
        </div>
      )}
    </div>
  );
}
