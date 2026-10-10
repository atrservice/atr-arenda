// ========================================
// File: src/app/tekhnika/page.tsx
// Description: Каталог всей техники
// Project: ООО «АТР-СЕРВИС»
// ========================================

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllEquipment } from '@/lib/equipment';
import { formatPrice } from '@/lib/pricing';
import { getPageMetadata } from '@/lib/indexing';

export const metadata: Metadata = {
  title: 'Парк техники | АТР-СЕРВИС',
  description: 'Автовышки, КМУ, автокраны, машины прикрытия. Собственный парк техники АТР-СЕРВИС.',
  ...getPageMetadata('/tekhnika'),
};

export default function EquipmentPage() {
  const equipment = getAllEquipment();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gradient">
        Парк техники АТР-СЕРВИС
      </h1>

      <p className="text-lg text-gray-600 mb-12 max-w-3xl">
        Собственный парк спецтехники с 2009 года. Вся техника проходит ежедневный техосмотр 
        и имеет действующие сертификаты Ростехнадзора.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((item) => (
          <Link
            key={item.slug}
            href={`/tekhnika/${item.slug}`}
            className="card card-hover block p-0 h-full group"
          >
            {/* Главное изображение */}
            <div className="aspect-video relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-50 to-gray-100">
              <Image
                src={item.mainImage}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Бейдж категории — нижний правый угол */}
              <div className="absolute bottom-3 right-3 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {item.category === 'avtovyshki' && 'Автовышка'}
                  {item.category === 'kmu' && 'КМУ'}
                  {item.category === 'avtokrany' && 'Автокран'}
                  {item.category === 'prikrytie' && 'Прикрытие'}
                </div>
            </div>

            {/* Контент */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {item.brand} • {item.model} • {item.year} г.
              </p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {item.description}
              </p>

              {/* Характеристики */}
              <div className="flex flex-wrap gap-2 mb-4">
                {item.category === 'avtovyshki' && (
                  <>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      📏 {item.height} м
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      ⚖️ {item.capacity} кг
                    </span>
                  </>
                )}
              </div>

              {/* Цена */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 block">от</span>
                  <span className="text-2xl font-extrabold text-primary-600">
                    {formatPrice(item.basePrice)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">₽/смена</span>
                </div>
                <span className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {equipment.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Техника пока не добавлена в каталог.</p>
        </div>
      )}
    </div>
  );
}