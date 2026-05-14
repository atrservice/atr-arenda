// ========================================
// File: src/app/robots.ts
// Description: Динамические правила для robots (Next.js App Router)
// Project: ООО «АТР-СЕРВИС»
// ========================================

import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://avtovishki-arenda.ru';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/_next/', '/*?*'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}