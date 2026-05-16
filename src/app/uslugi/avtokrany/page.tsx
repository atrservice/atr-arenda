// ========================================
// File: src/app/uslugi/avtokrany/page.tsx
// Description: Страница услуги "Аренда автокранов"
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
  title: `Аренда автокранов в Москве от 22 000₽/смена | ООО «АТР-СЕРВИС»`,
  description: `🔧 Автокраны 16–50 тонн для строительства и монтажа. ✅ Подача за 2 часа. 📍 ${CONTACTS.address}. ⏰ ${CONTACTS.workingHours}.`,
};

export default async function AvtokranyPage() {
  const equipment = await getEquipment('avtokran');
  const faq = await getFAQ('informational');
  
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

      <nav className="bg-gray-50 py-3 border-b">
        <div className="container mx-auto px-4">
          <ol className="flex gap-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-blue-600">Главная</Link></li>
            <li>/</li>
            <li><Link href="/uslugi" className="hover:text-blue-600">Услуги</Link></li>
            <li>/</li>
            <li className="font-medium">Автокраны</li>
          </ol>
        </div>
      </nav>

      <section className="py-12 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Аренда автокранов в Москве и МО</h1>
          <p className="text-lg text-blue-100 mb-6">Собственный парк 16–50 тонн. Подача за 2 часа.</p>
          <ContactLink type="phone" variant="button" className="btn-accent text-lg" />
        </div>
      </section>

      <section id="catalog" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Доступные автокраны</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((item) => (
              <article key={item.id} className="bg-white rounded-xl border p-6">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <dl className="space-y-1 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between"><dt>Грузоподъёмность:</dt><dd>{item.capacity} кг</dd></div>
                  <div className="flex justify-between"><dt>Вылет стрелы:</dt><dd>{item.boom_length} м</dd></div>
                  <div className="flex justify-between"><dt>Шасси:</dt><dd>{item.specs.chassis}</dd></div>
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