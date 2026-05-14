// ========================================
// File: src/lib/data.ts
// Description: Data loading utilities with strict TypeScript types
// Project: ООО «АТР-СЕРВИС»
// ========================================

// 🔹 Строгие типы для оборудования
export type EquipmentType = 'avtovyshka' | 'kmu' | 'avtokran' | 'prikrytie';

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType; // ✅ Узкий тип вместо string
  height?: number;
  capacity?: number;
  boom_length?: number;
  pricePerShift: number;
  specs: {
    platform_size?: string;
    rotation?: string;
    chassis: string;
    permit_moscow?: string;
    max_load?: string;
    boom_reach?: number;
    with_driver?: string;
    jib?: string;
    standard?: string;
    lights?: string;
    signs?: string;
    driver_experience?: string;
  };
  available: boolean;
  imageUrl: string;
}

// 🔹 Строгие типы для FAQ
export type FAQCategory = 'commercial' | 'informational';

export interface FAQItem {
  question: string;
  answer: string;
  category: FAQCategory; // ✅ Узкий тип вместо string
  aliceOptimized?: boolean;
}

// 🔹 Тип для услуги
export interface Service {
  slug: string;
  title: string;
  description: string;
  icon: string;
  priceFrom: number;
  features: string[];
  imageUrl: string;
}

// 🔹 Загрузка услуг
export async function getServices(): Promise<Service[]> {
  const data = await import('@/data/services.json');
  return data.default;
}

// 🔹 Загрузка техники с фильтрацией по типу
export async function getEquipment(type?: EquipmentType): Promise<Equipment[]> {
  const data = await import('@/data/equipment.json');
  const all: Equipment[] = data.default;
  return type ? all.filter((e) => e.type === type) : all;
}

// 🔹 Загрузка FAQ с фильтрацией по категории
export async function getFAQ(category?: FAQCategory): Promise<FAQItem[]> {
  const data = await import('@/data/faq.json');
  const all: FAQItem[] = data.default;
  return category ? all.filter((f) => f.category === category) : all;
}

// 🔹 Загрузка информации о компании
export async function getCompanyInfo() {
  const data = await import('@/data/company.json');
  return data.default;
}