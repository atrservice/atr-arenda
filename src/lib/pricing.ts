// ========================================
// File: src/lib/pricing.ts
// Description: Калькулятор стоимости аренды с учётом расстояния и налогов
// Project: ООО «АТР-СЕРВИС»
// ========================================

import pricingData from '@/data/pricing.json';
import locationsData from '@/data/locations.json';
import { 
  TAX_CONFIG, 
  PriceType, 
  calculatePriceWithTax, 
  formatPrice,
  roundUpToHundreds 
} from './constants';

// 🔹 Типы
export interface PriceCalculation {
  basePrice: number;
  distance: number;
  pricePerKm: number;
  freeZoneKm: number;
  roundTripDistance: number;  // Полный пробег (туда + обратно) или 0 если в бесплатной зоне
  deliveryCost: number;
  totalPrice: number;
  isWithinFreeZone: boolean;
  modelName: string;
  serviceName: string;
  pricesByType: {
    cash: number;
    with_vat: number;
    ip_usn: number;
  };
}

export interface CityInfo {
  slug: string;
  name: string;
  distance_km: number;
  highway: string;
  direction: string;
}

// 🔹 Получить список всех городов
export function getCities(): CityInfo[] {
  return locationsData.cities.map((city: any) => ({
    slug: city.slug,
    name: city.name,
    distance_km: city.distance_km,
    highway: city.highway,
    direction: city.direction,
  }));
}

// 🔹 Получить информацию о конкретном городе
export function getCityBySlug(slug: string): CityInfo | null {
  const city = locationsData.cities.find((c: any) => c.slug === slug);
  if (!city) return null;
  return {
    slug: city.slug,
    name: city.name,
    distance_km: city.distance_km,
    highway: city.highway,
    direction: city.direction,
  };
}

// 🔹 Получить информацию об услуге
export function getServiceBySlug(serviceSlug: string) {
  return pricingData.services.find((s: any) => s.slug === serviceSlug) || null;
}

// 🔹 Получить модель техники
export function getModelBySlug(serviceSlug: string, modelSlug: string) {
  const service = getServiceBySlug(serviceSlug);
  if (!service) return null;
  return service.models.find((m: any) => m.slug === modelSlug) || null;
}

// 🔹 ГЛАВНАЯ ФУНКЦИЯ: Расчёт стоимости с налогами
export function calculatePrice(
  serviceSlug: string,
  modelSlug: string,
  distanceKm: number
): PriceCalculation | null {
  const service = getServiceBySlug(serviceSlug);
  if (!service) return null;

  const model = service.models.find((m: any) => m.slug === modelSlug);
  if (!model) return null;

  const basePrice = model.base_price;
  const freeZoneKm = pricingData.meta.free_zone_km;
  const pricePerKm = service.price_per_km;

  // 🔹 БИЗНЕС-ЛОГИКА: Бесплатная зона = порог
  // Если расстояние <= freeZoneKm (10 км) — доставка бесплатная (roundTrip = 0)
  // Если расстояние > freeZoneKm — оплачивается ПОЛНЫЙ пробег туда и обратно
  const isWithinFreeZone = distanceKm <= freeZoneKm;
  const roundTripDistance = isWithinFreeZone ? 0 : distanceKm * 2;
  const deliveryCost = roundTripDistance * pricePerKm;
  const totalPrice = basePrice + deliveryCost;

  // 🔹 Расчёт цен для разных типов клиентов
  const pricesByType = {
    cash: totalPrice,
    with_vat: calculatePriceWithTax(totalPrice, 'with_vat'),
    ip_usn: calculatePriceWithTax(totalPrice, 'ip_usn'),
  };

  return {
    basePrice,
    distance: distanceKm,
    pricePerKm,
    freeZoneKm,
    roundTripDistance,
    deliveryCost,
    totalPrice,
    isWithinFreeZone,
    modelName: model.name,
    serviceName: service.name,
    pricesByType,
  };
}

// 🔹 Получить минимальную цену для города (самая дешёвая модель)
export function getMinPriceForCity(serviceSlug: string, distanceKm: number): number {
  const service = getServiceBySlug(serviceSlug);
  if (!service) return 0;

  const minModel = service.models.reduce((min: any, model: any) =>
    model.base_price < min.base_price ? model : min
  );

  const result = calculatePrice(serviceSlug, minModel.slug, distanceKm);
  return result?.totalPrice || 0;
}

// 🔹 Получить все модели с ценами для города
export function getAllPricesForCity(serviceSlug: string, distanceKm: number) {
  const service = getServiceBySlug(serviceSlug);
  if (!service) return [];

  return service.models.map((model: any) => {
    const calc = calculatePrice(serviceSlug, model.slug, distanceKm);
    return {
      slug: model.slug,
      name: model.name,
      ...calc,
    };
  });
}

// 🔹 Экспорт констант для использования в компонентах
export { TAX_CONFIG, formatPrice, roundUpToHundreds };
export type { PriceType };