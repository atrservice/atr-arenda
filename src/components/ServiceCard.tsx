// ========================================
// Файл: src/components/ServiceCard.tsx
// Описание: Карточка услуги для сетки на главной
// Проект: АТР-СЕРВИС
// ========================================

import Link from 'next/link';
import Image from 'next/image';

interface Service {
  slug: string;
  title: string;
  description: string;
  icon: string;
  imageUrl?: string;
  priceFrom: number;
  features: string[];
}

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link 
      href={`/uslugi/${service.slug}`}
      className="card card-hover block p-0 h-full group"
    >
      {/* Иконка / превью — с поддержкой картинки и фолбэком на эмодзи */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden rounded-t-2xl group-hover:from-primary-50 group-hover:to-accent-50 transition-colors">
        <div className="aspect-video flex items-center justify-center p-6">
          {service.imageUrl ? (
            <img 
              src={service.imageUrl} 
              alt={service.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="text-6xl text-gray-400">
              {service.icon}
            </div>
          )}
        </div>
      </div>
            
      {/* Контент */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">
          {service.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {service.description}
        </p>
        
        {/* Теги */}
        <div className="flex flex-wrap gap-2 mb-6">
          {service.features.slice(0, 2).map((feature, idx) => (
            <span 
              key={idx}
              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Цена + стрелка */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-gray-400 block mb-0.5">от</span>
            <span className="text-2xl font-extrabold text-primary-600">
              {service.priceFrom.toLocaleString('ru-RU')}
            </span>
            <span className="text-sm text-gray-500 ml-1">₽</span>
          </div>
          <span className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}