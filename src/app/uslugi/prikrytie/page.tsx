// ========================================
// File: src/app/uslugi/prykrytie/page.tsx
// Description: Страница услуги "Машины прикрытия"
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
import { generateProductSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema-org';
import { getRobotsMetadata } from '@/lib/indexing';
import EquipmentCard from '@/components/EquipmentCard';

export const metadata: Metadata = {
  title: `Аренда машин прикрытия в Москве от 18 000₽/смена`,
  description: `🚨 Автомобили дорожного прикрытия ГОСТ Р 50574-2019. ✅ Подача за 2 часа. 📍 ${CONTACTS.address}.`,
  robots: getRobotsMetadata('/uslugi/prikrytie'),
};

export default async function PrikrytiePage() {
  const equipment = await getEquipment('prikrytie');
  const faq = await getFAQ('informational', 'prikrytie');
  
  const aliceAnswer = `Аренда машин дорожного прикрытия (заграждения) в Москве от ООО «АТР-СЕРВИС»: техника ГОСТ Р 50574-2019, подача за 2 часа. ${CONTACTS.address}. ${CONTACTS.workingHours}. от 18 000 ₽/смена.`;

  const productSchema = generateProductSchema({
    name: 'Аренда машины прикрытия',
    description: 'Автомобили дорожного прикрытия (заграждения) по ГОСТ Р 50574-2019',
    price: 18000,
    currency: 'RUB',
    unit: 'смена',
    image: '/images/services/prikrytie.webp',
    url: 'https://avtovishki-arenda.ru/uslugi/prikrytie',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Главная', url: 'https://avtovishki-arenda.ru' },
    { name: 'Услуги', url: 'https://avtovishki-arenda.ru/uslugi' },
    { name: 'Машины прикрытия', url: 'https://avtovishki-arenda.ru/uslugi/prikrytie' },
  ]);

    // ← ДОБАВЛЕНО: FAQPage микроразметка
  const faqSchema = generateFAQSchema(faq);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      <section id="alice-answer" className="sr-only" aria-hidden="true">
        <h1>Машины прикрытия ООО «АТР-СЕРВИС»</h1>
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
            <li className="font-medium text-gray-900">Машины прикрытия</li>
          </ol>
        </div>
      </nav>

      {/* 🔹 Герой-секция — новая палитра: градиент серый+оранжевый */}
      <section className="py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-gradient">Аренда машин прикрытия в Москве и МО</h1>
          <p className="text-lg text-gray-300 mb-6">
            Техника ГОСТ Р 50574-2019, дорожные знаки и технические средства ГОСТ Р 52289-2019. Подача за 2 часа.
          </p>
          <ContactLink 
            type="phone" 
            variant="button"
            className="btn btn-accent text-lg shadow-glow hover:shadow-glow-lg"
            iconSize={24}
          />
        </div>
      </section>

      {/* 🔹 Каталог техники */}
      <section id="catalog" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Доступные автомобили прикрытия</h2>

          {equipment.length > 0 ? (
            /* ✅ Есть техника — показываем ОДНУ сетку карточек */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipment.map((item) => (
                <EquipmentCard key={item.slug} item={item} />
              ))}
            </div>
          ) : (
            /* ✅ Техники нет — заглушка на ВСЮ ширину контейнера */
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <p className="text-gray-600 mb-2">Каталог техники по этому направлению пополняется.</p>
              <p className="text-gray-500 text-sm">
                Позвоните — подберём технику под вашу задачу:{' '}
                <a href={`tel:${CONTACTS.phone.raw}`} className="text-primary-600 font-semibold">
                  {CONTACTS.phone.formatted}
                </a>
              </p>
            </div>
          )}
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
            Позвоните прямо сейчас — менеджер подберёт машину прикрытия под вашу задачу
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