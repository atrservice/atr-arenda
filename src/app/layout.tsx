// ========================================
// File: src/app/layout.tsx
// Project: АТР-СЕРВИС
// Note: Metadata in ASCII for Turbopack compatibility
// ========================================

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateOrganizationSchema } from '@/lib/schema-org';
import { CONTACTS } from '@/lib/contacts';
import ErrorBoundary from '@/components/ErrorBoundary';
import DebugLogger from '@/components/DebugLogger';

const inter = Inter({ 
  subsets: ['cyrillic', 'latin'],
  display: 'swap', // ✅ Критично для CLS и скорости
  variable: '--font-inter'
});

// 🔹 METADATA IN ASCII (temporary for debugging)
// 🔹 Глобальные метаданные для всего сайта (ТОЛЬКО РУССКИЙ + ОДИН БЛОК)
// 🔹 Глобальные метаданные для всего сайта (ТОЛЬКО РУССКИЙ + ОДИН БЛОК)
export const metadata: Metadata = {
  // 🔹 Заголовок: автоматическое добавление "| АТР-СЕРВИС" к title страниц
  title: {
    default: 'Аренда спецтехники в Москве и МО | АТР-СЕРВИС от 12 000₽',
    template: '%s | АТР-СЕРВИС', // ✅ Запятая обязательна!
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

    // 🔹 Viewport для мобильных (ОБЯЗАТЕЛЬНО!)
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },

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
  
  // 🔹 Favicon
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/favicon.png',
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
    <html lang="ru" className={inter.variable}>
      <head>
        <link 
          rel="preload" 
          href="/images/logo.png" 
          as="image" 
          type="image/png"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* 🔹 Цвет адресной строки в мобильных браузерах */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#111827" media="(prefers-color-scheme: dark)" />

                {/* 🔹 ДОБАВЬ ЭТИ ТЕГИ (фолбэк для мессенджеров): */}
        <meta property="og:image" content="https://avtovishki-arenda.ru/images/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:image" content="https://avtovishki-arenda.ru/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="АТР-СЕРВИС — Аренда спецтехники в Москве" />
        <meta name="twitter:description" content="Автовышки, КМУ, автокраны. Подача за 2 часа." />
        
      </head>
      <body className="flex flex-col min-h-screen">
        {/* ✅ Оберни всё содержимое в ErrorBoundary */}
        <ErrorBoundary>
          {/* ✅ Добавь отладчик здесь */}
          {process.env.NODE_ENV === 'development' && <DebugLogger />}
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          
          {/* Yandex.Metrika - replace XXXXXXX with your ID */}
          {process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID && process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID !== '00000000' && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function(m,e,t,r,i,k,a){
                    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                    m[i].l=1*new Date();
                    for(var j=0;j<r.length;j++){
                      try{
                        var g=t.createElement("script"),z=r[j];
                        g.async=1;g.src=z;e.body.appendChild(g);
                      }catch(e){}
                    }
                  })(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
                  ym(${process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || 0},"init",{
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:true
                  });
                `
              }}
            />
          )}
        </ErrorBoundary>
      </body>
    </html>
  );
}