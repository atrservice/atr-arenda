// ========================================
// File: src/app/sitemap.ts
// Description: Автоматическая генерация sitemap.xml для Next.js App Router
// Project: ООО «АТР-СЕРВИС»
// SEO: Помогает Яндексу быстрее индексировать страницы
// ========================================

import { MetadataRoute } from 'next';
import { getServices, getEquipment } from '@/lib/data';

// Базовый URL сайта (берём из .env или используем дефолт)
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://avtovishki-arenda.ru';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Загружаем данные из JSON (в будущем — из БД)
  const services = await getServices();
  const equipment = await getEquipment();
  
  // 🔹 Статические страницы (всегда одинаковые)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/uslugi`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/kontakty`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];
  
  // 🔹 Страницы услуг (из services.json)
  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${BASE_URL}/uslugi/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));
  
  // 🔹 Страницы техники (из equipment.json)
  const equipmentPages: MetadataRoute.Sitemap = equipment.map((item) => ({
    url: `${BASE_URL}/tekhnika/${item.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
  
  // Объединяем все страницы в один массив
  return [...staticPages, ...servicePages, ...equipmentPages];
}