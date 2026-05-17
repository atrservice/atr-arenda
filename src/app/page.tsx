// ========================================
// Файл: src/app/page.tsx
// Описание: Главная страница с блоком для Алисы
// Проект: ООО «АТР-СЕРВИС»
// Дизайн: оранжевый + серый/чёрный + белый, градиенты, иконки-картинки
// ========================================

import Image from 'next/image';
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
    с 2009 года. Предоставляем автовышки 16–70 м, краны-манипуляторы, автокраны 
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
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container">
          <h2 className="text-center mb-12 text-gradient">Наши услуги</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Преимущества — с иконками-картинками вместо эмодзи */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-center mb-12 text-gradient">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 🚀 Подача за 2 часа */}
            <div className="text-center p-6 card card-hover">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <Image 
                  src="/images/icons/icon_speed.png"
                  alt="Быстрая подача"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 32px, 64px"
                  priority
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Подача за 2 часа</h3>
              <p className="text-gray-600">
                Оперативная доставка техники в любую точку Москвы и Московской области
              </p>
            </div>
            
            {/* ✅ Надежность с 2009 года */}
            <div className="text-center p-6 card card-hover">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <Image 
                  src="/images/icons/icon_check.png"
                  alt="Надежность"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 32px, 64px"
                  priority
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Надежность с 2009 года</h3>
              <p className="text-gray-600">
                Более 17 лет работы, собственный парк, все документы
              </p>
            </div>
            
            {/* 💰 Гибкие цены */}
            <div className="text-center p-6 card card-hover">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <Image 
                  src="/images/icons/icon_price.png"
                  alt="Гибкие цены"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 32px, 64px"
                  priority
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Гибкие цены</h3>
              <p className="text-gray-600">
                Скидки постоянным клиентам, прозрачное ценообразование
              </p>
            </div>
            
          </div>
        </div>
      </section>
      
      {/* FAQ для Алисы */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container">
          <h2 className="text-center mb-12 text-gradient">Частые вопросы</h2>
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
      
      {/* 🔹 CTA секция — новая палитра: градиент серый+оранжевый, читаемый текст */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4 text-gradient">Готовы заказать технику?</h2>
          <p className="text-xl mb-8 text-gray-300 flex items-center justify-center gap-3 flex-wrap">
            {/* 📍 Адрес — иконка вместо эмодзи */}
            <span className="inline-flex items-center gap-2">
              <Image 
                src="/images/icons/icon_location.png" 
                alt="Адрес"
                width={20}
                height={20}
                className="object-contain opacity-90"
              />
              <span>{CONTACTS.address}</span>
            </span>
            
            <span className="hidden sm:inline text-gray-600">|</span>
            
            {/* ⏰ Часы работы — иконка вместо эмодзи */}
            <span className="inline-flex items-center gap-2">
              <Image 
                src="/images/icons/icon_clock.png" 
                alt="Часы работы"
                width={20}
                height={20}
                className="object-contain opacity-90"
              />
              <span>{CONTACTS.workingHours}</span>
            </span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ContactLink 
              type="phone" 
              variant="button"
              className="btn btn-accent text-lg shadow-glow hover:shadow-glow-lg"
            />
            <a 
              href="/kontakty#form" 
              className="btn border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-lg transition-all inline-flex items-center gap-2"
            >
              {/* 📝 Иконка вместо эмодзи */}
              <Image 
                src="/images/icons/icon_form.png" 
                alt="Форма заявки"
                width={20}
                height={20}
                className="object-contain"
                sizes="(max-width: 768px) 32px, 64px"
              />
              <span>Оставить заявку</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}