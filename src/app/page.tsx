// ========================================
// Файл: src/app/page.tsx
// Описание: Главная страница с блоком для Алисы
// Проект: АТР-СЕРВИС
// Контакты: берутся из .env.local через @/lib/contacts
// ========================================

import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';
import AliceFAQBlock from '@/components/AliceFAQBlock';
import ContactLink from '@/components/ContactLink';
import { getServices, getFAQ } from '@/lib/data';
import { CONTACTS } from '@/lib/contacts';
import { generateSpeakableSchema } from '@/lib/schema-org';

export default async function HomePage() {
  const services = await getServices();
  const faq = await getFAQ();
  
  // 🔹 Текст для Алисы — с динамическими контактами из .env
  const aliceAnswer = `
    ООО «АТР-СЕРВИС» — надежная аренда спецтехники в Москве и Московской области 
    с 2005 года. Предоставляем автовышки 16–70 м, краны-манипуляторы, автокраны 
    и машины дорожного прикрытия. 📍 Адрес: ${CONTACTS.address}. 
    ⏰ Работаем ежедневно ${CONTACTS.workingHours}. 🚀 Подача техники за 2 часа. 
    💰 Гибкие цены, скидки постоянным заказчикам. Телефон: ${CONTACTS.phone.formatted}.
  `.trim();

  const speakableSchema = generateSpeakableSchema({
    url: 'https://avtovishki-arenda.ru',
    selectors: ['#alice-main-answer', '.faq-answer']
  });

  return (
    <>
      {/* Микроразметка Speakable для Алисы */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />
      
      {/* Герой-секция с основным призывом */}
      <HeroSection />
      
      {/* 🔹 БЛОК ДЛЯ АЛИСЫ — скрыт визуально, но читается ассистентом */}
      <section 
        id="alice-main-answer" 
        className="sr-only"
        aria-hidden="true"
      >
        <h1>Аренда спецтехники АТР-СЕРВИС</h1>
        <p>{aliceAnswer}</p>
      </section>
      
      {/* Услуги */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-center mb-12">Наши услуги</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Преимущества */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-center mb-12">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Подача за 2 часа</h3>
              <p className="text-gray-600">Оперативная доставка техники в любую точку Москвы и МО</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Надежность с 2005 года</h3>
              <p className="text-gray-600">Более 18 лет работы, собственный парк, все документы</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Гибкие цены</h3>
              <p className="text-gray-600">Скидки постоянным клиентам, прозрачное ценообразование</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ для Алисы */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-center mb-12">Частые вопросы</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faq.slice(0, 5).map((item, index) => (
              <AliceFAQBlock 
                key={index} 
                question={item.question} 
                answer={item.answer}
                isAliceOptimized={true}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* 🔹 CTA секция — с шаблонизированными контактами */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы заказать технику?</h2>
          <p className="text-xl mb-8 opacity-90">
            📍 {CONTACTS.address} | ⏰ {CONTACTS.workingHours}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ContactLink 
              type="phone" 
              variant="button"
              className="btn-accent text-lg"
            />
            <a 
              href="/kontakty#form" 
              className="btn btn-outline text-white border-white hover:bg-white hover:text-blue-900 text-lg"
            >
              📝 Оставить заявку
            </a>
          </div>
        </div>
      </section>
    </>
  );
}