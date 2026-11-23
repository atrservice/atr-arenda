// ========================================
// File: src/app/robots.ts
// Description: robots.txt — без блокировки статики и sitemap (D-033)
// ========================================

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: [
      'https://avtovishki-arenda.ru/sitemap.xml',
      'https://avtovishki-arenda.ru/sitemap-cities.xml',
    ],
  };
}