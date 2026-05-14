// ========================================
// Файл: src/components/HeroSection.tsx
// Описание: Герой-секция главной страницы с призывом к действию
// Проект: АТР-СЕРВИС
// ========================================

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Текстовый блок */}
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
              🚀 Подача техники за 2 часа
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Аренда спецтехники в Москве и МО
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100 mb-6">
              Автовышки, КМУ, автокраны и машины прикрытия от ООО «АТР-СЕРВИС». 
              Собственный парк, все допуски, работа с 2005 года.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/uslugi/avtovyshki" className="btn btn-accent text-lg">
                🪜 Аренда автовышки
              </Link>
              <a href="tel:+74951234567" className="btn btn-outline text-white border-white hover:bg-white hover:text-blue-900 text-lg">
                📞 +7 (495) 123-45-67
              </a>
            </div>
            
            {/* Преимущества в строку */}
            <div className="flex flex-wrap gap-4 mt-8 text-sm">
              <span className="flex items-center gap-1">✅ Собственный парк</span>
              <span className="flex items-center gap-1">✅ Допуск Ростехнадзора</span>
              <span className="flex items-center gap-1">✅ Работаем 24/7</span>
            </div>
          </div>
          
          {/* Изображение техники (заглушка) */}
          <div className="relative">
            <div className="aspect-video bg-blue-800 rounded-xl flex items-center justify-center border-2 border-blue-600">
              <div className="text-center">
                <div className="text-6xl mb-4">🏗️</div>
                <p className="text-blue-200">Фото техники</p>
                <p className="text-xs text-blue-300 mt-2">Замените на реальное изображение</p>
              </div>
            </div>
            {/* Декоративный элемент */}
            <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
              от 16 000 ₽/смена
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}