import React from 'react';
import { Shield, RefreshCcw, Clock, Headphones, Users, ThumbsUp, Award, Zap } from 'lucide-react';
import { translations } from '../translations';

type TranslationType = typeof translations.ru;

interface GuaranteesSectionProps {
  t: TranslationType;
}

export const GuaranteesSection: React.FC<GuaranteesSectionProps> = ({ t }) => {
  const guarantees = [
    {
      icon: RefreshCcw,
      title: t.guarantees?.freeRepublish || 'Бесплатная перепубликация',
      description: t.guarantees?.freeRepublishDesc || 'Если пост не набрал охваты — перепубликуем бесплатно'
    },
    {
      icon: Shield,
      title: t.guarantees?.securePayment || 'Безопасная оплата',
      description: t.guarantees?.securePaymentDesc || 'Stripe, Apple Pay, Google Pay и криптовалюты'
    },
    {
      icon: Zap,
      title: t.guarantees?.fastPublish || 'Быстрая публикация',
      description: t.guarantees?.fastPublishDesc || 'Размещение в течение 24 часов после оплаты'
    },
    {
      icon: Headphones,
      title: t.guarantees?.support247 || 'Поддержка 24/7',
      description: t.guarantees?.support247Desc || 'Всегда на связи в Telegram и по email'
    }
  ];

  const stats = [
    { value: '1000+', label: t.guarantees?.clients || 'Клиентов' },
    { value: '99%', label: t.guarantees?.satisfied || 'Довольных' },
    { value: '24/7', label: t.guarantees?.supportTime || 'Поддержка' },
    { value: '5+', label: t.guarantees?.years || 'Лет опыта' }
  ];

  return (
    <div className="mb-16">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-acg-yellow/10 border border-acg-yellow/20 rounded-full mb-4">
          <Shield className="text-acg-yellow" size={16} />
          <span className="text-acg-yellow text-sm font-bold uppercase tracking-wider">
            {t.guarantees?.badge || 'Гарантии ACG'}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black mb-3">
          {t.guarantees?.title || 'Почему выбирают'} <span className="text-acg-yellow">{t.guarantees?.us || 'нас'}</span>
        </h2>
        <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
          {t.guarantees?.subtitle || 'Прозрачные условия и гарантии для вашего спокойствия'}
        </p>
      </div>

      {/* Guarantees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {guarantees.map((item, index) => (
          <div
            key={index}
            className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-acg-yellow/30 hover:shadow-[0_0_30px_rgba(255,210,0,0.05)] transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-acg-yellow/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-acg-yellow/20 group-hover:scale-110 transition-all duration-300">
              <item.icon className="text-acg-yellow" size={24} />
            </div>
            <h3 className="text-white font-bold mb-2 group-hover:text-acg-yellow transition-colors">
              {item.title}
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Trust Stats */}
      <div className="bg-gradient-to-r from-acg-yellow/5 via-acg-yellow/10 to-acg-yellow/5 border border-acg-yellow/20 rounded-2xl p-6 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-acg-yellow mb-1">
                {stat.value}
              </div>
              <div className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
