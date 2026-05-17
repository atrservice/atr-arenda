// ========================================
// File: src/lib/data.ts
// Description: Data loading utilities with strict TypeScript types + FAQ filtering by service
// Project: ООО «АТР-СЕРВИС»
// ========================================

// 🔹 Строгие типы для оборудования
export type EquipmentType = 'avtovyshka' | 'kmu' | 'avtokran' | 'prikrytie';

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
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
  category: FAQCategory;
  aliceOptimized?: boolean;
  services?: string[];  // ✅ Привязка вопроса к услугам: ['avtovyshki', 'kmu', ...]
}

// 🔹 Тип для услуги
export interface Service {
  slug: string;
  title: string;
  description: string;
  icon: string;
  iconImage?: string;  // ✅ Путь к иконке-картинке
  priceFrom: number;
  features: string[];
  imageUrl?: string;
}

// 🔹 Загрузка услуг
export async function getServices(): Promise<Service[]> {
  const data = await import('@/data/services.json');
  return data.default as Service[];  // ✅ Явное приведение типа
}

// 🔹 Загрузка техники с фильтрацией по типу
export async function getEquipment(type?: EquipmentType): Promise<Equipment[]> {
  const data = await import('@/data/equipment.json');
  const all = data.default as Equipment[];  // ✅ Явное приведение типа
  return type ? all.filter((e) => e.type === type) : all;
}

// 🔹 Загрузка FAQ с фильтрацией по категории И/ИЛИ по услуге
export async function getFAQ(category?: FAQCategory, serviceSlug?: string): Promise<FAQItem[]> {
  const data = await import('@/data/faq.json');
  const all = data.default as FAQItem[];

  return all.filter((item) => {
    // 1. Фильтр по категории (informational / commercial)
    if (category && item.category !== category) return false;

    // 2. Фильтр по услуге
    if (serviceSlug) {
      // Если у вопроса явно указаны услуги → показываем только если наша услуга в списке
      if (item.services && item.services.length > 0) {
        return item.services.includes(serviceSlug);
      }
      // Если services не указаны (пусто или нет поля) → считаем вопрос общим, показываем всегда
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