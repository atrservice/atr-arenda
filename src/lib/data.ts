// ========================================
// Файл: src/lib/data.ts
// Описание: Загрузка данных из JSON файлов
// Проект: АТР-СПЕЦАРЕНДА
// ========================================

// Типы данных
export interface Service {
  slug: string;
  title: string;
  description: string;
  icon: string;
  priceFrom: number;
  features: string[];
  imageUrl: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'avtovyshka' | 'kmu' | 'avtokran' | 'prikrytie';
  height?: number; // для автовышек
  capacity?: number; // грузоподъемность
  pricePerShift: number;
  specs: Record<string, string>;
  available: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'commercial' | 'informational';
  aliceOptimized?: boolean; // первый абзац - прямой ответ
}

// Загрузка сервисов
export async function getServices(): Promise<Service[]> {
  // В продакшене: fetch('/data/services.json')
  // Для разработки импортируем напрямую
  const data = await import('@/data/services.json');
  return data.default;
}

// Загрузка техники
export async function getEquipment(type?: string): Promise<Equipment[]> {
  const data = await import('@/data/equipment.json');
  const all = data.default;
  return type ? all.filter((e: Equipment) => e.type === type) : all;
}

// Загрузка FAQ
export async function getFAQ(category?: 'commercial' | 'informational'): Promise<FAQItem[]> {
  const data = await import('@/data/faq.json');
  const all = data.default;
  return category ? all.filter((f: FAQItem) => f.category === category) : all;
}

// Загрузка информации о компании
export async function getCompanyInfo() {
  const data = await import('@/data/company.json');
  return data.default;
}

// Кэширование: в Next.js 14 fetch по умолчанию кэширует
// Для динамических данных используйте: fetch(url, { cache: 'no-store' })