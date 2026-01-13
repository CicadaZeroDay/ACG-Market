import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';

export const viewport: Viewport = {
  themeColor: '#FFD200',
  width: 'device-width',
  initialScale: 1,
};

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ACG Market — Маркетплейс рекламы в Telegram каналах',
  description: 'Размещайте рекламу в топовых Telegram каналах. 50+ проверенных площадок, прозрачные цены, гарантия результата. Пакеты от $99.',
  keywords: 'telegram реклама, купить рекламу telegram, маркетплейс telegram, реклама в каналах, ACG Market, telegram ads, telegram marketing',
  authors: [{ name: 'ACG Market' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://acgm.app/',
    title: 'ACG Market — Маркетплейс рекламы в Telegram',
    description: 'Размещайте рекламу в топовых Telegram каналах. 50+ площадок, от $99.',
    siteName: 'ACG Market',
    locale: 'ru_RU',
    images: [
      {
        url: 'https://acgm.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ACG Market',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ACG Market — Маркетплейс рекламы в Telegram',
    description: 'Размещайте рекламу в топовых Telegram каналах. 50+ площадок, от $99.',
    images: ['https://acgm.app/og-image.png'],
  },
  alternates: {
    canonical: 'https://acgm.app/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <head>
        {/* Telegram Mini App SDK */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ACG Market',
              description: 'Маркетплейс рекламы в Telegram каналах. Размещайте рекламу в 50+ проверенных площадках.',
              url: 'https://acgm.app',
              logo: 'https://acgm.app/logo.png',
              sameAs: ['https://t.me/kyshkovinsta_bot'],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                url: 'https://t.me/kyshkovinsta_bot',
                availableLanguage: ['Russian', 'Ukrainian', 'English'],
              },
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'USD',
                lowPrice: '50',
                highPrice: '999',
                offerCount: '50+',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
