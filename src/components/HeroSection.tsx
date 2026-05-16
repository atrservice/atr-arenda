// ========================================
// Файл: src/components/HeroSection.tsx
// Описание: Герой-секция главной страницы с призывом к действию
// Проект: АТР-СЕРВИС
// ========================================

import Link from 'next/link';
import ContactLink from './ContactLink';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-primary-900">
      
      {/* Фон: градиент + текстура */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950" />
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Контент */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-accent-500/10 border border-accent-500/20 text-accent-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span>🚀</span>
              Подача техники за 2 часа
            </div>
            
            <h1 className="text-white mb-6">
              Аренда спецтехники{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-300">
                в Москве и МО
              </span>
            </h1>
            
            <p className="text-lg text-primary-100 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Собственный парк: автовышки до 70 м, краны-манипуляторы, автокраны. 
              Работаем с 2005 года. Все документы. Без посредников.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/uslugi" className="btn btn-accent text-base px-8">
                Выбрать технику
              </Link>
              <ContactLink 
                type="phone" 
                variant="button"
                className="btn bg-white text-gray-900 hover:bg-gray-100 border-0 text-base px-8"
              />
            </div>
            
            {/* Доверие */}
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-primary-200">
              <div className="flex items-center gap-2">
                <span className="text-accent-400">✓</span>
                50+ единиц техники
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent-400">✓</span>
                Допуск Ростехнадзора
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent-400">✓</span>
                Работаем 24/7
              </div>
            </div>
          </div>

          {/* Визуал (справа) */}
          <div className="hidden lg:block relative">
            <div className="relative bg-primary-800/50 rounded-3xl p-8 border border-primary-700/50 backdrop-blur-sm">
              {/* Карточка 1 */}
              <div className="bg-white rounded-2xl p-6 shadow-card-hover mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">🪜</div>
                  <div>
                    <div className="font-semibold text-gray-900">Автовышки</div>
                    <div className="text-sm text-gray-500">от 16 000 ₽/смена</div>
                  </div>
                </div>
              </div>
              
              {/* Карточка 2 */}
              <div className="bg-white rounded-2xl p-6 shadow-card-hover mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center text-2xl">🏗️</div>
                  <div>
                    <div className="font-semibold text-gray-900">Краны-манипуляторы</div>
                    <div className="text-sm text-gray-500">от 20 000 ₽/смена</div>
                  </div>
                </div>
              </div>
              
              {/* Карточка 3 */}
              <div className="bg-white rounded-2xl p-6 shadow-card-hover animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">🔧</div>
                  <div>
                    <div className="font-semibold text-gray-900">Автокраны</div>
                    <div className="text-sm text-gray-500">от 22 000 ₽/смена</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Декоративный элемент */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl" />
          </div>

        </div>
      </div>
    </section>
  );
}