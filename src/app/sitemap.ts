// ========================================
// File: src/app/sitemap.ts
// Description: Динамический sitemap с учётом флагов индексации
// Project: ООО «АТР-СЕРВИС»
// ========================================

import { MetadataRoute } from 'next';
import { getServices, getEquipment } from '@/lib/data';
import { shouldIndexPage } from '@/lib/indexing';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://avtovishki-arenda.ru';

// 🔹 Статические страницы (явно перечисляем)
const STATIC_PATHS = [
  '/',
  '/uslugi',
  '/kontakty',
  '/faq',
  '/policy',
  '/terms',
  '/rekvizity',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getServices();
  const equipment = await getEquipment();
  
  // Вспомогательная функция для создания записи sitemap
  const createEntry = (path: string, priority: number, changeFreq: 'daily' | 'weekly' | 'monthly' = 'weekly'): MetadataRoute.Sitemap[0] | null => {
    // Если страница не должна индексироваться — пропускаем
    if (!shouldIndexPage(path)) {
      return null;
    }
    
    return {
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: changeFreq,
      priority,
    };
  };

  // 🔹 Собираем все записи
  const entries: MetadataRoute.Sitemap = [];
  
  // Статические страницы
  for (const path of STATIC_PATHS) {
    const entry = createEntry(path, path === '/' ? 1.0 : 0.8);
    if (entry) entries.push(entry);
  }
  
  // Страницы услуг (из services.json)
  for (const service of services) {
    const path = `/uslugi/${service.slug}`;
    const entry = createEntry(path, 0.9);
    if (entry) entries.push(entry);
  }
  
  // Страницы техники (из equipment.json)
  for (const item of equipment) {
    const path = `/tekhnika/${item.id}`;
    const entry = createEntry(path, 0.8);
    if (entry) entries.push(entry);
  }
  
  return entries;
}