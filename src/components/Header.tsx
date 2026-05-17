// ========================================
// Файл: src/components/Header.tsx
// Описание: Шапка сайта с логотипом, навигацией и соцсетями
// Проект: ООО «АТР-СЕРВИС»
// ========================================

'use client'; // ✅ Обязательно: есть интерактивность

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContactLink from './ContactLink';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Блокируем скролл когда мобильное меню открыто
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const menuItems = [
    { href: '/uslugi/avtovyshki', label: 'Автовышки' },
    { href: '/uslugi/kmu', label: 'КМУ' },
    { href: '/uslugi/avtokrany', label: 'Автокраны' },
    { href: '/uslugi/prikrytie', label: 'Прикрытие' },
  ];

  // 🔹 Хелпер для отправки цели в Метрику
  const trackSocialClick = (goal: string) => {
    if (typeof window !== 'undefined' && (window as any).ym) {
      (window as any).ym(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID, 'reachGoal', goal);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-white py-4'
      }`}
    >
      <div className="container flex items-center justify-between">
        
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image 
            src="/images/logo.png" 
            alt="АТР-СЕРВИС логотип"
            width={40}
            height={40}
            className="object-contain"
            style={{ width: 'auto', height: 'auto' }}
          />
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-gray-900 leading-none">
              АТР-СЕРВИС
            </span>
            <span className="text-[10px] font-semibold text-primary-500 tracking-wider uppercase">
              Спецтехника
            </span>
          </div>
        </Link>

        {/* Десктоп-меню */}
        <nav className="hidden lg:flex items-center gap-1">
          {menuItems.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Контакты + Соцсети + Кнопка (десктоп) */}
        <div className="hidden lg:flex items-center gap-4">
          
          {/* 🔹 Соцсети: только иконки, без текста */}
          <div className="flex items-center gap-2 mr-2">
            {/* Telegram */}
            <a 
              href="https://t.me/ATR7373"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSocialClick('telegram_click')}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-primary-100 flex items-center justify-center transition-colors"
              aria-label="Telegram"
            >
              <Image 
                src="/images/icons/icon_telegram.svg"
                alt="Telegram"
                width={18}
                height={18}
                className="object-contain"
              />
            </a>
            {/* WhatsApp */}
            <a 
              href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE_RAW || '79262097373'}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSocialClick('whatsapp_click')}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-green-100 flex items-center justify-center transition-colors"
              aria-label="WhatsApp"
            >
              <Image 
                src="/images/icons/icon_whatsapp.svg"
                alt="WhatsApp"
                width={18}
                height={18}
                className="object-contain"
              />
            </a>
            {/* VK */}
            <a 
              href="https://max.ru/u/f9LHodD0cOKOvqrWxIGm54rpoVi3dKlmwiPOTc4gHYYjNmA3QkYeIPnuaJg"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSocialClick('vk_click')}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors"
              aria-label="ВКонтакте"
            >
              <Image 
                src="/images/icons/icon_vk.svg"
                alt="ВКонтакте"
                width={18}
                height={18}
                className="object-contain"
              />
            </a>
          </div>
          
          {/* Разделитель */}
          <div className="w-px h-6 bg-gray-200 mx-2" />
          
          {/* Телефон */}
          <div className="text-right hidden xl:block">
            <div className="text-[11px] text-gray-500 font-medium">
              Работаем {process.env.NEXT_PUBLIC_WORKING_HOURS || '08:00–22:00'}
            </div>
            <ContactLink 
              type="phone" 
              className="text-base font-bold text-gray-900 hover:text-primary-600 transition-colors"
              showIcon={false}
            />
          </div>
          
          {/* Кнопка */}
          <Link 
            href="/kontakty#form" 
            className="btn btn-accent text-sm px-5 py-2.5 shadow-md hover:shadow-lg"
          >
            Заказать
          </Link>
        </div>

        {/* Мобильная кнопка гамбургер */}
        <div className="flex items-center gap-2 md:hidden">
          
          {/* 🔹 Соцсети в мобильной версии — перед гамбургером */}
          <div className="flex items-center gap-1">
            <a 
              href="https://t.me/ATR7373"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSocialClick('telegram_click')}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-primary-100 flex items-center justify-center transition-colors"
              aria-label="Telegram"
            >
              <Image 
                src="/images/icons/icon_telegram.svg"
                alt="Telegram"
                width={18}
                height={18}
                className="object-contain"
              />
            </a>
            <a 
              href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE_RAW || '79262097373'}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSocialClick('whatsapp_click')}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-green-100 flex items-center justify-center transition-colors"
              aria-label="WhatsApp"
            >
              <Image 
                src="/images/icons/icon_whatsapp.svg"
                alt="WhatsApp"
                width={18}
                height={18}
                className="object-contain"
              />
            </a>
            <a 
              href="https://max.ru/u/f9LHodD0cOKOvqrWxIGm54rpoVi3dKlmwiPOTc4gHYYjNmA3QkYeIPnuaJg"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSocialClick('vk_click')}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors"
              aria-label="ВКонтакте"
            >
              <Image 
                src="/images/icons/icon_vk.svg"
                alt="ВКонтакте"
                width={18}
                height={18}
                className="object-contain"
              />
            </a>
          </div>
          
          {/* Кнопка гамбургер */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            aria-label="Открыть меню"
            aria-expanded={mobileMenuOpen}
          >
            <div className="w-6 h-6 relative flex flex-col justify-center items-center">
              <span className={`block absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'rotate-45' : '-translate-y-2'}`} />
              <span className={`block absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${mobileMenuOpen ? '-rotate-45' : 'translate-y-2'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* 🔹 Мобильное меню (выезжающая панель) */}
      <div className={`lg:hidden fixed inset-0 z-40 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Затемнение фона */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Панель меню */}
        <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
          <div className="p-6">
            {/* Кнопка закрытия */}
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
              aria-label="Закрыть меню"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Логотип */}
            <div className="mb-8 mt-2">
              <span className="text-xl font-extrabold text-gray-900">АТР-СЕРВИС</span>
              <span className="block text-xs text-primary-500 font-semibold">Спецтехника в Москве</span>
            </div>

            {/* Пункты меню */}
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/kontakty"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              >
                Контакты
              </Link>
            </nav>

            {/* Контакты в мобильном меню */}
            <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
              <div className="text-sm text-gray-500">
                <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <Image src="/images/icons/icon_location.svg" alt="Адрес" width={16} height={16} className="object-contain" />
                  Адрес
                </div>
                <div className="ml-6">{process.env.NEXT_PUBLIC_ADDRESS || 'Москва, Ижорская ул., д. 8, стр. 2'}</div>
              </div>
              
              <div className="text-sm text-gray-500">
                <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <Image src="/images/icons/icon_clock.svg" alt="Часы" width={16} height={16} className="object-contain" />
                  Режим работы
                </div>
                <div className="ml-6">{process.env.NEXT_PUBLIC_WORKING_HOURS || 'Пн–Вс: 08:00–22:00'}</div>
              </div>

              <div className="pt-4 space-y-3">
                <ContactLink 
                  type="phone" 
                  variant="button"
                  className="w-full justify-center"
                />
              </div>
              
              {/* Соцсети в мобильном меню */}
              <div className="pt-4 flex items-center justify-center gap-4">
                <a 
                  href="https://t.me/ATR7373"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { trackSocialClick('telegram_click'); setMobileMenuOpen(false); }}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-primary-100 flex items-center justify-center transition-colors"
                  aria-label="Telegram"
                >
                  <Image src="/images/icons/icon_telegram.svg" alt="Telegram" width={20} height={20} className="object-contain" />
                </a>
                <a 
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE_RAW || '79262097373'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { trackSocialClick('whatsapp_click'); setMobileMenuOpen(false); }}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-green-100 flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <Image src="/images/icons/icon_whatsapp.svg" alt="WhatsApp" width={20} height={20} className="object-contain" />
                </a>
                <a 
                  href="https://max.ru/u/f9LHodD0cOKOvqrWxIGm54rpoVi3dKlmwiPOTc4gHYYjNmA3QkYeIPnuaJg"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { trackSocialClick('vk_click'); setMobileMenuOpen(false); }}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors"
                  aria-label="ВКонтакте"
                >
                  <Image src="/images/icons/icon_vk.svg" alt="ВКонтакте" width={20} height={20} className="object-contain" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}