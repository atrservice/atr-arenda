// ========================================
// Файл: src/components/Footer.tsx
// Описание: Подвал сайта с контактами и ссылками
// Проект: ООО «АТР-СЕРВИС»
// ========================================

'use client'; // ✅ Обязательно: есть интерактивность (клики по соцсетям)

import Link from 'next/link';
import Image from 'next/image';
import ContactLink from '@/components/ContactLink';
import { CONTACTS } from '@/lib/contacts';

export default function Footer() {
  // 🔹 Хелпер для отправки цели в Метрику
  const trackSocialClick = (goal: string) => {
    if (typeof window !== 'undefined' && (window as any).ym) {
      (window as any).ym(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID, 'reachGoal', goal);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Компания */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <Image 
                src="/images/logo.png" 
                alt="АТР-СЕРВИС логотип"
                width={40}
                height={40}
                className="object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
              <div>
                <span className="text-lg font-extrabold text-white leading-none block">
                  АТР-СЕРВИС
                </span>
                <span className="text-[10px] font-semibold text-primary-400 tracking-wider uppercase">
                  Спецтехника
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Надежная аренда спецтехники в Москве и Московской области с 2009 года. 
              Собственный парк, все допуски, работа 24/7.
            </p>
          </div>
          
          {/* Контакты */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Контакты</h4>
            <ul className="space-y-3 text-sm">
              
              {/* 📍 Адрес */}
              <li className="flex items-start gap-3 text-gray-300">
                <Image 
                  src="/images/icons/icon_location.png" 
                  alt="Адрес"
                  width={20}
                  height={20}
                  className="object-contain mt-0.5"
                />
                <span>{CONTACTS.address}</span>
              </li>
              
              {/* ⏰ Часы работы */}
              <li className="flex items-center gap-3 text-gray-300">
                <Image 
                  src="/images/icons/icon_clock.png" 
                  alt="Часы работы"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <span>{CONTACTS.workingHours}</span>
              </li>
              
              {/* 📞 Телефон */}
              <li>
                <ContactLink 
                  type="phone" 
                  className="inline-flex items-center gap-2 text-gray-300 hover:text-primary-400 transition-colors font-medium"
                  showIcon={true}
                />
              </li>
              
              {/* ✉️ Email */}
              <li className="flex items-center gap-3">
                <Image 
                  src="/images/icons/icon_email.png" 
                  alt="Email"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <ContactLink 
                  type="email" 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                  showIcon={false}
                />
              </li>
              
            </ul>
            
            {/* 🔹 Только кликабельные иконки соцсетей — без текста */}
            <div className="mt-4 flex items-center gap-3">
              {/* Telegram */}
              <a 
                href={CONTACTS.telegram.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocialClick('telegram_click')}
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                aria-label="Telegram"
              >
                <Image 
                  src="/images/icons/icon_telegram.png" 
                  alt="Telegram"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </a>
              
              {/* WhatsApp */}
              <a 
                href={CONTACTS.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocialClick('whatsapp_click')}
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-green-500 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <Image 
                  src="/images/icons/icon_whatsapp.png" 
                  alt="WhatsApp"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </a>
              
              {/* VK (Max) */}
              <a 
                href="https://max.ru/u/f9LHodD0cOKOvqrWxIGm54rpoVi3dKlmwiPOTc4gHYYjNmA3QkYeIPnuaJg"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocialClick('vk_click')}
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-500 flex items-center justify-center transition-colors"
                aria-label="ВКонтакте"
              >
                <Image 
                  src="/images/icons/icon_vk.png" 
                  alt="ВКонтакте"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </a>
            </div>
          </div>
          
          {/* Услуги */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Услуги</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/uslugi/avtovyshki', label: 'Аренда автовышек' },
                { href: '/uslugi/kmu', label: 'Аренда КМУ' },
                { href: '/uslugi/avtokrany', label: 'Аренда автокранов' },
                { href: '/uslugi/prikrytie', label: 'Машины прикрытия' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 group-hover:bg-primary-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Документы */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Документы</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/policy" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Договор оферты
                </Link>
              </li>
              <li>
                <Link href="/rekvizity" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Реквизиты компании
                </Link>
              </li>
            </ul>
          </div>
          
        </div>
        
        {/* Копирайт */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ООО «АТР-СЕРВИС». Все права защищены.
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Копирование материалов сайта запрещено.
          </p>
        </div>
      </div>
    </footer>
  );
}