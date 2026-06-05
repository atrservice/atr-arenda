// ========================================
// File: src/app/layout.tsx
// Project: АТР-СЕРВИС
// Note: Metadata in ASCII for Turbopack compatibility
// ========================================

import type { Metadata, Viewport } from 'next'; 
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
  display: 'swap', // ✅ Критично для CLS и скорости
  variable: '--font-inter'
});

// 🔹 Константа для ID Метрики (используется в noscript)
const METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || '0';

// 🔹 ОТДЕЛЬНЫЙ ЭКСПОРТ: Viewport (ОБЯЗАТЕЛЬНО отдельно от metadata!)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // ✅ Критично для PWA на iPhone (safe-area)
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
};

// 🔹 METADATA IN ASCII (temporary for debugging)
// 🔹 Глобальные метаданные для всего сайта (ТОЛЬКО РУССКИЙ + ОДИН БЛОК)
export const metadata: Metadata = {
  // 🔹 Заголовок: автоматическое добавление "| АТР-СЕРВИС" к title страниц
  title: {
    default: 'Аренда спецтехники в Москве и МО | АТР-СЕРВИС от 12 000₽',
    template: '%s | ООО "АТР-СЕРВИС"', // ✅ Запятая обязательна!
  },
  
  // 🔹 Описание: чистый текст без эмодзи (метаданные не поддерживают иконки)
  description: `Надежная аренда спецтехники в Москве и МО. Адрес: ${CONTACTS.address}. Режим работы: ${CONTACTS.workingHours}. Телефон: ${CONTACTS.phone.formatted}`,
  
  // 🔹 Ключевые слова: только русские, релевантные запросы
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
  
  // 🔹 Авторы (опционально, но полезно для Яндекс)
  authors: [{ name: 'ООО «АТР-СЕРВИС»' }],
  creator: 'ООО «АТР-СЕРВИС»',
  publisher: 'ООО «АТР-СЕРВИС»',
  
  // 🔹 Распознавание контактов браузером
  formatDetection: {
    telephone: true,
    email: false,
    address: true,
  },
  
  // 🔹 НАСТРОЙКА FAVICON (добавь этот блок)
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

  // 🔹 PWA Manifest
  manifest: '/site.webmanifest',

  // 🔹 Для iOS-веб-приложения
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'АТР-СЕРВИС',
  },
  
  // 🔹 Open Graph (превью в Telegram, WhatsApp, VK, Яндекс)
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://avtovishki-arenda.ru',
    siteName: 'АТР-СЕРВИС',
    title: 'АТР-СЕРВИС — Аренда спецтехники в Москве',
    description: 'Автовышки, КМУ, автокраны, машины прикрытия. Собственный парк. Подача за 2 часа.',
    images: [
      {
        url: 'https://avtovishki-arenda.ru/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'АТР-СЕРВИС — Аренда спецтехники в Москве',
        type: 'image/jpeg', // ✅ Явно указываем тип
      },
    ],
  },
  
  // 🔹 Twitter Cards (опционально, но полезно для единообразия)
  twitter: {
    card: 'summary_large_image',
    title: 'АТР-СЕРВИС — Аренда спецтехники в Москве',
    description: 'Автовышки, КМУ, автокраны. Подача за 2 часа.',
    images: ['https://avtovishki-arenda.ru/images/og-image.jpg'], // ✅ Абсолютный URL!
  },
  
  // 🔹 Индексация: разрешаем всем поисковикам
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
  
  // 🔹 Верификация для Яндекс.Вебмастера
  verification: {
    yandex: 'c6b99895f256d350',
  },
  
  // 🔹 Канонический URL (защита от дублей)
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
        
        {/* 🔹 Статические meta-теги для мессенджеров (фолбэк) */}
        <meta property="og:image" content="https://avtovishki-arenda.ru/images/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:image" content="https://avtovishki-arenda.ru/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* 🔹 Preconnect к внешним доменам для ускорения загрузки */}
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
      </head>
      
      <body className="flex flex-col min-h-screen">
        <ErrorBoundary>
          {/* ✅ DebugLogger только в разработке */}
          {process.env.NODE_ENV === 'development' && <DebugLogger />}
          
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          
          {/* ✅ Яндекс.Метрика — новый компонент */}
          <YandexMetrika />
          
          {/* ✅ Noscript fallback для Метрики */}
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