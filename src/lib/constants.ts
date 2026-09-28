// ========================================
// File: src/lib/constants.ts
// Description: Глобальные константы проекта (налоги, коэффициенты)
// Project: ООО «АТР-СЕРВИС»
// ========================================

// 🔹 Налоговые настройки
export const TAX_CONFIG = {
  // НДС 22% (действует с 09.06.2026)
  VAT_RATE: 22,
  VAT_MULTIPLIER: 1.22, // Для расчёта цены с НДС: basePrice * 1.22
  
  // УСН для ИП (упрощённая система налогообложения 8%)
  IP_USN_RATE: 8,
  IP_USN_DIVISOR: 0.92, // Для расчёта цены для ИП: basePrice / 0.92
  
  // Округление цен
  ROUNDING_STEP: 100, // Округление до сотен рублей
} as const;

// 🔹 Типы расчёта цен
export type PriceType = 'cash' | 'with_vat' | 'ip_usn';

// 🔹 Функция округления вверх до ближайшей сотни
export function roundUpToHundreds(price: number): number {
  return Math.ceil(price / TAX_CONFIG.ROUNDING_STEP) * TAX_CONFIG.ROUNDING_STEP;
}

// 🔹 Расчёт цены для разных типов клиентов
export function calculatePriceWithTax(basePrice: number, priceType: PriceType): number {
  switch (priceType) {
    case 'cash':
      return basePrice; // Наличный расчёт — базовая цена
    
    case 'with_vat':
      // С НДС 22%
      return roundUpToHundreds(basePrice * TAX_CONFIG.VAT_MULTIPLIER);
    
    case 'ip_usn':
      // Для ИП на УСН 8%
      return roundUpToHundreds(basePrice / TAX_CONFIG.IP_USN_DIVISOR);
    
    default:
      return basePrice;
  }
}

// 🔹 Форматирование цены
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price);
}

// 🔹 Примеры расчётов (для тестирования)
export const PRICE_EXAMPLES = {
  base_16000: {
    cash: 16000,
    with_vat: calculatePriceWithTax(16000, 'with_vat'), // 19 600₽
    ip_usn: calculatePriceWithTax(16000, 'ip_usn'),     // 17 400₽
  },
  base_20000: {
    cash: 20000,
    with_vat: calculatePriceWithTax(20000, 'with_vat'), // 24 400₽
    ip_usn: calculatePriceWithTax(20000, 'ip_usn'),     // 21 800₽
  },
  base_22000: {
    cash: 22000,
    with_vat: calculatePriceWithTax(22000, 'with_vat'), // 26 900₽
    ip_usn: calculatePriceWithTax(22000, 'ip_usn'),     // 24 000₽
  },
};