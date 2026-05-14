// ========================================
// File: src/lib/schema-org.ts
// Description: Schema.org JSON-LD generators for Yandex/Alice SEO
// Project: ATR-SPECARENDA
// Контакты: берутся из .env.local через @/lib/contacts
// ========================================

import { CONTACTS } from '@/lib/contacts';

// 🔹 Organization / LocalBusiness — ВСЕ ДАННЫЕ ИЗ .env
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://avtovishki-arenda.ru/#organization",
  "name": "ООО «АТР-СЕРВИС»",
  "alternateName": "АТР-СЕРВИС",
  "image": "https://avtovishki-arenda.ru/images/logo.png",
  "url": "https://avtovishki-arenda.ru",
  "telephone": CONTACTS.phone.raw, // Только цифры для schema.org
  "priceRange": "₽₽",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": CONTACTS.address,
    "addressLocality": "Москва",
    "postalCode": "125445",
    "addressCountry": "RU"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 55.8833,
    "longitude": 37.5167
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "08:00",
    "closes": "22:00"
  },
  "areaServed": {
    "@type": "AdministrativeArea",
    "name": "Москва и Московская область"
  }
});

// 🔹 Product / Service (для страниц услуг)
export const generateProductSchema = ({
  name,
  description,
  price,
  currency = 'RUB',
  unit = 'смена',
  availability = 'https://schema.org/InStock',
  brand = 'АТР-СЕРВИС',
}: {
  name: string;
  description: string;
  price: number;
  currency?: string;
  unit?: string;
  availability?: string;
  brand?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": name,
  "description": description,
  "brand": {
    "@type": "Brand",
    "name": brand
  },
  "offers": {
    "@type": "Offer",
    "url": "https://avtovishki-arenda.ru",
    "priceCurrency": currency,
    "price": price,
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": price,
      "priceCurrency": currency,
      "unitText": unit
    },
    "availability": availability,
    "seller": {
      "@type": "Organization",
      "name": "ООО «АТР-СЕРВИС»"
    }
  }
});

// 🔹 FAQPage
export const generateFAQSchema = (items: Array<{question: string; answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": items.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
});

// 🔹 BreadcrumbList
export const generateBreadcrumbSchema = (items: Array<{name: string; url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

// 🔹 SpeakableSpecification (для Алисы)
export const generateSpeakableSchema = ({
  url,
  selectors,
}: {
  url: string;
  selectors: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "url": url,
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": selectors
  }
});

// 🔹 HowTo (инструкции по заказу)
export const generateHowToSchema = ({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: Array<{text: string; url?: string}>;
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": name,
  "description": description,
  "step": steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "text": step.text,
    ...(step.url && { url: step.url })
  }))
});

// 🔹 Service (альтернатива Product для услуг)
export const generateServiceSchema = ({
  name,
  description,
  areaServed,
  provider,
}: {
  name: string;
  description: string;
  areaServed: string;
  provider: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": name,
  "description": description,
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 55.8833,
      "longitude": 37.5167
    },
    "geoRadius": "100000" // 100 км от Москвы
  },
  "provider": {
    "@type": "Organization",
    "name": provider
  }
});