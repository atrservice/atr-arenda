// ========================================
// File: src/app/tekhnika/[slug]/page.tsx
// Description: Страница конкретной модели техники с табами и каруселью
// Project: ООО «АТР-СЕРВИС»
// ========================================

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEquipmentBySlug, getAllEquipment } from '@/lib/equipment';
import { formatPrice } from '@/lib/pricing';
import AutoCarousel from '@/components/AutoCarousel';
import Tabs from '@/components/Tabs';
import PriceCalculator from '@/components/PriceCalculator';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 🔹 Генерация всех путей при сборке (SSG)
export async function generateStaticParams() {
  const equipment = getAllEquipment();
  return equipment.map((item) => ({ slug: item.slug }));
}

// 🔹 Метаданные страницы
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getEquipmentBySlug(slug);

  if (!item) {
    return { title: 'Техника не найдена' };
  }

  return {
    title: `${item.name} | АТР-СЕРВИС`,
    description: item.description,
  };
}

// 🔹 Основной компонент страницы
export default async function EquipmentPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getEquipmentBySlug(slug);

  if (!item) {
    notFound();
  }

  // 🔹 Данные для компонента вкладок (Tabs)
  const tabs = [
    {
      id: 'specs',
      label: 'Характеристики',
      icon: '📋',
      preview: `${item.name} на базе ${item.chassis}. Высота подъёма ${item.specs.maxHeight} м, грузоподъёмность люльки ${item.specs.basketCapacity} кг. Поворот платформы на ${item.specs.rotationAngle}°.`,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {item.category === 'avtovyshki' && (
            <>
              <SpecRow label="Максимальная высота" value={`${item.specs.maxHeight} м`} />
              <SpecRow label="Максимальный вылет" value={`${item.specs.maxReach} м`} />
              <SpecRow label="Грузоподъёмность люльки" value={`${item.specs.basketCapacity} кг`} />
              <SpecRow label="Размер люльки" value={item.specs.basketSize} />
              <SpecRow label="Угол поворота" value={`${item.specs.rotationAngle}°`} />
              <SpecRow label="Шасси" value={item.specs.chassis} />
              <SpecRow label="Двигатель" value={item.specs.engine} />
              <SpecRow label="Масса" value={`${(item.specs.weight / 1000).toFixed(1)} т`} />
            </>
          )}
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
          {item.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
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
          {item.useCases.map((useCase, idx) => (
            <span
              key={idx}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors"
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

      {/* Заголовок и описание */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">{item.name}</h1>
      <p className="text-lg text-gray-600 mb-2">
        {item.brand} • {item.model} • {item.year} г.
      </p>
      <p className="text-gray-500 mb-8">{item.description}</p>

      {/* 🔹 Карусель реальных фото (максимум 3 изображения, ширина 2/3 на десктопе) */}
      {item.realPhotos && item.realPhotos.length > 0 && (
        <section className="mb-8 w-full md:w-2/3 mx-auto">
          <h2 className="text-xl font-bold mb-4 text-center md:text-left">📸 Фото техники</h2>
          <AutoCarousel
            images={item.realPhotos}
            alt={item.name}
            autoPlayInterval={3500}
          />
        </section>
      )}

            {/* 🔹 Калькулятор стоимости */}
      <section className="mb-8">
        <PriceCalculator defaultService={item.category} />
      </section>

      {/* 🔹 Табы: характеристики / преимущества / применение */}
      <section className="mb-8">
        <Tabs tabs={tabs} />
      </section>

      {/* 🔹 Цены (компактный блок) */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 md:p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">💰 Стоимость аренды</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-sm opacity-80 mb-1">За смену (7+1 ч)</div>
            <div className="text-3xl font-extrabold">{formatPrice(item.basePrice)} ₽</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-sm opacity-80 mb-1">Почасовая</div>
            <div className="text-3xl font-extrabold">{formatPrice(item.pricePerHour)} ₽/ч</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-sm opacity-80 mb-1">За МКАД</div>
            <div className="text-3xl font-extrabold">{formatPrice(item.pricePerKmOutside)} ₽/км</div>
          </div>
        </div>
      </section>
    </div>
  );
}

// 🔹 Вспомогательный компонент для строки характеристик
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3 border-b border-gray-100">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}