// ========================================
// File: src/app/tekhnika/[slug]/page.tsx
// Description: Страница модели техники: свайп-карусель, компактная цена, калькулятор, табы
// Project: ООО «АТР-СЕРВИС»
// ========================================

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEquipmentBySlug, getAllEquipment } from '@/lib/equipment';
import { formatPrice } from '@/lib/pricing';
import SwipeCarousel from '@/components/SwipeCarousel';
import Tabs from '@/components/Tabs';
import PriceCalculator from '@/components/PriceCalculator';
import InfoTip from '@/components/InfoTip';
import { getPageMetadata } from '@/lib/indexing';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const equipment = getAllEquipment();
  return equipment.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getEquipmentBySlug(slug);
  if (!item) return { title: 'Техника не найдена' };

  const pathname = `/tekhnika/${slug}`;
  
  return {
    title: `${item.name} | АТР-СЕРВИС`,
    description: item.description,
    ...getPageMetadata(pathname),
  };
}

export default async function EquipmentPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getEquipmentBySlug(slug);
  if (!item) notFound();

  const tabs = [
    {
      id: 'specs',
      label: 'Характеристики',
      icon: '📋',
      preview: `${item.name} на базе ${item.chassis}. Высота подъёма ${item.specs.maxHeight} м, грузоподъёмность люльки ${item.specs.basketCapacity} кг. Поворот платформы на ${item.specs.rotationAngle}°.`,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SpecRow label="Максимальная высота" value={`${item.specs.maxHeight} м`} />
          <SpecRow label="Максимальный вылет" value={`${item.specs.maxReach} м`} />
          <SpecRow label="Грузоподъёмность люльки" value={`${item.specs.basketCapacity} кг`} />
          <SpecRow label="Размер люльки" value={item.specs.basketSize} />
          <SpecRow label="Угол поворота" value={`${item.specs.rotationAngle}°`} />
          <SpecRow label="Шасси" value={item.specs.chassis} />
          <SpecRow label="Двигатель" value={item.specs.engine} />
          <SpecRow label="Масса" value={`${(item.specs.weight / 1000).toFixed(1)} т`} />
        </div>
      ),
    },
    {
      id: 'advantages',
      label: 'Преимущества',
      icon: '✨',
      preview: 'Аттестованные машинисты, все допуски Ростехнадзора, страховка ОСАГО и КАСКО. Подача за 2 часа, работаем без выходных с 08:00 до 22:00.',
      content: (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {item.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="text-primary-500 text-xl flex-shrink-0">✓</span>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'usecases',
      label: 'Применение',
      icon: '🎯',
      preview: `Используется для ${item.useCases.slice(0, 3).join(', ').toLowerCase()}. Идеально подходит для строительных, монтажных и коммунальных работ.`,
      content: (
        <div className="flex flex-wrap gap-2">
          {item.useCases.map((useCase) => (
            <span
              key={useCase}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-primary-500 hover:text-primary-700 transition-colors"
            >
              {useCase}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Хлебные крошки */}
      <nav className="bg-gray-50 py-3 border-b mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          <li><Link href="/" className="hover:text-primary-600">Главная</Link></li>
          <li className="text-gray-400">/</li>
          <li><Link href="/tekhnika" className="hover:text-primary-600">Техника</Link></li>
          <li className="text-gray-400">/</li>
          <li className="font-medium text-gray-900">{item.name}</li>
        </ol>
      </nav>

      {/* Заголовок */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">{item.name}</h1>
      <p className="text-lg text-gray-600 mb-2">{item.brand} • {item.model} • {item.year} г.</p>
      <p className="text-gray-500 mb-8">{item.description}</p>

      {/* 🔹 1. КАРУСЕЛЬ РЕАЛЬНЫХ ФОТО (свайп, все фото) */}
      {item.realPhotos && item.realPhotos.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-4">📸 Фото техники</h2>
          <SwipeCarousel images={item.realPhotos} alt={item.name} />
        </section>
      )}

      {/* 🔹 2. ЦЕНЫ: всегда в строку, шрифт масштабируется; переработка вместо почасовой */}
      <section className="mb-8 bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm">
        <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2">
          💰 Стоимость аренды — {item.name}
        </h2>
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          <div className="pr-2 sm:pr-3 md:pr-4">
            <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 flex items-center gap-1">
              Смена (7+1 ч)
              <InfoTip text="Цена указана за 7 часов работы техники + 1 час подачи техники, цена при наличном расчёте." label="Что входит в смену" />
            </div>
            <div className="text-sm sm:text-lg md:text-2xl font-extrabold text-primary-600">
              {formatPrice(item.basePrice)} ₽
            </div>
          </div>
          <div className="px-2 sm:px-3 md:px-4">
            <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 flex items-center gap-1">
              Переработка
              <InfoTip text="Цена 1 часа работы техники сверх смены, цена при наличном расчёте." label="Что такое переработка" />
            </div>
            <div className="text-sm sm:text-lg md:text-2xl font-extrabold text-gray-900">
              {formatPrice(item.pricePerHour)} ₽/ч
            </div>
          </div>
          <div className="pl-2 sm:pl-3 md:pl-4">
            <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 flex items-center gap-1">
              Пробег 1 км
              <InfoTip text="Пробег считается как выезд на адрес за МКАД по ближайшему маршруту + переезды между адресами за МКАД (если есть) + возврат на МКАД по ближайшему маршруту, цена при наличном расчёте." label="Как считается пробег" />
            </div>
            <div className="text-sm sm:text-lg md:text-2xl font-extrabold text-gray-900">
              {formatPrice(item.pricePerKmOutside)} ₽/км
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 3. КАЛЬКУЛЯТОР */}
      <section className="mb-8">
        <PriceCalculator 
          defaultService={item.category} 
          defaultModel={item.pricingModelSlug} 
        />
      </section>

      {/* 🔹 4. ТАБЫ */}
      <section className="mb-8">
        <Tabs tabs={tabs} />
      </section>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3 border-b border-gray-100">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}