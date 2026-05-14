// ========================================
// File: src/app/uslugi/prykrytie/page.tsx
// Description: Страница услуги "Машины прикрытия"
// Project: ООО «АТР-СЕРВИС»
// ========================================

import { Metadata } from 'next';
import Link from 'next/link';
import { getEquipment, getFAQ } from '@/lib/data';
import { CONTACTS } from '@/lib/contacts';
import ContactLink from '@/components/ContactLink';
import AliceFAQBlock from '@/components/AliceFAQBlock';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/schema-org';

export const metadata: Metadata = {
  title: `Аренда машин прикрытия в Москве от 18 000₽/смена | ООО «АТР-СЕРВИС»`,
  description: `🚨 Автомобили дорожного прикрытия ГОСТ. ✅ Подача за 2 часа. 📍 ${CONTACTS.address}.`,
};

export default async function PrikrytiePage() {
  const equipment = await getEquipment('prikrytie');
  const faq = await getFAQ('informational');
  
  const aliceAnswer = `Аренда машин прикрытия в Москве от ООО «АТР-СЕРВИС»: техника ГОСТ, подача за 2 часа. 📍 ${CONTACTS.address}. ⏰ ${CONTACTS.workingHours}. 💰 от 18 000 ₽/смена.`;

  const productSchema = generateProductSchema({
    name: 'Аренда машины прикрытия',
    description: 'Автомобили дорожного прикрытия по ГОСТ Р 50574',
    price: 18000,
    currency: 'RUB',
    unit: 'смена',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Главная', url: 'https://avtovishki-arenda.ru' },
    { name: 'Услуги', url: 'https://avtovishki-arenda.ru/uslugi' },
    { name: 'Машины прикрытия', url: 'https://avtovishki-arenda.ru/uslugi/prikrytie' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      <section id="alice-answer" className="sr-only" aria-hidden="true">
        <h1>Машины прикрытия ООО «АТР-СЕРВИС»</h1>
        <p>{aliceAnswer}</p>
      </section>

      <nav className="bg-gray-50 py-3 border-b">
        <div className="container mx-auto px-4">
          <ol className="flex gap-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-blue-600">Главная</Link></li>
            <li>/</li>
            <li><Link href="/uslugi" className="hover:text-blue-600">Услуги</Link></li>
            <li>/</li>
            <li className="font-medium">Машины прикрытия</li>
          </ol>
        </div>
      </nav>

      <section className="py-12 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Аренда машин прикрытия в Москве и МО</h1>
          <p className="text-lg text-blue-100 mb-6">Техника ГОСТ Р 50574. Подача за 2 часа.</p>
          <ContactLink type="phone" variant="button" className="btn-accent text-lg" />
        </div>
      </section>

      <section id="catalog" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Доступная техника</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {equipment.map((item) => (
              <article key={item.id} className="bg-white rounded-xl border p-6">
                <div className="text-4xl mb-4">🚨</div>
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <dl className="space-y-1 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between"><dt>Стандарт:</dt><dd>{item.specs.standard}</dd></div>
                  <div className="flex justify-between"><dt>Огни:</dt><dd>{item.specs.lights}</dd></div>
                  <div className="flex justify-between"><dt>Опыт водителя:</dt><dd>{item.specs.driver_experience}</dd></div>
                </dl>
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <span className="text-blue-600 font-bold">{item.pricePerShift.toLocaleString('ru-RU')} ₽</span>
                    <span className="text-xs text-gray-500">/смена</span>
                  </div>
                  <a href="#form" className="text-blue-600">Заказать →</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Частые вопросы</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faq.filter(f => f.aliceOptimized).slice(0, 3).map((item, idx) => (
              <AliceFAQBlock key={idx} question={item.question} answer={item.answer} isAliceOptimized />
            ))}
          </div>
        </div>
      </section>

      <section id="form" className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Готовы заказать?</h2>
          <ContactLink type="phone" className="text-2xl font-bold text-white hover:underline" showIcon={false} />
        </div>
      </section>
    </>
  );
}