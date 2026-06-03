// ========================================
// File: src/app/robots.txt/route.ts
// Description: Динамический robots.txt с поддержкой clean-param
// Project: ООО «АТР-СЕРВИС»
// ========================================

import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://avtovishki-arenda.ru';

export async function GET() {
  const robotsTxt = `# Robots.txt для avtovishki-arenda.ru
# Обновлено: ${new Date().toISOString().split('T')[0]}

# ========================================
# Общие правила для всех поисковиков
# ========================================
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /.env
Disallow: /.git
Disallow: /package.json
Disallow: /next.config.*

# ========================================
# Специальные правила для Яндекса
# ========================================
User-agent: Yandex
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /*.json$

# Склейка дублей с UTM-метками и метками трекинга
Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&gclid&fbclid&yclid&_openstat&from&source&position

# ========================================
# Специальные правила для Google
# ========================================
User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /*.json$

# ========================================
# Служебные директивы
# ========================================
Host: ${BASE_URL}
Sitemap: ${BASE_URL}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}