import { Metadata } from 'next';
import Link from 'next/link';
import { CONTACTS } from '@/lib/contacts';

export const metadata: Metadata = {
  title: 'Условия использования (Оферта) | АТР-СЕРВИС',
  description: 'Публичная оферта на оказание услуг аренды спецтехники. Условия, порядок оплаты, ответственность сторон.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <nav className="bg-gray-50 py-3 border-b mb-8">
        <ol className="flex gap-2 text-sm text-gray-600">
          <li><Link href="/" className="hover:text-primary-600">Главная</Link></li>
          <li className="text-gray-400">/</li>
          <li className="font-medium text-gray-900">Условия использования</li>
        </ol>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold mb-8">Публичная оферта</h1>
      
      <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
        <p className="text-sm text-gray-500">
          Дата публикации: 06 июня 2026 г.
        </p>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Предмет оферты</h2>
          <p>
            ООО «АТР-СЕРВИС» (далее — Исполнитель) предлагает физическим и юридическим лицам 
            (далее — Заказчик) услуги по аренде спецтехники на условиях, изложенных в настоящей оферте.
          </p>
          <p>
            Размещение настоящей оферты на сайте avtovishki-arenda.ru является публичным предложением 
            Исполнителя в соответствии со ст. 437 Гражданского кодекса РФ.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">2. Порядок оказания услуг</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Заказчик оставляет заявку на сайте или по телефону</li>
            <li>Исполнитель связывается для уточнения деталей (тип техники, сроки, адрес объекта)</li>
            <li>Стороны согласовывают стоимость и подписывают договор</li>
            <li>Исполнитель подаёт технику на объект в согласованное время</li>
            <li>После выполнения работ подписывается акт выполненных работ</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">3. Стоимость и порядок оплаты</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Минимальный заказ — 1 смена (7+1 часов)</li>
            <li>Стоимость включает: работу машиниста, ГСМ, подачу техники в пределах МКАД</li>
            <li>Подача за МКАД оплачивается дополнительно из расчёта стоимости 1 км пробега</li>
            <li>Оплата: безналичный расчёт (для юрлиц) или наличные/карта (для физлиц)</li>
            <li>Предоплата — 50% при заказе, остаток — после выполнения работ</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">4. Ответственность сторон</h2>
          <p>
            Исполнитель несёт ответственность за исправность техники, квалификацию машинистов 
            и соблюдение сроков подачи. Заказчик обязан обеспечить безопасные условия работы 
            на объекте и своевременную оплату.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">5. Реквизиты Исполнителя</h2>
          <div className="bg-gray-50 p-6 rounded-lg mt-4">
            <p><strong>ООО «АТР-СЕРВИС»</strong></p>
            <p>Адрес: {CONTACTS.address}</p>
            <p>Телефон: {CONTACTS.phone.formatted}</p>
            <p>Email: {CONTACTS.email.address}</p>
            <p className="mt-2 text-sm">
              Полные реквизиты доступны на странице{' '}
              <Link href="/rekvizity" className="text-primary-600 hover:underline">
                «Реквизиты»
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}