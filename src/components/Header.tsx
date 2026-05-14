// ========================================
// Файл: src/components/Header.tsx
// Описание: Шапка сайта с логотипом и навигацией
// Проект: АТР-СЕРВИС
// ========================================

import Link from 'next/link';
import ContactLink from '@/components/ContactLink';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            АТ
          </div>
          <div>
            <div className="font-bold text-lg text-gray-900">АТР-СЕРВИС</div>
            <div className="text-xs text-orange-600">спецтехника в аренду</div>
          </div>
        </Link>
        
        {/* Навигация (десктоп) */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/uslugi/avtovyshki" className="text-gray-700 hover:text-blue-600 transition">
            Автовышки
          </Link>
          <Link href="/uslugi/kmu" className="text-gray-700 hover:text-blue-600 transition">
            КМУ
          </Link>
          <Link href="/uslugi/avtokrany" className="text-gray-700 hover:text-blue-600 transition">
            Автокраны
          </Link>
          <Link href="/uslugi/prikrytie" className="text-gray-700 hover:text-blue-600 transition">
            Прикрытие
          </Link>
          <Link href="/kontakty" className="text-gray-700 hover:text-blue-600 transition">
            Контакты
          </Link>
        </nav>
        
        {/* Телефон и кнопка */}
        <div className="hidden md:flex items-center gap-4">
          <ContactLink type="phone" className="text-gray-900 font-semibold" showIcon={false} />
          <Link href="/kontakty#form" className="btn btn-primary">Заказать</Link>
        </div>
        
        {/* Мобильное меню (кнопка-бургер) */}
        <button className="md:hidden p-2 text-gray-700" aria-label="Меню">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}