// ========================================
// Файл: src/components/Footer.tsx
// Описание: Подвал сайта с контактами и ссылками
// Проект: АТР-СЕРВИС
// ========================================

import Link from 'next/link';
import ContactLink from '@/components/ContactLink';
import { CONTACTS } from '@/lib/contacts';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Компания */}
          <div>
            <div className="font-bold text-xl mb-4">АТР-СЕРВИС</div>
            <p className="text-gray-400 text-sm">
              Надежная аренда спецтехники в Москве и Московской области с 2009 года.
            </p>
          </div>
          
          {/* Контакты */}
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📍 {CONTACTS.address}</li>
              <li>⏰ {CONTACTS.workingHours}</li>
              <li><ContactLink type="phone" className="hover:text-white" /></li>
              <li><ContactLink type="email" className="hover:text-white" /></li>
              <li><ContactLink type="telegram" className="hover:text-white" /></li>
            </ul>
          </div>
          
          {/* Ссылки */}
          <div>
            <h4 className="font-semibold mb-4">Услуги</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/uslugi/avtovyshki" className="hover:text-white transition">Аренда автовышек</Link></li>
              <li><Link href="/uslugi/kmu" className="hover:text-white transition">Аренда КМУ</Link></li>
              <li><Link href="/uslugi/avtokrany" className="hover:text-white transition">Аренда автокранов</Link></li>
              <li><Link href="/uslugi/prikrytie" className="hover:text-white transition">Машины прикрытия</Link></li>
            </ul>
          </div>
          
        </div>
        
        {/* Копирайт */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} ООО «АТР-СЕРВИС». Все права защищены. Копирование материалов сайта запрещено.
        </div>
      </div>
    </footer>
  );
}