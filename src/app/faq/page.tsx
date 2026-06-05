// ========================================
// File: src/app/faq/page.tsx
// Description: Страница FAQ с микроразметкой FAQPage
// Project: ООО «АТР-СЕРВИС»
// SEO: FAQPage + BreadcrumbList + Speakable для Алисы
// Дизайн: оранжевый + серый/чёрный + белый, градиенты
// ========================================

import { Metadata } from 'next';
import Link from 'next/link';
import { getFAQ } from '@/lib/data';
import { CONTACTS } from '@/lib/contacts';
import { generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema-org';
import { getRobotsMetadata } from '@/lib/indexing';
import FAQAccordion from '@/components/FAQAccordion';
import ContactLink from '@/components/ContactLink';

// 🔹 SEO-метаданные
export const metadata: Metadata = {
  title: 'Частые вопросы об аренде спецтехники | АТР-СЕРВИС',
  description: 'Ответы на популярные вопросы об аренде автовышек, КМУ, автокранов. Цены, сроки подачи, документы, условия работы. Москва и МО.',
  keywords: [
    'аренда спецтехники вопросы',
    'сколько стоит аренда автовышки',
    'как заказать спецтехнику',
    'документы для аренды',
    'АТР-СЕРВИС FAQ',
  ],
  robots: getRobotsMetadata('/faq'),
  openGraph: {
    title: 'Частые вопросы об аренде спецтехники | АТР-СЕРВИС',
    description: 'Ответы на популярные вопросы об аренде автовышек, КМУ, автокранов. Цены, сроки, документы.',
    type: 'website',
    locale: 'ru_RU',
    url: 'https://avtovishki-arenda.ru/faq',
  },
  alternates: {
    canonical: 'https://avtovishki-arenda.ru/faq',
  },
};

export default async function FAQPage() {
  // ✅ ИСПРАВЛЕНО: защита от undefined + fallback на пустой массив
  const allFaq = await getFAQ();
  const faq = Array.isArray(allFaq) ? allFaq : [];
  
  // Микроразметка FAQPage (только если есть данные)
  const faqSchema = generateFAQSchema(
    faq.map(item => ({ question: item.question, answer: item.answer }))
  );
  
  // Хлебные крошки
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Главная', url: 'https://avtovishki-arenda.ru' },
    { name: 'Частые вопросы', url: 'https://avtovishki-arenda.ru/faq' },
  ]);

  // Текст для Алисы (скрытый блок)
  const aliceAnswer = `Часто задаваемые вопросы об аренде спецтехники в компании АТР-СЕРВИС. Минимальный срок аренды — 1 смена (7+1 часов). Подача техники за 2 часа. Работаем с 2009 года. Телефон: ${CONTACTS.phone.formatted}.`;

  return (
    <>
      {/* Микроразметка */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Блок для Алисы */}
      <section id="alice-faq-answer" className="sr-only" aria-hidden="true">
        <h1>Частые вопросы об аренде спецтехники АТР-СЕРВИС</h1>
        <p>{aliceAnswer}</p>
      </section>

      {/* Хлебные крошки */}
      <nav className="bg-gray-50 py-3 border-b" aria-label="Breadcrumb">
        <div className="container mx-auto px-4">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-primary-600 transition-colors">
                Главная
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium" aria-current="page">
              Частые вопросы
            </li>
          </ol>
        </div>
      </nav>

      {/* Герой-секция */}
      <section className="py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Частые вопросы
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Собрали ответы на самые популярные вопросы об аренде спецтехники.
            Не нашли ответ? Позвоните — объясним подробнее.
          </p>
        </div>
      </section>

      {/* FAQ-аккордеон */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {faq.length > 0 ? (
              <FAQAccordion items={faq} />
            ) : (
              <p className="text-center text-gray-500 py-8">
                Раздел находится в разработке. Скоро здесь появятся ответы на ваши вопросы.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CTA-секция */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gradient">
            Остались вопросы?
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Менеджер ответит на любые вопросы и поможет подобрать технику под вашу задачу
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ContactLink
              type="phone"
              variant="button"
              className="btn btn-accent text-lg shadow-glow hover:shadow-glow-lg"
            />
            <Link
              href="/kontakty#form"
              className="btn border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-lg transition-all inline-flex items-center justify-center gap-2"
            >
              Оставить заявку
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}