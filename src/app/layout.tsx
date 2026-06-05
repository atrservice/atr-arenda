// ========================================
// File: src/app/layout.tsx
// Project: АТР-СЕРВИС
// Note: Metadata in ASCII for Turbopack compatibility
// ========================================

import type { Metadata, Viewport } from 'next'; 
import { Suspense } from 'react'; // ← ДОБАВЛЕНО
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateOrganizationSchema } from '@/lib/schema-org';
import { CONTACTS } from '@/lib/contacts';
import ErrorBoundary from '@/components/ErrorBoundary';
import DebugLogger from '@/components/DebugLogger';
import YandexMetrika from '@/components/YandexMetrika';

const inter = Inter({ 
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
  variable: '--font-inter'
});

// 🔹 Константа для ID Метрики
const METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || '0';

// 🔹 ОТДЕЛЬНЫЙ ЭКСПОРТ: Viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
};

// 🔹 Глобальные метаданные
export const metadata: Metadata = {
  metadataBase: new URL('https://avtovishki-arenda.ru'),

  title: {
    default: 'Аренда спецтехники в Москве и МО | АТР-СЕРВИС от 12 000₽',
    template: '%s | ООО "АТР-СЕРВИС"',
  },
  description: `Надежная аренда спецтехники в Москве и МО. Адрес: ${CONTACTS.address}. Режим работы: ${CONTACTS.workingHours}. Телефон: ${CONTACTS.phone.formatted}`,
  keywords: [
    'аренда спецтехники москва',
    'аренда автовышки',
    'аренда КМУ',
    'аренда автокрана',
    'машины прикрытия ГОСТ',
    'аренда спецтехники недорого',
    'автовышка почасовая москва',
    'АТР-СЕРВИС',
  ],
  generator: 'Next.js',
  authors: [{ name: 'ООО «АТР-СЕРВИС»' }],
  creator: 'ООО «АТР-СЕРВИС»',
  publisher: 'ООО «АТР-СЕРВИС»',
  formatDetection: {
    telephone: true,
    email: false,
    address: true,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-120x120.png', sizes: '120x120', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon.svg', color: '#f97316' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'АТР-СЕРВИС',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://avtovishki-arenda.ru',
    siteName: 'АТР-СЕРВИС',
    title: 'АТР-СЕРВИС — Аренда спецтехники в Москве',
    description: 'Автовышки, КМУ, автокраны, машины прикрытия. Собственный парк. Подача за 2 часа.',
    images: [
      {
        url: 'https://avtovishki-arenda.ru/images/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'АТР-СЕРВИС — Аренда спецтехники в Москве',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'АТР-СЕРВИС — Аренда спецтехники в Москве',
    description: 'Автовышки, КМУ, автокраны. Подача за 2 часа.',
    images: ['https://avtovishki-arenda.ru/images/og-image.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    yandex: 'c6b99895f256d350',
  },
  alternates: {
    canonical: 'https://avtovishki-arenda.ru',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();
  
  return (
    <html lang="ru" className={inter.variable} data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        <meta property="og:image" content="https://avtovishki-arenda.ru/images/og-image.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:image" content="https://avtovishki-arenda.ru/images/og-image.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        {/* 🔹 Preconnect к Яндексу*/}
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />

          {/* ✅ ДОБАВИТЬ PRELOAD ДЛЯ LCP: */}
        <link
          rel="preload"
          as="image"
          href="/images/hero-bg.webp"
          fetchPriority="high"
        />
      </head>
      
      <body className="flex flex-col min-h-screen">
        <ErrorBoundary>
          {process.env.NODE_ENV === 'development' && <DebugLogger />}
          
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          
          {/* ✅ Яндекс.Метрика — обёрнута в Suspense */}
          <Suspense fallback={null}>
            <YandexMetrika />
          </Suspense>
          
          {/* ✅ Noscript fallback */}
          {METRIKA_ID && METRIKA_ID !== '00000000' && (
            <noscript>
              <div>
                <img 
                  src={`https://mc.yandex.ru/watch/${METRIKA_ID}`} 
                  style={{ position: 'absolute', left: '-9999px' }} 
                  alt="" 
                />
              </div>
            </noscript>
          )}
        </ErrorBoundary>
      </body>
    </html>
  );
}
