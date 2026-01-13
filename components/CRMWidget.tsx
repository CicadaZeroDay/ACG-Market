import React, { useState } from 'react';
import { MessageCircle, X, Send, ExternalLink } from 'lucide-react';
import { translations } from '../translations';

type TranslationType = typeof translations.ru;

interface CRMWidgetProps {
  t: TranslationType;
  botUsername?: string;
  hidden?: boolean;
}

export const CRMWidget: React.FC<CRMWidgetProps> = ({ t, botUsername = 'kyshkovinsta_bot', hidden = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const telegramUrl = `https://t.me/${botUsername}`;

  return (
    <>
      {/* Floating Button - hidden when cart is open */}
      {!hidden && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-acg-yellow rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(255,210,0,0.4)] hover:shadow-[0_4px_30px_rgba(255,210,0,0.6)] hover:scale-110 transition-all duration-300 animate-glow-pulse group"
          aria-label={t.crm?.buttonTitle || 'Contact us'}
        >
          <MessageCircle className="text-black" size={26} />

          {/* Tooltip */}
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-[#111] text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-white/10 shadow-xl">
            {t.crm?.buttonTitle || 'Написать нам'}
          </span>
        </button>
      )}

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div
            className="bg-[#111] border border-acg-yellow/30 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_60px_rgba(255,210,0,0.15)] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-acg-yellow/20 to-acg-yellow/10 px-6 py-5 border-b border-acg-yellow/20 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-zinc-400" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-acg-yellow rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,210,0,0.3)]">
                  <Send className="text-black" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {t.crm?.modalTitle || 'Свяжитесь с нами'}
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    {t.crm?.modalSubtitle || 'Напишите в Telegram для быстрой консультации'}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-black text-acg-yellow">5</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">мин</div>
                </div>
                <div className="text-center border-x border-white/5">
                  <div className="text-2xl font-black text-acg-yellow">24/7</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">онлайн</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-acg-yellow">RU/EN</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">языки</div>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-acg-yellow hover:bg-[#FFE066] text-black font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,210,0,0.3)] active:scale-95"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.15-.04-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
                Открыть Telegram
                <ExternalLink size={18} className="opacity-70" />
              </a>

              {/* Alternative */}
              <p className="text-center text-zinc-500 text-xs mt-4">
                или напишите на <a href="mailto:support@acgmarket.com" className="text-acg-yellow hover:underline">support@acgmarket.com</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
