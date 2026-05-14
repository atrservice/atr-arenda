// ========================================
// File: src/lib/contacts.ts
// Description: Centralized contacts + Yandex.Metrika helper
// Project: ATR-SPECARENDA
// ========================================

// 🔹 Типы для TypeScript
export type ContactType = 'phone' | 'email' | 'telegram';
export type MetricaGoal = 'phone_click' | 'email_click' | 'telegram_click' | 'form_submit';

// 🔹 Контакты из .env (с дефолтами на случай, если переменная не задана)
export const CONTACTS = {
  phone: {
    raw: process.env.NEXT_PUBLIC_PHONE_RAW || '79262097373',
    formatted: process.env.NEXT_PUBLIC_PHONE_FORMATTED || '+7 (926) 209-73-73',
    link: process.env.NEXT_PUBLIC_PHONE_LINK || 'tel:+79262097373',
  },
  email: {
    address: process.env.NEXT_PUBLIC_EMAIL || 'info@atr-specarenda.ru',
    link: process.env.NEXT_PUBLIC_EMAIL_LINK || 'mailto:info@avtovishki-arenda.ru',
  },
  telegram: {
    username: process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || '@ATR7373',
    link: process.env.NEXT_PUBLIC_TELEGRAM_LINK || 'https://t.me/ATR7373',
  },
  address: process.env.NEXT_PUBLIC_ADDRESS || 'Москва, Ижорская ул., д. 8, стр. 2',
  workingHours: process.env.NEXT_PUBLIC_WORKING_HOURS || 'Пн–Вс: 08:00–22:00',
} as const;

// 🔹 Маппинг: тип контакта → цель в Метрике
const GOAL_MAP: Record<ContactType, MetricaGoal> = {
  phone: 'phone_click',
  email: 'email_click',
  telegram: 'telegram_click',
};

// 🔹 Хелпер для отправки целей в Яндекс.Метрику
export const trackMetricaGoal = (goal: MetricaGoal, params?: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  
  const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  if (!metrikaId || metrikaId === '00000000' || !(window as any).ym) return;
  
  try {
    (window as any).ym(metrikaId, 'reachGoal', goal);
    if (params) {
      (window as any).ym(metrikaId, 'userParams', { goal, ...params });
    }
  } catch (e) {
    // Тихий фолбэк — не ломаем интерфейс
    if (process.env.NODE_ENV === 'development') {
      console.warn('Metrica error:', e);
    }
  }
};

// 🔹 Фабрика обработчиков кликов (удобно для JSX)
export const createContactClickHandler = (type: ContactType, extraParams?: Record<string, any>) => 
  () => trackMetricaGoal(GOAL_MAP[type], extraParams);