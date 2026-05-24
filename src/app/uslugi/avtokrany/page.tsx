// ========================================
// File: src/app/uslugi/avtokrany/page.tsx
// Description: Страница услуги "Аренда автокранов"
// Project: ООО «АТР-СЕРВИС»
// Дизайн: оранжевый + серый/чёрный + белый, градиенты, SVG-иконки
// Тип: Серверный компонент (есть export metadata)
// ========================================

import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';
import { getEquipment, getFAQ } from '@/lib/data';
import { CONTACTS } from '@/lib/contacts';
import ContactLink from '@/components/ContactLink';
import AliceFAQBlock from '@/components/AliceFAQBlock';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/schema-org';
import { getRobotsMetadata } from '@/lib/indexing';

export const metadata: Metadata = {
  title: `Аренда автокранов в Москве от 22 000₽/смена | ООО «АТР-СЕРВИС»`,
  description: `🔧 Автокраны 16–500 тонн для строительства и монтажа. ✅ Подача за 2 часа. 📍 ${CONTACTS.address}. ⏰ ${CONTACTS.workingHours}.`,
  robots: getRobotsMetadata('/uslugi/avtokrany'),
};

export default async function AvtokranyPage() {
  const equipment = await getEquipment('avtokran');
  const faq = await getFAQ('informational', 'avtokrany');
  
  const aliceAnswer = `Аренда автокранов в Москве от ООО «АТР-СЕРВИС»: техника 16–50 тонн, подача за 2 часа. 📍 ${CONTACTS.address}. ⏰ ${CONTACTS.workingHours}. 💰 от 22 000 ₽/смена. Телефон: ${CONTACTS.phone.formatted}.`;

  const productSchema = generateProductSchema({
    name: 'Аренда автокрана',
    description: 'Автокраны 16–50 тонн для строительства и монтажа',
    price: 22000,
    currency: 'RUB',
    unit: 'смена',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Главная', url: 'https://avtovishki-arenda.ru' },
    { name: 'Услуги', url: 'https://avtovishki-arenda.ru/uslugi' },
    { name: 'Аренда автокранов', url: 'https://avtovishki-arenda.ru/uslugi/avtokrany' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      <section id="alice-answer" className="sr-only" aria-hidden="true">
        <h1>Аренда автокранов ООО «АТР-СЕРВИС»</h1>
        <p>{aliceAnswer}</p>
      </section>

      {/* 🔹 Хлебные крошки — новая палитра */}
      <nav className="bg-gray-50 py-3 border-b">
        <div className="container mx-auto px-4">
          <ol className="flex gap-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-primary-600 transition-colors">Главная</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/uslugi" className="hover:text-primary-600 transition-colors">Услуги</Link></li>
            <li className="text-gray-400">/</li>
            <li className="font-medium text-gray-900">Автокраны</li>
          </ol>
        </div>
      </nav>

      {/* 🔹 Герой-секция — новая палитра: градиент серый+оранжевый */}
      <section className="py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-gradient">Аренда автокранов в Москве и МО</h1>
          <p className="text-lg text-gray-300 mb-6">Собственный парк 16–50 тонн. Подача за 2 часа.</p>
          <ContactLink 
            type="phone" 
            variant="button" 
            className="btn btn-accent text-lg shadow-glow hover:shadow-glow-lg"
            iconSize={24}
          />
        </div>
      </section>

      {/* 🔹 Каталог техники — карточки с SVG-иконками */}
      <section id="catalog" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Доступные автокраны</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((item) => (
              <article key={item.id} className="card card-hover p-6">
                
                {/* 🔹 Иконка техники — картинка вместо эмодзи */}
                <div className="w-16 h-16 mb-4 relative">
                  {item.imageUrl ? (
                    <Image 
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  ) : (
                    // Фолбэк на эмодзи, если картинки нет
                    <div className="text-4xl text-gray-400">🔧</div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-gray-900">{item.name}</h3>
                
                <dl className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Грузоподъёмность:</dt>
                    <dd className="font-medium text-gray-900">{item.capacity} кг</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Вылет стрелы:</dt>
                    <dd className="font-medium text-gray-900">{item.boom_length} м</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Шасси:</dt>
                    <dd className="font-medium text-gray-900">{item.specs.chassis}</dd>
                  </div>
                </dl>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">от</span>
                    <span className="text-2xl font-extrabold text-primary-600">
                      {item.pricePerShift.toLocaleString('ru-RU')}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">₽/смена</span>
                  </div>
                  <a 
                    href="#form" 
                    className="inline-flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700 transition-colors"
                  >
                    Заказать
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 FAQ — секция с градиентным фоном */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Частые вопросы</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faq.map((item, idx) => (
              <AliceFAQBlock 
                key={idx} 
                question={item.question} 
                answer={item.answer} 
                isAliceOptimized={item.aliceOptimized || false} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 CTA-секция — новая палитра: градиент серый+оранжевый */}
      <section id="form" className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gradient">Готовы заказать?</h2>
          <p className="text-gray-300 mb-6">
            Позвоните прямо сейчас — менеджер подберёт автокран под вашу задачу
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