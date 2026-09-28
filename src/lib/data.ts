// ========================================
// File: src/lib/data.ts
// Description: Data loading utilities with strict TypeScript types + FAQ filtering by service
// Project: ООО «АТР-СЕРВИС»
// ========================================

// ========================================
// File: src/lib/data.ts
// ========================================

// 🔹 Строгие типы для оборудования (ОБНОВЛЕНО под новую структуру equipment.json)
export interface Equipment {
  slug: string;
  category: string;          // <-- ДОБАВЛЕНО (вместо type)
  name: string;
  brand?: string;
  model?: string;
  height?: number;
  capacity?: number;
  boom_length?: number;
  basePrice?: number;
  pricePerHour?: number;
  pricePerKmOutside?: number;
  description?: string;
  specs?: any;
  features?: string[];
  useCases?: string[];
  mainImage?: string;
  realPhotos?: string[];
  available?: boolean;
  // Поля ниже оставлены для обратной совместимости, если где-то в старом коде они используются
  type?: string;             
  pricePerShift?: number;    
  imageUrl?: string;         
}

// 🔹 Тип для услуги
export interface Service {
  slug: string;
  title: string;
  description: string;
  icon: string;
  iconImage?: string;
  priceFrom: number;
  features: string[];
  imageUrl?: string;
  imageUrlSmall?: string;
}

// 🔹 Строгие типы для FAQ
export type FAQCategory = 'commercial' | 'informational';

export interface FAQItem {
  question: string;
  answer: string;
  category: FAQCategory;
  aliceOptimized?: boolean;
  services?: string[];
}

// 🔹 Загрузка услуг
export async function getServices(): Promise<Service[]> {
  const data = await import('@/data/services.json');
  return data.default as Service[];
}

// 🔹 Загрузка техники с фильтрацией по категории (алиасы в обе стороны)
export async function getEquipment(category?: string): Promise<Equipment[]> {
  const data = await import('@/data/equipment.json');
  const all = ((data.default as any).items ?? []) as Equipment[];
  if (!category) return all;

  // Группы синонимов: единственное/множественное число и вариации
  const groups: string[][] = [
    ['avtovyshki', 'avtovyshka'],
    ['kmu', 'manipulyator'],
    ['avtokrany', 'avtokran'],
    ['prikrytie', 'prikrytiya'],
  ];

  const group = groups.find((g) => g.includes(category));
  const wanted = group ?? [category];
  return all.filter((e) => wanted.includes(e.category));
}

// 🔹 Загрузка FAQ с фильтрацией
export async function getFAQ(category?: FAQCategory, serviceSlug?: string): Promise<FAQItem[]> {
  const data = await import('@/data/faq.json');
  const all = data.default as FAQItem[];

  return all.filter((item) => {
    if (category && item.category !== category) return false;
    if (serviceSlug) {
      if (item.services && item.services.length > 0) {
        return item.services.includes(serviceSlug);
      }
      return true;
    }
    return true;
  });
}

// 🔹 Загрузка информации о компании
export async function getCompanyInfo() {
  const data = await import('@/data/company.json');
  return data.default;
}