// ========================================
// File: src/components/EquipmentCard.tsx
// Description: Единая карточка техники (новая схема equipment.json)
// Project: ООО «АТР-СЕРВИС»
// ========================================

import Link from 'next/link';
import Image from 'next/image';
import type { Equipment } from '@/lib/data';

interface EquipmentCardProps {
  item: Equipment;
}

// 🔹 Собираем строки характеристик из того, что есть в данных
function getSpecRows(item: Equipment): Array<{ label: string; value: string }> {
  const s = (item.specs || {}) as Record<string, any>;
  const rows: Array<{ label: string; value: string }> = [];

  if (s.maxHeight) rows.push({ label: 'Высота подъёма:', value: `${s.maxHeight} м` });
  if (s.maxReach) rows.push({ label: 'Вылет стрелы:', value: `${s.maxReach} м` });
  if (s.basketCapacity) rows.push({ label: 'Грузоподъёмность:', value: `${s.basketCapacity} кг` });
  if (s.basketSize) rows.push({ label: 'Люлька:', value: s.basketSize });
  if (s.rotationAngle) rows.push({ label: 'Поворот платформы:', value: `${s.rotationAngle}°` });
  if (s.chassis) rows.push({ label: 'Шасси:', value: s.chassis });
  if (s.standard) rows.push({ label: 'Стандарт:', value: s.standard });
  if (s.lights) rows.push({ label: 'Светосигнализация:', value: s.lights });
  if (s.driver_experience) rows.push({ label: 'Опыт водителя:', value: s.driver_experience });

  return rows.slice(0, 3);
}

export default function EquipmentCard({ item }: EquipmentCardProps) {
  const rows = getSpecRows(item);

  return (
    <Link href={`/tekhnika/${item.slug}`} className="card card-hover p-6 flex flex-col group block">
      {/* 🔹 Изображение техники — во всю ширину карточки, отступы как у текста */}
      <div className="relative w-full aspect-video mb-4 rounded-xl overflow-hidden bg-gray-50">
        {item.mainImage ? (
          <Image
            src={item.mainImage}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) calc(100vw - 64px), (max-width: 1200px) calc(50vw - 80px), calc(33vw - 80px)"
          />
        ) : (
          /* Фолбэк-эмодзи по центру, если фото нет */
          <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400">
            🚜
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold mb-2 text-gray-900">{item.name}</h3>

      {rows.length > 0 && (
        <dl className="space-y-2 text-sm text-gray-600 mb-4">
          {rows.map((row, idx) => (
            <div key={idx} className="flex justify-between">
              <dt className="text-gray-500">{row.label}</dt>
              <dd className="font-medium text-gray-900">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* Цена + ссылка на страницу техники */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
        <div>
          <span className="text-xs text-gray-500 block mb-0.5">от</span>
          <span className="text-2xl font-extrabold text-primary-600">
            {(item.basePrice ?? 0).toLocaleString('ru-RU')}
          </span>
          <span className="text-sm text-gray-500 ml-1">₽/смена</span>
        </div>
        <span className="inline-flex items-center gap-1 text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
          Подробнее
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}