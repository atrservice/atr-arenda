// ========================================
// File: src/app/uslugi/page.tsx
// Description: Страница со списком всех услуг
// Project: ООО «АТР-СЕРВИС»
// ========================================

import { Metadata } from 'next';
import Link from 'next/link';
import { getServices } from '@/lib/data';
import { CONTACTS } from '@/lib/contacts';

export const metadata: Metadata = {
  title: `Все услуги аренды спецтехники | ООО «АТР-СЕРВИС»`,
  description: `📋 Полный каталог услуг: автовышки, КМУ, автокраны, машины прикрытия. 📍 ${CONTACTS.address}. ⏰ ${CONTACTS.workingHours}.`,
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      {/* Хлебные крошки */}
      <nav className="bg-gray-50 py-3 border-b">
        <div className="container mx-auto px-4">
          <ol className="flex gap-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-blue-600">Главная</Link></li>
            <li>/</li>
            <li className="font-medium">Все услуги</li>
          </ol>
        </div>
      </nav>

      {/* Герой-секция */}
      <section className="py-12 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Наши услуги</h1>
          <p className="text-lg text-blue-100">
            Аренда спецтехники в Москве и Московской области с подачей за 2 часа
          </p>
        </div>
      </section>

      {/* Список услуг */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/uslugi/${service.slug}`}
                className="group block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-1 mb-4">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-500 flex items-center gap-1">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-xs text-gray-500">от</span>
                    <span className="text-lg font-bold text-blue-600">
                      {service.priceFrom.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className="text-xs text-gray-500">/смена</span>
                  </div>
                  <span className="text-blue-600 font-medium group-hover:translate-x-1 transition">
                    Подробнее →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Нужна консультация?</h2>
          <p className="text-blue-100 mb-6">
            Поможем подобрать технику под вашу задачу
          </p>
          <a href="tel:+79262097373" className="btn btn-accent text-lg">
            📞 {CONTACTS.phone.formatted}
          </a>
        </div>
      </section>
    </>
  );
}