// ========================================
// Файл: src/components/Header.tsx
// Описание: Шапка сайта с логотипом и навигацией
// Проект: АТР-СЕРВИС
// ========================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ContactLink from './ContactLink';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' 
          : 'bg-white py-4'
      }`}
    >
      <div className="container flex items-center justify-between">
        
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg group-hover:bg-primary-700 transition-colors">
            АТ
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-gray-900 leading-none">
              АТР-СЕРВИС
            </span>
            <span className="text-[10px] font-semibold text-accent-500 tracking-wider uppercase">
              Спецтехника
            </span>
          </div>
        </Link>

        {/* Десктоп-меню */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: '/uslugi/avtovyshki', label: 'Автовышки' },
            { href: '/uslugi/kmu', label: 'КМУ' },
            { href: '/uslugi/avtokrany', label: 'Автокраны' },
            { href: '/uslugi/prikrytie', label: 'Прикрытие' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Контакты + Кнопка */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right hidden lg:block">
            <div className="text-[11px] text-gray-500 font-medium">
              Работаем 08:00–22:00
            </div>
            <ContactLink 
              type="phone" 
              className="text-base font-bold text-gray-900 hover:text-primary-600 transition-colors"
              showIcon={false}
            />
          </div>
          <Link 
            href="/kontakty#form" 
            className="btn btn-accent text-sm px-5 py-2.5"
          >
            Заказать
          </Link>
        </div>

        {/* Мобильная кнопка (заглушка) */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:text-primary-600"
          aria-label="Меню"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}