import { Metadata } from 'next';
import Link from 'next/link';
import { CONTACTS } from '@/lib/contacts';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности | АТР-СЕРВИС',
  description: 'Политика обработки персональных данных ООО «АТР-СЕРВИС». Сбор, хранение и защита информации клиентов.',
  robots: { index: true, follow: true },
};

export default function PolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <nav className="bg-gray-50 py-3 border-b mb-8">
        <ol className="flex gap-2 text-sm text-gray-600">
          <li><Link href="/" className="hover:text-primary-600">Главная</Link></li>
          <li className="text-gray-400">/</li>
          <li className="font-medium text-gray-900">Политика конфиденциальности</li>
        </ol>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold mb-8">Политика конфиденциальности</h1>
      
      <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
        <p className="text-sm text-gray-500">
          Дата публикации: 06 июня 2026 г.
        </p>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Общие положения</h2>
          <p>
            Настоящая Политика конфиденциальности (далее — Политика) действует в отношении всей информации, 
            которую ООО «АТР-СЕРВИС» (далее — Оператор) может получить о пользователе во время использования 
            сайта avtovishki-arenda.ru.
          </p>
          <p>
            Использование сайта означает безоговорочное согласие Пользователя с настоящей Политикой и 
            указанными в ней условиями обработки его персональной информации.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">2. Персональные данные, собираемые сайтом</h2>
          <p>Сайт может собирать следующие данные:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Имя и фамилия</li>
            <li>Контактный телефон</li>
            <li>Адрес электронной почты</li>
            <li>Адрес объекта проведения работ</li>
            <li>Технические данные (IP-адрес, cookies, данные браузера)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">3. Цели сбора персональных данных</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Обработка заявок на аренду спецтехники</li>
            <li>Связь с клиентом для уточнения деталей заказа</li>
            <li>Улучшение качества обслуживания</li>
            <li>Статистический анализ посещаемости сайта (Яндекс.Метрика)</li>
            <li>Информирование об акциях и специальных предложениях (с согласия клиента)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">4. Использование cookies</h2>
          <p>
            Сайт использует cookies для обеспечения корректной работы и сбора статистики. 
            Пользователь может отключить cookies в настройках браузера, однако это может повлиять 
            на функциональность сайта.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">5. Защита персональных данных</h2>
          <p>
            Оператор принимает необходимые организационные и технические меры для защиты персональной 
            информации Пользователя от неправомерного или случайного доступа, уничтожения, изменения, 
            блокирования, копирования, распространения.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">6. Права пользователя</h2>
          <p>Пользователь имеет право:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Получить информацию о своих персональных данных</li>
            <li>Требовать уточнения, блокирования или уничтожения данных</li>
            <li>Отозвать согласие на обработку персональных данных</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">7. Контактная информация</h2>
          <p>По всем вопросам, связанным с обработкой персональных данных, обращайтесь:</p>
          <div className="bg-gray-50 p-6 rounded-lg mt-4">
            <p><strong>ООО «АТР-СЕРВИС»</strong></p>
            <p>Адрес: {CONTACTS.address}</p>
            <p>Телефон: {CONTACTS.phone.formatted}</p>
            <p>Email: {CONTACTS.email.address}</p>
          </div>
        </section>
      </div>
    </div>
  );
}