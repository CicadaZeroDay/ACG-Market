'use client';

import React from 'react';
import { Mic2, MessageCircle, Users, DollarSign } from 'lucide-react';
import { translations } from '@/lib/translations';

interface Stats {
  channels: number;
  chats: number;
  subs: string | number;
  minPrice: number;
}

interface StatsBarProps {
  stats: Stats;
  t: typeof translations.ru;
}

export function StatsBar({ stats, t }: StatsBarProps) {
  const items = [
    { icon: Mic2, label: t.stats.channels, value: stats.channels },
    { icon: MessageCircle, label: t.stats.chats, value: stats.chats },
    { icon: Users, label: t.stats.subs, value: stats.subs },
    { icon: DollarSign, label: t.stats.minPrice, value: `$${stats.minPrice}` }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {items.map((s, i) => (
        <div
          key={i}
          className="bg-[#111] border border-white/5 rounded-2xl p-5 hover:border-acg-yellow/30 hover:bg-[#151515] transition-all duration-300 group cursor-default"
        >
          <s.icon
            className="text-zinc-600 mb-2 group-hover:text-acg-yellow group-hover:scale-110 transition-all duration-300 origin-left"
            size={24}
          />
          <div className="text-2xl font-black text-white">{s.value}</div>
          <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
