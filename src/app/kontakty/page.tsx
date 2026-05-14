// ========================================
// File: src/app/kontakty/page.tsx
// Description: Страница контактов с картой и микроразметкой LocalBusiness
// Project: ATR-SPECARENDA
// SEO: LocalBusiness + GeoCoordinates + OpeningHours для Яндекса/Алисы
// Контакты: берутся из .env.local через @/lib/contacts
// ========================================

import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import ContactLink from '@/components/ContactLink';
import { CONTACTS } from '@/lib/contacts';
import { generateOrganizationSchema, generateSpeakableSchema } from '@/lib/schema-org';

// 🔹 SEO-метаданные с динамическими контактами
export const metadata: Metadata = {
  title: `Контакты АТР-СПЕЦАРЕНДА | ${CONTACTS.address}`,
  description: `📍 ООО «АТР-СПЕЦАРЕНДА»: ${CONTACTS.address}. ⏰ ${CONTACTS.workingHours}. 📞 ${CONTACTS.phone.formatted}. Закажите аренду спецтехники!`,
  keywords: [
    'АТР-СПЕЦАРЕНДА контакты',
    'аренда спецтехники москва адрес',
    'Ижорская 8с2',
    'аренда автовышки телефон'
  ],
  openGraph: {
    title: 'Контакты АТР-СПЕЦАРЕНДА',
    description: `Свяжитесь с нами: ${CONTACTS.phone.formatted}, ${CONTACTS.email.address}. Адрес: ${CONTACTS.address}`,
    type: 'website',
    locale: 'ru_RU',
    url: 'https://avtovishki-arenda.ru/kontakty',
  },
};

export default function ContactsPage() {
  const orgSchema = generateOrganizationSchema();
  const speakableSchema = generateSpeakableSchema({
    url: 'https://avtovishki-arenda.ru/kontakty',
    selectors: ['#alice-contact-answer']
  });

  // 🔹 Текст для Алисы — с динамическими контактами из .env
  const aliceAnswer = `
    ООО «АТР-СПЕЦАРЕНДА»: адрес — ${CONTACTS.address}. 
    Телефон: ${CONTACTS.phone.formatted}. Часы работы: ${CONTACTS.workingHours} по Москве. 
    Арендуем автовышки, краны-манипуляторы, автокраны и машины прикрытия с подачей за 2 часа.
    Email: ${CONTACTS.email.address}. Telegram: ${CONTACTS.telegram.username}.
  `.trim();

  return (
    <>
      {/* Микроразметка для поисковиков */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      
      {/* Блок для Алисы — скрыт визуально, но читается ассистентом */}
      <section id="alice-contact-answer" className="sr-only" aria-hidden="true">
        <h1>Контакты АТР-СПЕЦАРЕНДА</h1>
        <p>{aliceAnswer}</p>
      </section>

      {/* Хлебные крошки */}
      <nav className="bg-gray-50 py-3 border-b" aria-label="Breadcrumb">
        <div className="container mx-auto px-4">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-blue-600">Главная</a></li>
            <li>/</li>
            <li className="text-gray-900 font-medium" aria-current="page">Контакты</li>
          </ol>
        </div>
      </nav>

      {/* Герой-секция */}
      <section className="py-12 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Контакты</h1>
          <p className="text-lg text-blue-100">
            Свяжитесь с нами для заказа спецтехники или консультации
          </p>
        </div>
      </section>

      {/* Основной контент */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* 🔹 ЛЕВАЯ КОЛОНКА: Контактная информация (все данные из CONTACTS) */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Как нас найти</h2>
              
              {/* Адрес */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6 border">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <span>📍</span> Адрес
                </h3>
                <p className="text-gray-700">
                  <strong>{CONTACTS.address}</strong><br />
                  <span className="text-sm text-gray-500">Индекс: 125445</span>
                </p>
                <a 
                  href={`https://yandex.ru/maps/?text=${encodeURIComponent(CONTACTS.address)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-blue-600 hover:underline text-sm"
                >
                  Открыть в Яндекс.Картах →
                </a>
              </div>

              {/* Телефон и часы работы */}
              <div className="space-y-4 mb-6">
                
                {/* Телефон — через ContactLink с метрикой */}
                <div className="bg-gray-50 rounded-xl p-6 border">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span>📞</span> Телефон
                  </h3>
                  <ContactLink 
                    type="phone" 
                    className="text-2xl font-bold text-blue-600 hover:underline"
                    showIcon={false}
                  />
                  <p className="text-sm text-gray-500 mt-1">Звоните {CONTACTS.workingHours}</p>
                </div>

                {/* Часы работы */}
                <div className="bg-gray-50 rounded-xl p-6 border">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span>⏰</span> Часы работы
                  </h3>
                  <p className="text-gray-700">
                    <strong>{CONTACTS.workingHours}</strong><br />
                    <span className="text-sm text-gray-500">по московскому времени</span>
                  </p>
                </div>

                {/* Email и Telegram — через ContactLink с метрикой */}
                <div className="bg-gray-50 rounded-xl p-6 border">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span>✉️</span> Email и мессенджеры
                  </h3>
                  <p className="text-gray-700 space-y-1">
                    <ContactLink type="email" className="hover:underline block" showIcon={false} />
                    <ContactLink type="telegram" className="hover:underline block mt-1" showIcon={false} />
                  </p>
                </div>
              </div>

              {/* Реквизиты (статические данные компании) */}
              <details className="bg-gray-50 rounded-xl p-6 border">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  <span>📋 Реквизиты компании</span>
                  <span className="text-blue-600">▼</span>
                </summary>
                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <p><strong>ООО «АТР-СЕРВИС»</strong></p>
                  <p>ИНН: 7701234567</p>
                  <p>ОГРН: 1234567890123</p>
                  <p>Юр. адрес: {CONTACTS.address}</p>
                </div>
              </details>
            </div>

            {/* 🔹 ПРАВАЯ КОЛОНКА: Карта + Форма */}
            <div className="space-y-8">
              
              {/* Яндекс.Карта (заглушка + ссылка) */}
              <div className="bg-gray-100 rounded-xl overflow-hidden border">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="font-medium text-gray-700 mb-2">Интерактивная карта</p>
                    <a 
                      href={`https://yandex.ru/maps/?text=${encodeURIComponent(CONTACTS.address)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      Открыть карту в новом окне →
                    </a>
                    <p className="text-xs text-gray-500 mt-2">
                      Координаты: 55.8833, 37.5167
                    </p>
                  </div>
                </div>
              </div>

              {/* Форма заявки (внутри уже есть контактные ссылки) */}
              <div id="form" className="bg-white rounded-xl border p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Оставить заявку</h3>
                <ContactForm />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 🔹 CTA-секция — кнопка звонка через ContactLink */}
      <section className="py-12 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Нужна срочная подача техники?</h2>
          <p className="text-blue-100 mb-6">
            Позвоните прямо сейчас — менеджер подберёт технику и оформит заказ за 5 минут
          </p>
          <ContactLink 
            type="phone" 
            variant="button"
            className="btn-accent text-lg"
          />
        </div>
      </section>
    </>
  );
}