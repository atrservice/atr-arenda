// ========================================
// File: src/app/layout.tsx
// Project: ATR-SPECARENDA
// Note: Metadata in ASCII for Turbopack compatibility
// ========================================

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateOrganizationSchema } from '@/lib/schema-org';
import { CONTACTS } from '@/lib/contacts';

const inter = Inter({ 
  subsets: ['cyrillic', 'latin'],
  display: 'swap', // ✅ Критично для CLS и скорости
  variable: '--font-inter'
});

// 🔹 METADATA IN ASCII (temporary for debugging)
export const metadata: Metadata = {
  title: {
    default: 'ATR-SPECARENDA | Special equipment rental in Moscow',
    template: '%s | ATR-SPECARENDA'
  },
  description: `✅ Надежная аренда спецтехники в Москве и МО. 📍 ${CONTACTS.address}. ⏰ ${CONTACTS.workingHours}. 📞 ${CONTACTS.phone.formatted}`,
  keywords: [
    'aerial lift rental moscow',
    'kmu rental',
    'crane rental',
    'road safety vehicle',
    'special equipment',
    'ATR-SPECARENDA'
  ],
  authors: [{ name: 'OOO ATR-SERVICE' }],
  creator: 'OOO ATR-SERVICE',
  publisher: 'OOO ATR-SERVICE',
  formatDetection: {
    telephone: true,
    email: false,
    address: true
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://avtovishki-arenda.ru',
    siteName: 'ATR-SPECARENDA',
    title: 'Special equipment rental in Moscow | ATR-SPECARENDA',
    description: 'Aerial lifts, cranes, manipulators for rent. Delivery in 2 hours.',
    images: [{
      url: 'https://avtovishki-arenda.ru/images/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'ATR-SPECARENDA equipment rental'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATR-SPECARENDA | Equipment rental',
    description: 'Aerial lifts, cranes in Moscow',
    images: ['https://avtovishki-arenda.ru/images/og-image.jpg']
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
      </head>
      <body className="flex flex-col min-h-screen">
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
      </body>
    </html>
  );
}