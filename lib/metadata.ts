import { APP_CONFIG } from './constants';

// SEO metadata for Next.js
export const siteMetadata = {
  title: 'ACG Market — Маркетплейс рекламы в Telegram каналах',
  description: 'Размещайте рекламу в топовых Telegram каналах. 50+ проверенных площадок, прозрачные цены, гарантия результата. Пакеты от $99.',
  keywords: 'telegram реклама, купить рекламу telegram, маркетплейс telegram, реклама в каналах, ACG Market, telegram ads, telegram marketing',
  author: 'ACG Market',
  url: APP_CONFIG.domain,
  ogImage: `${APP_CONFIG.domain}/og-image.png`,
  twitterHandle: '@acgmarket',
  locale: 'ru_RU',
};

// Generate page metadata for Next.js
export function generateMetadata(overrides?: Partial<typeof siteMetadata>) {
  const meta = { ...siteMetadata, ...overrides };

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: meta.author }],
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: meta.url,
      siteName: APP_CONFIG.name,
      images: [
        {
          url: meta.ogImage,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
      locale: meta.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [meta.ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: meta.url,
    },
  };
}

// Structured data for SEO
export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: APP_CONFIG.name,
  description: siteMetadata.description,
  url: APP_CONFIG.domain,
  logo: `${APP_CONFIG.domain}/logo.png`,
  sameAs: [`https://t.me/${APP_CONFIG.telegramBot}`],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: `https://t.me/${APP_CONFIG.telegramBot}`,
    availableLanguage: ['Russian', 'Ukrainian', 'English'],
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '50',
    highPrice: '999',
    offerCount: '50+',
  },
};
