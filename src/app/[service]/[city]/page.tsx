// ========================================
// File: src/app/[service]/[city]/page.tsx
// Description: pSEO-страница «услуга × город» (SSG, волнами)
// Project: ООО «АТР-СЕРВИС»
// ========================================

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import pricingData from '@/data/pricing.json';
import locationsData from '@/data/locations.json';
import wavesData from '@/data/pseo-waves.json';
import { calculatePrice, formatPrice } from '@/lib/pricing';
import { roundUpToHundreds } from '@/lib/constants';
import { getPageMetadata } from '@/lib/indexing';
import { generateSeoContent, highwayDative, SeoService, SeoCity } from '@/lib/seo-generator';
import { getDeterministic } from '@/lib/content-variations';
import { getEquipment } from '@/lib/data';
import { CONTACTS } from '@/lib/contacts';
import { generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema-org';
import PriceCalculator from '@/components/PriceCalculator';
import AliceFAQBlock from '@/components/AliceFAQBlock';
import ContactLink from '@/components/ContactLink';
import Image from 'next/image';
import InfiniteCardsCarousel from '@/components/InfiniteCardsCarousel';

interface PageProps {
  params: Promise<{ service: string; city: string }>;
}

type AnyService = any;
type AnyCity = any;

const services = (pricingData as AnyService).services as AnyService[];
const cities = (locationsData as AnyCity).cities as AnyCity[];
const enabledCities = new Set<string>([((wavesData as AnyCity).wave1 ?? []) as string[]].flat());

function findData(serviceSlug: string, citySlug: string) {
  const service = services.find((s) => s.slug === serviceSlug) as SeoService | undefined;
  const city = cities.find((c) => c.slug === citySlug) as SeoCity | undefined;
  return { service, city };
}

function minCashPrice(service: AnyService, distanceKm: number): number | null {
  const models: AnyService[] = service?.models ?? [];
  if (models.length > 0) {
    const prices = models.map((m) =>
      roundUpToHundreds(calculatePrice(service.slug, m.slug, distanceKm).totalPrice)
    );
    return Math.min(...prices);
  }
  return typeof service?.priceFrom === 'number' ? service.priceFrom : null;
}

// 🔹 SSG: только разрешённая волна городов
export async function generateStaticParams() {
  const paths: Array<{ service: string; city: string }> = [];
  for (const s of services) {
    for (const c of cities) {
      if (enabledCities.has(c.slug)) paths.push({ service: s.slug, city: c.slug });
    }
  }
  return paths;
}

export const dynamicParams = false; // всё вне волны → 404

// 🔹 Метаданные с вариациями title (детерминированно)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service: serviceSlug, city: citySlug } = await params;
  const { service, city } = findData(serviceSlug, citySlug);
  if (!service || !city || !enabledCities.has(citySlug)) {
    return { title: 'Страница не найдена' };
  }

  const hw = highwayDative(city.highway);
  const price = minCashPrice(service, city.distance_km);
  const priceStr = price ? price.toLocaleString('ru-RU') : '';
  const seed = `${serviceSlug}-${citySlug}`;
  const pathname = `/${serviceSlug}/${citySlug}`;

  const titles = [
    `Аренда ${service.name_genitive} в ${city.name_prepositional} от ${priceStr}₽ | АТР-СЕРВИС`,
    `${service.name_singular} в ${city.name_prepositional} — аренда от ${priceStr}₽/смена`,
    `Заказать ${service.name_singular} в ${city.name_prepositional}: подача за 2 часа | АТР-СЕРВИС`,
  ];

  const description = `Аренда ${service.name_genitive} в ${city.name_prepositional}: подача за 2 часа, ${city.distance_km} км от МКАД по ${hw}. Цена от ${priceStr} ₽/смена, расчёт с НДС и УСН. Телефон ${CONTACTS.phone.formatted}.`;

  return {
    title: getDeterministic(titles, seed),
    description,
    keywords: [
      `аренда ${service.name_genitive} ${city.name}`,
      `${service.name_singular} ${city.name} цена`,
      `заказать ${service.name_singular} в ${city.name_prepositional}`,
    ],
    openGraph: {
      title: getDeterministic(titles, seed),
      description,
      url: `https://avtovishki-arenda.ru${pathname}`,
      locale: 'ru_RU',
      type: 'website',
    },
    ...getPageMetadata(pathname),
  };
}

// 🔹 Страница
export default async function ServiceCityPage({ params }: PageProps) {
  const { service: serviceSlug, city: citySlug } = await params;
  const { service, city } = findData(serviceSlug, citySlug);
  if (!service || !city || !enabledCities.has(citySlug)) notFound();

  const hw = highwayDative(city.highway);
  const minPrice = minCashPrice(service, city.distance_km);
    // 🔹 Честное обещание по радиусу (задел на wave2)
  const deliveryClaim =
    city.distance_km <= 30 ? 'Подача за 2 часа'
    : city.distance_km <= 80 ? 'Подача в день обращения'
    : 'Подача по согласованному графику';
  const deliveryMinutes = city.distance_km <= 120
    ? Math.round((city.distance_km / 40) * 60)
    : null;
  const content = generateSeoContent({ service, city, minPrice, deliveryMinutes });
  const equipment = await getEquipment(serviceSlug);

  // Соседние города (только из волны)
  const nearby = (city.nearby ?? [])
    .map((slug: string) => cities.find((c) => c.slug === slug))
    .filter((c: AnyCity) => c && enabledCities.has(c.slug));

  const faqSchema = generateFAQSchema(content.faq);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Главная', url: 'https://avtovishki-arenda.ru' },
    { name: 'Услуги', url: 'https://avtovishki-arenda.ru/uslugi' },
    { name: service.name, url: `https://avtovishki-arenda.ru/uslugi/${serviceSlug}` },
    { name: city.name, url: `https://avtovishki-arenda.ru/${serviceSlug}/${citySlug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Блок для Алисы */}
      <section id="alice-answer" className="sr-only" aria-hidden="true">
        <p>
          {`Аренда ${service.name_genitive} в ${city.name_prepositional} от ООО «АТР-СЕРВИС»: цена от ${minPrice ? formatPrice(minPrice) : '—'} ₽ за смену, подача ${deliveryMinutes} минут. Телефон ${CONTACTS.phone.formatted}.`}
        </p>
      </section>

      {/* Хлебные крошки */}
      <nav className="bg-gray-50 py-3 border-b" aria-label="Breadcrumb">
        <div className="container mx-auto px-4">
          <ol className="flex gap-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-primary-600">Главная</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/uslugi" className="hover:text-primary-600">Услуги</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href={`/uslugi/${serviceSlug}`} className="hover:text-primary-600">{service.name}</Link></li>
            <li className="text-gray-400">/</li>
            <li className="font-medium text-gray-900">{city.name}</li>
          </ol>
        </div>
      </nav>

      {/* H1 + инфо-карточки (LCP = текст, грузится мгновенно) */}
      <section className="py-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Аренда {service.name_genitive} в {city.name_prepositional}
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            {deliveryClaim} • {city.distance_km} км от МКАД по {hw} • с 2009 года
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs opacity-80 mb-1">Цена от</div>
              <div className="text-xl font-extrabold">{minPrice ? `${formatPrice(minPrice)} ₽` : '—'}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs opacity-80 mb-1">От МКАД</div>
              <div className="text-xl font-extrabold">{deliveryMinutes ? `~${deliveryMinutes} мин` : 'от 1 дня'}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs opacity-80 mb-1">Расстояние</div>
              <div className="text-xl font-extrabold">{city.distance_km} км</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs opacity-80 mb-1">Режим</div>
              <div className="text-xl font-extrabold">08:00–22:00</div>
            </div>
          </div>

          {/* 🔹 Кнопки действий: мобильный + десктоп, 50/50 */}
          <div className="flex gap-3 mt-6">
            <a
              href="#calculator"
              className="btn border-2 border-white/40 text-white hover:bg-white/10 flex-1 justify-center text-base md:text-lg"
            >
              🧮 Калькулятор
            </a>
            <a
              href={CONTACTS.phone.link}
              className="btn btn-accent flex-1 justify-center text-base md:text-lg shadow-glow"
            >
              📞 Заказать
            </a>
          </div>
        </div>
      </section>

                  {/* 🔹 Мини-карусель техники: 3 видимых на мобильном, 5 на десктопе */}
      {equipment.length > 0 && (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Техника в наличии</h2>
            <InfiniteCardsCarousel perCopy={equipment.length} ariaLabel="Техника в наличии">
              {[...equipment, ...equipment, ...equipment].map((item, i) => (
                <div key={`slot-${i}`} className="flex-shrink-0 w-[calc((100%-48px)/3)] md:w-[calc((100%-96px)/5)]">
                  <Link
                    href={`/tekhnika/${item.slug}`}
                    className="block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-primary-300 transition-all h-full"
                  >
                    <div className="relative w-full aspect-[4/3] bg-gray-100">
                      <Image
                        src={item.mainImage || '/images/logo-small.webp'}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 33vw, 20vw"
                        loading="lazy"
                        className="object-contain"
                      />
                    </div>
                    <div className="p-2 text-center">
                      <div className="text-[11px] leading-4 text-gray-600 line-clamp-2">{item.name}</div>
                      <div className="text-sm font-extrabold text-primary-600 whitespace-nowrap">
                        от {formatPrice(item.basePrice ?? 0)} ₽
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </InfiniteCardsCarousel>
          </div>
        </section>
      )}

      {/* Уникальный SEO-текст */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {service.name} в {city.name_prepositional}: условия и цены
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>{content.intro}</p>
            <p>{content.cityBlock}</p>
            <p>{content.priceBlock}</p>
          </div>

          {/* Преимущества */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {content.advantages.map((adv) => (
              <div key={adv.title} className="bg-gray-50 p-5 rounded-2xl">
                <div className="text-2xl mb-2">{adv.icon}</div>
                <h3 className="font-bold mb-1 text-gray-900">{adv.title}</h3>
                <p className="text-sm text-gray-600">{adv.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Калькулятор с предустановленным городом */}
      <section id="calculator" className="py-12 bg-gradient-to-br from-gray-50 to-gray-100 scroll-mt-24">
        <div className="container mx-auto px-4">
          <PriceCalculator defaultService={serviceSlug} defaultCity={citySlug} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
            Частые вопросы про аренду в {city.name_prepositional}
          </h2>
          <div className="space-y-4">
            {content.faq.map((item, idx) => (
              <AliceFAQBlock key={idx} question={item.question} answer={item.answer} isAliceOptimized={idx === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Перелинковка с соседними городами */}
      {nearby.length > 0 && (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-lg font-bold mb-3 text-gray-900">
              Также работаем рядом с г. {city.name}:
            </h2>
            <div className="flex flex-wrap gap-2">
              {nearby.map((c: AnyCity) => (
                <Link
                  key={c.slug}
                  href={`/${serviceSlug}/${c.slug}`}
                  className="text-primary-600 hover:text-primary-700 text-sm underline underline-offset-4"
                >
                  {service.name} в {c.name_prepositional}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gradient">{content.cta}</h2>
          <p className="text-gray-300 mb-6">
            Подберём технику под задачу и назовём цену до выезда
          </p>
          <ContactLink type="phone" variant="button" className="btn btn-accent text-lg shadow-glow hover:shadow-glow-lg" iconSize={24} />
        </div>
      </section>
    </>
  );
}