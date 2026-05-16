// ========================================
// Файл: src/components/Footer.tsx
// Описание: Подвал сайта с контактами и ссылками
// Проект: ООО «АТР-СЕРВИС»
// Дизайн: Tailwind CSS + бренд-цвета
// ========================================

import Link from 'next/link';
import ContactLink from '@/components/ContactLink';
import { CONTACTS } from '@/lib/contacts';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Компания */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg group-hover:bg-primary-500 transition-colors">
                АТ
              </div>
              <div>
                <span className="text-lg font-extrabold text-white leading-none block">
                  АТР-СЕРВИС
                </span>
                <span className="text-[10px] font-semibold text-accent-400 tracking-wider uppercase">
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
              <li className="flex items-start gap-2 text-gray-300">
                <span className="text-accent-400 mt-0.5">📍</span>
                <span>{CONTACTS.address}</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <span className="text-accent-400">⏰</span>
                <span>{CONTACTS.workingHours}</span>
              </li>
              <li>
                <ContactLink 
                  type="phone" 
                  className="inline-flex items-center gap-2 text-gray-300 hover:text-accent-400 transition-colors font-medium"
                />
              </li>
              <li className="flex items-center gap-2">
                <ContactLink 
                  type="email" 
                  className="text-gray-300 hover:text-accent-400 transition-colors"
                />
              </li>
              <li className="flex items-center gap-2">
                <ContactLink 
                  type="telegram" 
                  className="text-gray-300 hover:text-accent-400 transition-colors"
                />
              </li>
            </ul>
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
                    className="text-gray-300 hover:text-accent-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 group-hover:bg-accent-400 transition-colors" />
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
                <Link href="/policy" className="text-gray-300 hover:text-accent-400 transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-accent-400 transition-colors">
                  Договор оферты
                </Link>
              </li>
              <li>
                <Link href="/rekvizity" className="text-gray-300 hover:text-accent-400 transition-colors">
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