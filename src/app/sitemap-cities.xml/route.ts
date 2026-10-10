// ========================================
// File: src/app/sitemap-cities.xml/route.ts
// Description: Sitemap только для pSEO-страниц активной волны
// ========================================

import pricingData from '@/data/pricing.json';
import locationsData from '@/data/locations.json';
import wavesData from '@/data/pseo-waves.json';

export async function GET() {
  const services = (pricingData as any).services as any[];
  const cities = (locationsData as any).cities as any[];
  const enabled = new Set<string>((wavesData as any).wave1 ?? []);

  const urls: string[] = [];
  for (const s of services) {
    for (const c of cities) {
      if (enabled.has(c.slug)) {
        urls.push(`  <url>
    <loc>https://avtovishki-arenda.ru/${s.slug}/${c.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}