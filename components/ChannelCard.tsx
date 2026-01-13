'use client';

import React, { useState, useEffect } from 'react';
import { Channel, Product } from '@/lib/types';
import { Users, Check, MessageCircle, Mic2, Zap, ShoppingBag } from 'lucide-react';
import { translations } from '@/lib/translations';

type TranslationType = typeof translations.ru;

interface ChannelCardProps {
  channel: Channel;
  products: Product[];
  onAddToCart: (channel: Channel, product: Product, extras: string[], price: number) => void;
  onBuyNow: (channel: Channel, product: Product, extras: string[], price: number) => void;
  t: TranslationType;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ channel, products, onAddToCart, onBuyNow, t }) => {
  // Show main product types: ad, vacancy, resume, offer
  const availableFormats = products.filter(p => ['ad', 'vacancy', 'resume', 'offer'].includes(p.product_type));
  
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  useEffect(() => {
    if (availableFormats.length > 0 && !selectedProductId) {
      setSelectedProductId(availableFormats[0].id);
    }
  }, [availableFormats, selectedProductId]);

  if (availableFormats.length === 0) return null;

  const currentProduct = availableFormats.find(p => p.id === selectedProductId) || availableFormats[0];

  const handleFormatSelect = (id: string) => {
    setSelectedProductId(id);
  };

  const toggleExtra = (extra: string) => {
    if (extra.startsWith('pin')) {
      const isSelected = selectedExtras.includes(extra);
      const newExtras = selectedExtras.filter(e => !e.startsWith('pin'));
      if (!isSelected) newExtras.push(extra);
      setSelectedExtras(newExtras);
    } else {
      if (selectedExtras.includes(extra)) {
        setSelectedExtras(selectedExtras.filter(e => e !== extra));
      } else {
        setSelectedExtras([...selectedExtras, extra]);
      }
    }
  };

  // Calculate Price
  const basePrice = currentProduct.base_price;
  let extrasPrice = 0;
  if (selectedExtras.includes('top6')) extrasPrice += currentProduct.top_6h_price;
  if (selectedExtras.includes('pin24')) extrasPrice += currentProduct.pin_24h_price;
  if (selectedExtras.includes('pin48')) extrasPrice += currentProduct.pin_48h_price;
  
  const totalPrice = basePrice + extrasPrice;

  const formatNumber = (num: number | null | undefined) => {
    if (num == null) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return Math.round(num / 1000) + 'K';
    return num.toString();
  };

  const getAvatarStyle = () => {
    if (channel.logo_color) {
      return { backgroundColor: channel.logo_color };
    }
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#f97316', '#06b6d4'];
    return { backgroundColor: colors[channel.id.charCodeAt(0) % colors.length] };
  };

  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-acg-yellow/30 hover:shadow-[0_0_30px_rgba(255,210,0,0.05)] transition-all duration-300 flex flex-col group h-full">
      {/* Header */}
      <div className="p-5 bg-gradient-to-b from-[#161616] to-[#111] border-b border-white/5 flex gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] overflow-hidden"
          style={getAvatarStyle()}
        >
          {channel.logo ? (
            <img src={channel.logo} alt={channel.name} className="w-full h-full object-cover" />
          ) : (
            channel.name.charAt(0)
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="font-bold text-lg text-white truncate leading-tight group-hover:text-acg-yellow transition-colors">{channel.name}</h3>
          <p className="text-zinc-500 text-xs truncate font-medium mb-1.5">{channel.username}</p>
          <div className="flex gap-2">
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${channel.type === 'chat' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
              {channel.type === 'chat' ? <MessageCircle size={10} /> : <Mic2 size={10} />}
              {channel.type === 'chat' ? t.product.chat : t.product.channel}
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px] font-bold">
              <Users size={10} />
              {formatNumber(channel.subscribers)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Format Selector */}
        <div className="mb-6">
          <label className="text-[10px] uppercase text-zinc-500 font-extrabold tracking-widest mb-3 block">{t.product.selectFormat}</label>
          <div className="space-y-2.5">
            {availableFormats.map(f => (
              <div 
                key={f.id}
                onClick={() => handleFormatSelect(f.id)}
                className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 relative overflow-hidden ${selectedProductId === f.id ? 'border-acg-yellow bg-acg-yellow/5 shadow-[0_0_15px_rgba(255,210,0,0.05)]' : 'border-white/5 bg-[#161616] hover:bg-[#1a1a1a] hover:border-zinc-700'}`}
              >
                {selectedProductId === f.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-acg-yellow"></div>}
                <div className="flex items-center gap-3 pl-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${selectedProductId === f.id ? 'border-acg-yellow bg-acg-yellow' : 'border-zinc-600'}`}>
                    {selectedProductId === f.id && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                  </div>
                  <span className={`text-sm font-semibold ${selectedProductId === f.id ? 'text-white' : 'text-zinc-400'}`}>{f.name}</span>
                </div>
                <span className={`font-bold ${selectedProductId === f.id ? 'text-acg-yellow' : 'text-zinc-500'}`}>${f.base_price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Extras */}
        {(currentProduct.top_6h_price > 0 || currentProduct.pin_24h_price > 0) && (
          <div className="mb-6">
             <label className="text-[10px] uppercase text-zinc-500 font-extrabold tracking-widest mb-3 block">+ {t.product.extras}</label>
             <div className="flex flex-wrap gap-2">
               {currentProduct.top_6h_price > 0 && (
                 <button 
                  onClick={() => toggleExtra('top6')}
                  className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all ${selectedExtras.includes('top6') ? 'border-acg-yellow bg-acg-yellow/10 text-acg-yellow' : 'border-white/5 bg-[#161616] text-zinc-400 hover:border-zinc-600'}`}
                 >
                   ⚡ {t.product.top6} <span className="ml-1 opacity-70">+${currentProduct.top_6h_price}</span>
                 </button>
               )}
               {currentProduct.pin_24h_price > 0 && (
                 <button 
                  onClick={() => toggleExtra('pin24')}
                  className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all ${selectedExtras.includes('pin24') ? 'border-acg-yellow bg-acg-yellow/10 text-acg-yellow' : 'border-white/5 bg-[#161616] text-zinc-400 hover:border-zinc-600'}`}
                 >
                   📌 {t.product.pin24} <span className="ml-1 opacity-70">+${currentProduct.pin_24h_price}</span>
                 </button>
               )}
               {currentProduct.pin_48h_price > 0 && (
                 <button 
                  onClick={() => toggleExtra('pin48')}
                  className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all ${selectedExtras.includes('pin48') ? 'border-acg-yellow bg-acg-yellow/10 text-acg-yellow' : 'border-white/5 bg-[#161616] text-zinc-400 hover:border-zinc-600'}`}
                 >
                   📌 {t.product.pin48} <span className="ml-1 opacity-70">+${currentProduct.pin_48h_price}</span>
                 </button>
               )}
             </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-5 bg-[#161616] border-t border-white/5 mt-auto">
        <div className="flex justify-between items-end mb-4">
          <div className="text-[10px] uppercase text-zinc-500 font-extrabold tracking-wider pb-1">{t.product.total}</div>
          <div className="text-3xl font-black text-white">
            ${totalPrice}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onAddToCart(channel, currentProduct, selectedExtras, totalPrice)}
            className="px-4 py-3 border border-zinc-700 hover:border-white text-zinc-300 hover:text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center haptic-tap min-w-[52px]"
            title={t.product.addToCart}
          >
            <ShoppingBag size={18} />
          </button>
          <button
            onClick={() => onBuyNow(channel, currentProduct, selectedExtras, totalPrice)}
            className="flex-1 px-4 py-3 bg-acg-yellow hover:bg-[#FFE066] text-black text-sm font-black rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,210,0,0.25)] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wide haptic-tap"
          >
            {t.product.buy}
          </button>
        </div>
      </div>
    </div>
  );
};