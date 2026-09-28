// ========================================
// File: src/lib/equipment.ts
// Description: Загрузка данных о технике
// Project: ООО «АТР-СЕРВИС»
// ========================================

import equipmentData from '@/data/equipment.json';

export interface EquipmentItem {
  slug: string;
  category: string;
  name: string;
  brand: string;
  model: string;
  height: number;
  capacity: number;
  chassis: string;
  chassisType: string; // ✅ Расширено до string
  basket: string;
  basketDescription: string;
  year: number;
  basePrice: number;
  pricePerHour: number;
  pricePerKmOutside: number;
  description: string;
  specs: {
    maxHeight: number;
    maxReach: number;
    basketCapacity: number;
    basketSize: string;
    rotationAngle: number;
    chassis: string;
    engine: string;
    weight: number;
  };
  features: string[];
  useCases: string[];
  mainImage: string;
  realPhotos: string[];
  available: boolean;
}

export interface EquipmentData {
  meta: {
    version: string;
    updated: string;
    note: string;
  };
  items: EquipmentItem[];
}

// 🔹 Получить всю технику
export function getAllEquipment(): EquipmentItem[] {
  return equipmentData.items as EquipmentItem[];
}

// 🔹 Получить технику по slug
export function getEquipmentBySlug(slug: string): EquipmentItem | null {
  return equipmentData.items.find((item) => item.slug === slug) || null;
}

// 🔹 Получить технику по категории
export function getEquipmentByCategory(category: string): EquipmentItem[] {
  return equipmentData.items.filter((item) => item.category === category);
}

// 🔹 Получить доступную технику
export function getAvailableEquipment(): EquipmentItem[] {
  return equipmentData.items.filter((item) => item.available);
}

// 🔹 Получить все категории
export function getEquipmentCategories(): string[] {
  return [...new Set(equipmentData.items.map((item) => item.category))];
}