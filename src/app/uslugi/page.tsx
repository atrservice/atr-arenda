// ========================================
// File: src/app/uslugi/page.tsx
// Description: Страница со списком всех услуг
// Project: ООО «АТР-СЕРВИС»
// Дизайн: оранжевый + серый/чёрный + белый, градиенты, SVG-иконки
// Тип: Серверный компонент (есть export metadata)
// ========================================

import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';
import ContactLink from '@/components/ContactLink';
import { getServices } from '@/lib/data';
import { CONTACTS } from '@/lib/contacts';
import { getRobotsMetadata } from '@/lib/indexing';

export const metadata: Metadata = {
  title: `Все услуги аренды спецтехники | ООО «АТР-СЕРВИС»`,
  description: `📋 Полный каталог услуг: автовышки, КМУ, автокраны, машины прикрытия. 📍 ${CONTACTS.address}. ⏰ ${CONTACTS.workingHours}.`,
  robots: getRobotsMetadata('/uslugi'),
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      {/* Хлебные крошки */}
      <nav className="bg-gray-50 py-3 border-b">
        <div className="container mx-auto px-4">
          <ol className="flex gap-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-primary-600 transition-colors">Главная</Link></li>
            <li className="text-gray-400">/</li>
            <li className="font-medium text-gray-900">Все услуги</li>
          </ol>
        </div>
      </nav>

      {/* 🔹 Герой-секция — новая палитра: градиент серый+оранжевый */}
      <section className="py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-gradient">Наши услуги</h1>
          <p className="text-lg text-gray-300">
            Аренда спецтехники в Москве и Московской области с подачей за 2 часа
          </p>
        </div>
      </section>

      {/* 🔹 Список услуг — карточки с SVG-иконками вместо эмодзи */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/uslugi/${service.slug}`}
                className="card card-hover block p-0 group"
              >
                {/* 🔹 Иконка услуги — картинка вместо эмодзи */}
                <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden rounded-t-2xl flex items-center justify-center p-6">
                  {service.iconImage ? (
                    // ✅ Картинка: fill + sizes для оптимизации
                    <Image 
                      src={service.iconImage}
                      alt={service.title}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 80px, 120px"
                    />
                  ) : (
                    // 🔹 Фолбэк: если картинки нет — показываем эмодзи (на случай, если иконка не загружена)
                    <div className="text-6xl text-gray-400">
                      {service.icon}
                    </div>
                  )}
                </div>
                
                {/* Контент карточки */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  
                  {/* Теги характеристик */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.slice(0, 2).map((feature, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Цена + стрелка */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block mb-0.5">от</span>
                      <span className="text-2xl font-extrabold text-primary-600">
                        {service.priceFrom.toLocaleString('ru-RU')}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">₽</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-primary-600 font-medium group-hover:translate-x-1 transition-transform">
                      Подробнее
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 CTA — новая палитра: градиент серый+оранжевый, ContactLink с иконкой */}
      <section className="py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gradient">Нужна консультация?</h2>
          <p className="text-gray-300 mb-6">
            Поможем подобрать технику под вашу задачу
          </p>
          <ContactLink 
            type="phone" 
            variant="button"
            className="btn btn-accent text-lg shadow-glow hover:shadow-glow-lg"
            iconSize={24}
          />
        </div>
      </section>
    </>
  );
}