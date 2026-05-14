// ========================================
// Файл: src/components/ServiceCard.tsx
// Описание: Карточка услуги для сетки на главной
// Проект: АТР-СЕРВИС
// ========================================

import Link from 'next/link';
import type { Service } from '@/lib/data';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link 
      href={`/uslugi/${service.slug}`}
      className="group block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all"
    >
      {/* Иконка */}
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
        {service.icon}
      </div>
      
      {/* Заголовок */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
        {service.title}
      </h3>
      
      {/* Описание */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {service.description}
      </p>
      
      {/* Характеристики */}
      <ul className="space-y-1 mb-4">
        {service.features.slice(0, 3).map((feature, idx) => (
          <li key={idx} className="text-xs text-gray-500 flex items-center gap-1">
            <span className="text-green-500">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      
      {/* Цена и кнопка */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <span className="text-xs text-gray-500">от</span>
          <span className="text-lg font-bold text-blue-600">
            {service.priceFrom.toLocaleString('ru-RU')} ₽
          </span>
          <span className="text-xs text-gray-500">/смена</span>
        </div>
        <span className="text-sm text-blue-600 font-medium group-hover:translate-x-1 transition">
          Подробнее →
        </span>
      </div>
    </Link>
  );
}