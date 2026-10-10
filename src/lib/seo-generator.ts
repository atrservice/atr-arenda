// ========================================
// File: src/lib/seo-generator.ts
// Description: Детерминированная генерация уникального текста pSEO-страниц
// Project: ООО «АТР-СЕРВИС»
// ========================================

import { getDeterministic, transitions, priceAdjectives, equipmentAdjectives, ctaVariations } from '@/lib/content-variations';

// 🔹 Склонение названий шоссе/направлений (дательный падеж: по Ленинградскому шоссе)
export function highwayDative(h: string): string {
  let out = h
    .replace(/(\S+)ое\s+/g, '$1ому ')   // Ленинградское → Ленинградскому
    .replace(/(\S+)ая\s+/g, '$1ой ');   // Транссибирская → Транссибирской
  if (out.endsWith('направление')) out = out.replace(/направление$/, 'направлению');
  if (out.endsWith('магистраль')) out = out.replace(/магистраль$/, 'магистрали');
  return out; // «шоссе» не склоняется
}

// 🔹 Прилагательное в винительном женского рода: сертифицированная → сертифицированную
function adjAccusativeFem(a: string): string {
  return a.replace(/ая$/, 'ую').replace(/яя$/, 'юю');
}

export interface SeoService {
  slug: string;
  name: string;
  name_genitive: string;
  name_singular: string;
}

export interface SeoCity {
  slug: string;
  name: string;
  name_prepositional: string;
  name_genitive: string;
  distance_km: number;
  highway: string;
  population: number;
  districts?: string[];
  nearby?: string[];
}

export interface SeoContent {
  intro: string;
  cityBlock: string;
  priceBlock: string;
  advantages: Array<{ icon: string; title: string; text: string }>;
  faq: Array<{ question: string; answer: string }>;
  cta: string;
}

interface GenOptions {
  service: SeoService;
  city: SeoCity;
  minPrice: number | null;
  deliveryMinutes: number | null;
}

export function generateSeoContent({ service, city, minPrice, deliveryMinutes }: GenOptions): SeoContent {
  const hw = highwayDative(city.highway);
  const seed = `${service.slug}-${city.slug}`;
  const priceStr = minPrice ? minPrice.toLocaleString('ru-RU') : '—';
  const adjEq = getDeterministic(equipmentAdjectives, seed + 'eq');
  const adjEqAcc = adjAccusativeFem(adjEq);
  const adjPrice = getDeterministic(priceAdjectives, seed + 'pr');
  const tr1 = getDeterministic(transitions, seed + 't1');
  const tr2 = getDeterministic(transitions, seed + 't2');
  const deliveryStr = deliveryMinutes ? `${deliveryMinutes} минут` : 'в течение дня и более (расстояние уточняет диспетчер)';

  const intros = [
    `Компания «АТР-СЕРВИС» предлагает аренду ${service.name_genitive} в ${city.name_prepositional} с подачей техники в течение 2 часов. Собственный парк, аттестованные машинисты и полный пакет документов — работаем в ${city.name_prepositional} и прилегающих районах Московской области с 2009 года.`,
    `Требуется ${service.name_singular} в ${city.name_prepositional}? «АТР-СЕРВИС» подаст технику за 2 часа: до объекта ${city.distance_km} км от МКАД по ${hw}, стоимость известна до выезда и фиксируется в заявке.`,
    `Аренда ${service.name_genitive} в ${city.name_prepositional} — востребованная услуга для строительных, монтажных и коммунальных работ. «АТР-СЕРВИС» предоставляет ${adjEqAcc} технику с экипажем для объектов по ${hw} и в соседних округах.`,
  ];
  const intro = getDeterministic(intros, seed + 'i');

  const districtsLine = city.districts?.length
    ? ` Работаем во всех районах: ${city.districts.slice(0, 3).join(', ')}.`
    : '';
  const cityBlock = `${city.name} — город с населением около ${Math.round(city.population / 1000)} тыс. человек в ${city.distance_km} км от МКАД по ${hw}. ${tr1} мы учитываем специфику местных дорог, ограничения по высоте и требования администраций к производству работ, поэтому подача занимает в среднем ${deliveryStr} минут.${districtsLine}`;

  const priceBlock = minPrice
    ? `Цена аренды ${service.name_genitive} в ${city.name_prepositional} начинается от ${priceStr} ₽ за смену (7+1 часов) при наличном расчёте. ${tr2} в стоимость включены работа машиниста, топливо и подача; пробег за МКАД тарифицируется отдельно, расчёт для ООО и ИП — в калькуляторе выше.`
    : `Стоимость аренды ${service.name_genitive} в ${city.name_prepositional} рассчитывается индивидуально: воспользуйтесь калькулятором или позвоните — менеджер назовёт цену до выезда техники.`;

  const advantages = [
    { icon: '🚚', title: 'Подача за 2 часа', text: `Техника базируется недалеко от ${city.name_genitive}: средняя подача по ${hw} — ${deliveryMinutes} минут.` },
    { icon: '📄', title: 'Все документы', text: 'Сертификаты Ростехнадзора, аттестованные машинисты, страховка ОСАГО и КАСКО, закрывающие документы для ООО и ИП.' },
    { icon: '💰', title: `${adjPrice[0].toUpperCase() + adjPrice.slice(1)} цена`, text: 'Стоимость фиксируется в заявке до выезда. Никаких скрытых доплат после смены.' },
    { icon: '🔧', title: 'Собственный парк', text: 'Без посредников: техника «АТР-СЕРВИС» проходит ежедневный техосмотр, ремонт — в своём сервисе.' },
  ];

  const faq = [
    {
      question: `Сколько стоит аренда ${service.name_genitive} в ${city.name_prepositional}?`,
      answer: minPrice
        ? `От ${priceStr} ₽ за смену (7 часов работы + 1 час подачи). В цену включены машинист, топливо и подача; пробег за МКАД — по тарифу за километр.`
        : `Цена зависит от модели и точки подачи. Позвоните или рассчитайте в калькуляторе — стоимость известна до выезда.`,
    },
    {
      question: `Как быстро подаёте технику в ${city.name}?`,
      answer: `Среднее время подачи — ${deliveryStr} минут (${city.distance_km} км от МКАД по ${hw}). Заявки принимаем с 08:00 до 22:00 без выходных.`,
    },
    {
      question: 'Работаете ли с юридическими лицами?',
      answer: 'Да: безналичный расчёт с НДС для ООО и без НДС для ИП на УСН, договор, счета и акты. Реквизиты — в разделе «Реквизиты».',
    },
  ];

  return { intro, cityBlock, priceBlock, advantages, faq, cta: getDeterministic(ctaVariations, seed + 'cta') };
}