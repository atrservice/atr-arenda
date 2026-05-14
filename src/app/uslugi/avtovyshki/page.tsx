// ========================================
// File: src/app/uslugi/avtovyshki/page.tsx
// Description: Страница услуги "Аренда автовышек"
// Project: ATR-SPECARENDA
// Контакты: берутся из .env.local через @/lib/contacts
// ========================================

import { Metadata } from 'next';
import Link from 'next/link';
import { getEquipment, getFAQ } from '@/lib/data';
import { CONTACTS } from '@/lib/contacts';
import ContactLink from '@/components/ContactLink';
import AliceFAQBlock from '@/components/AliceFAQBlock';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/schema-org';

// 🔹 SEO-метаданные с динамическими контактами
export const metadata: Metadata = {
  title: `Аренда автовышек в Москве от 16 000₽/смена | АТР-СЕРВИС`,
  description: `🪜 Автовышки 16–70м для фасадных работ. ✅ Подача за 2 часа. 📍 ${CONTACTS.address}. ⏰ ${CONTACTS.workingHours}.`,
  keywords: ['аренда автовышки москва', 'автовышка 16м', 'АТР-СЕРВИС'],
  openGraph: {
    title: 'Аренда автовышек в Москве | АТР-СЕРВИС',
    description: `Собственный парк автовышек 16–70м. 📍 ${CONTACTS.address}. ⏰ ${CONTACTS.workingHours}.`,
    type: 'website',
    locale: 'ru_RU',
    url: 'https://avtovishki-arenda.ru/uslugi/avtovyshki',
  },
};

export default async function AvtovyshkiPage() {
  const equipment = await getEquipment('avtovyshka');
  const faq = await getFAQ('informational');
  
  // 🔹 Ответ для Алисы — с динамическими контактами
  const aliceAnswer = `Аренда автовышек в Москве от ООО «АТР-СЕРВИС»: техника 16–70м, подача за 2 часа. 📍 ${CONTACTS.address}. ⏰ ${CONTACTS.workingHours}. 💰 от 16 000 ₽/смена. Телефон: ${CONTACTS.phone.formatted}.`;

  const productSchema = generateProductSchema({
    name: 'Аренда автовышки',
    description: 'Автовышки 16–70м для работ на высоте',
    price: 16000,
    currency: 'RUB',
    unit: 'смена',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Главная', url: 'https://avtovishki-arenda.ru' },
    { name: 'Услуги', url: 'https://avtovishki-arenda.ru/uslugi' },
    { name: 'Аренда автовышек', url: 'https://avtovishki-arenda.ru/uslugi/avtovyshki' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      {/* Блок для Алисы */}
      <section id="alice-answer" className="sr-only" aria-hidden="true">
        <h1>Аренда автовышек АТР-СЕРВИС</h1>
        <p>{aliceAnswer}</p>
      </section>

      {/* Хлебные крошки */}
      <nav className="bg-gray-50 py-3 border-b">
        <div className="container mx-auto px-4">
          <ol className="flex gap-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-blue-600">Главная</Link></li>
            <li>/</li>
            <li><Link href="/uslugi" className="hover:text-blue-600">Услуги</Link></li>
            <li>/</li>
            <li className="font-medium">Автовышки</li>
          </ol>
        </div>
      </nav>

      {/* 🔹 Герой-секция с шаблонизированным телефоном */}
      <section className="py-12 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Аренда автовышек в Москве и МО</h1>
          <p className="text-lg text-blue-100 mb-6">Собственный парк 16–70м. Подача за 2 часа.</p>
          <ContactLink 
            type="phone" 
            variant="button"
            className="btn-accent text-lg"
          />
        </div>
      </section>

      {/* Каталог техники */}
      <section id="catalog" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Доступные автовышки</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((item) => (
              <article key={item.id} className="bg-white rounded-xl border p-6">
                <div className="text-4xl mb-4">🪜</div>
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <dl className="space-y-1 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between"><dt>Высота:</dt><dd>{item.height} м</dd></div>
                  <div className="flex justify-between"><dt>Грузоподъёмность:</dt><dd>{item.capacity} кг</dd></div>
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

      {/* FAQ */}
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

      {/* 🔹 CTA-секция с шаблонизированным телефоном */}
      <section id="form" className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Готовы заказать?</h2>
          <ContactLink 
            type="phone" 
            className="text-2xl font-bold text-white hover:underline"
            showIcon={false}
          />
        </div>
      </section>
    </>
  );
}