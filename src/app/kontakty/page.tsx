// ========================================
// File: src/app/kontakty/page.tsx
// Description: Страница контактов с картой и микроразметкой LocalBusiness
// Project: ООО «АТР-СЕРВИС»
// SEO: LocalBusiness + GeoCoordinates + OpeningHours для Яндекса/Алисы
// Дизайн: оранжевый + серый/чёрный + белый, градиенты, SVG-иконки
// ========================================

// ❌ НЕ добавляй 'use client' — это серверный компонент с metadata!

import Image from 'next/image';
import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import ContactLink from '@/components/ContactLink';
import SocialIcons from '@/components/SocialIcons'; // ✅ Новый клиентский компонент
import { CONTACTS } from '@/lib/contacts';
import { generateOrganizationSchema, generateSpeakableSchema } from '@/lib/schema-org';
import { getRobotsMetadata } from '@/lib/indexing';

// 🔹 SEO-метаданные — работают только в серверных компонентах
export const metadata: Metadata = {
  title: `Контакты АТР-СЕРВИС | ${CONTACTS.address}`,
  description: `📍 ООО «АТР-СЕРВИС»: ${CONTACTS.address}. ⏰ ${CONTACTS.workingHours}. 📞 ${CONTACTS.phone.formatted}. Закажите аренду спецтехники!`,
  robots: getRobotsMetadata('/kontakty'),
  keywords: [
    'АТР-СЕРВИС контакты',
    'аренда спецтехники москва адрес',
    'Ижорская 8с2',
    'аренда автовышки телефон'
  ],
  openGraph: {
    title: 'Контакты АТР-СЕРВИС',
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
    ООО «АТР-СЕРВИС»: адрес — ${CONTACTS.address}. 
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
        <h1>Контакты АТР-СЕРВИС</h1>
        <p>{aliceAnswer}</p>
      </section>

      {/* Хлебные крошки */}
      <nav className="bg-gray-50 py-3 border-b" aria-label="Breadcrumb">
        <div className="container mx-auto px-4">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-primary-600 transition-colors">Главная</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium" aria-current="page">Контакты</li>
          </ol>
        </div>
      </nav>

      {/* 🔹 Герой-секция — новая палитра: градиент серый+оранжевый */}
      <section className="py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Контакты</h1>
          <p className="text-lg text-gray-300">
            Свяжитесь с нами для заказа спецтехники или консультации
          </p>
        </div>
      </section>

      {/* Основной контент */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* 🔹 ЛЕВАЯ КОЛОНКА: Контактная информация */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Как нас найти</h2>
              
              {/* 📍 Адрес — с иконкой SVG (фиксированный размер) */}
              <div className="card p-6 mb-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-3">
                  <Image 
                    src="/images/icons/icon_location.svg" 
                    alt="Адрес"
                    width={24}
                    height={24}
                    className="object-contain flex-shrink-0"
                  />
                  <span className="text-gray-900">Адрес</span>
                </h3>
                <p className="text-gray-700">
                  <strong>{CONTACTS.address}</strong><br />
                  <span className="text-sm text-gray-500">Индекс: 125445</span>
                </p>
                <a 
                  href={`https://yandex.ru/maps/?text=${encodeURIComponent(CONTACTS.address)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-primary-600 hover:text-primary-700 hover:underline text-sm transition-colors"
                >
                  Открыть в Яндекс.Картах →
                </a>
              </div>

              {/* Телефон и часы работы */}
              <div className="space-y-4 mb-6">
                
                {/* 📞 Телефон — через ContactLink с иконкой */}
                <div className="card p-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-3">
                    <Image 
                      src="/images/icons/icon_phone.svg" 
                      alt="Телефон"
                      width={24}
                      height={24}
                      className="object-contain flex-shrink-0"
                    />
                    <span className="text-gray-900">Телефон</span>
                  </h3>
                  <ContactLink 
                    type="phone" 
                    className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
                    iconSize={24}
                  />
                  <p className="text-sm text-gray-500 mt-1">Звоните {CONTACTS.workingHours}</p>
                </div>

                {/* ⏰ Часы работы — с иконкой */}
                <div className="card p-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-3">
                    <Image 
                      src="/images/icons/icon_clock.svg" 
                      alt="Часы работы"
                      width={24}
                      height={24}
                      className="object-contain flex-shrink-0"
                    />
                    <span className="text-gray-900">Часы работы</span>
                  </h3>
                  <p className="text-gray-700">
                    <strong>{CONTACTS.workingHours}</strong><br />
                    <span className="text-sm text-gray-500">по московскому времени</span>
                  </p>
                </div>

                {/* ✉️ Email + соцсети — в одну строку */}
                <div className="card p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-3">
                    <Image 
                      src="/images/icons/icon_email.svg" 
                      alt="Контакты"
                      width={24}
                      height={24}
                      className="object-contain flex-shrink-0"
                    />
                    <span className="text-gray-900">Свяжитесь с нами</span>
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    
                    {/* 📧 Email: иконка + текст */}
                    <ContactLink 
                      type="email" 
                      className="text-gray-700 hover:text-primary-600 transition-colors inline-flex items-center gap-2"
                      iconSize={24}
                    />
                    
                    {/* Разделитель */}
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    
                    {/* 🔹 Соцсети: клиентский компонент с крупными иконками */}
                    <SocialIcons />
                    
                  </div>
                </div>
              </div>

              {/* 📋 Реквизиты — с иконкой */}
              <details className="card p-6">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center text-gray-900">
                  <span className="flex items-center gap-2">
                    <Image 
                      src="/images/icons/icon_documents.svg" 
                      alt="Реквизиты"
                      width={20}
                      height={20}
                      className="object-contain flex-shrink-0"
                    />
                    Реквизиты компании
                  </span>
                  <span className="text-primary-600 transition-transform duration-200">▼</span>
                </summary>
                <div className="mt-4 text-sm text-gray-600 space-y-1 pt-4 border-t border-gray-100">
                  <p><strong>ООО «АТР-СЕРВИС»</strong></p>
                  <p>ИНН: 7701234567</p>
                  <p>ОГРН: 1234567890123</p>
                  <p>Юр. адрес: {CONTACTS.address}</p>
                </div>
              </details>
            </div>

            {/* 🔹 ПРАВАЯ КОЛОНКА: Карта + Форма */}
            <div className="space-y-8">
              
              {/* 🗺️ Яндекс.Карта — с иконкой (fill + правильный контейнер) */}
              <div className="card overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center p-4">
                    {/* Иконка карты: fill + контейнер с размерами */}
                    <div className="relative w-16 h-16 mx-auto mb-3">
                      <Image 
                        src="/images/icons/icon_map.svg" 
                        alt="Карта"
                        fill
                        className="object-contain opacity-70"
                        sizes="64px"
                      />
                    </div>
                    <p className="font-medium text-gray-700 mb-2">Интерактивная карта</p>
                    <a 
                      href={`https://yandex.ru/maps/?text=${encodeURIComponent(CONTACTS.address)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                    >
                      Открыть карту в новом окне →
                    </a>
                    <p className="text-xs text-gray-500 mt-2">
                      Координаты: 55.8833, 37.5167
                    </p>
                  </div>
                </div>
              </div>

              {/* Форма заявки */}
              <div id="form" className="card p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Оставить заявку</h3>
                <ContactForm />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 🔹 CTA-секция — новая палитра: градиент серый+оранжевый */}
      <section className="py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gradient">Нужна срочная подача техники?</h2>
          <p className="text-gray-300 mb-6">
            Позвоните прямо сейчас — менеджер подберёт технику и оформит заказ за 5 минут
          </p>
          <ContactLink 
            type="phone" 
            variant="button"
            className="btn btn-accent text-lg shadow-glow hover:shadow-glow-lg"
          />
        </div>
      </section>
    </>
  );
}