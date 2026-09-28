'use client';

// ========================================
// File: src/components/AutoCarousel.tsx
// Description: Автопрокручиваемая карусель с лайтбоксом
// Project: ООО «АТР-СЕРВИС»
// ========================================

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface AutoCarouselProps {
  images: string[];
  alt: string;
  autoPlayInterval?: number; // мс
}

export default function AutoCarousel({
  images,
  alt,
  autoPlayInterval = 4000, // 4 секунды по умолчанию
}: AutoCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🔹 Автопрокрутка
  const scrollToNext = useCallback(() => {
    if (!scrollRef.current || isPaused || images.length <= 3) return;

    const container = scrollRef.current;
    const firstChild = container.firstElementChild as HTMLElement;
    if (!firstChild) return;

    const itemWidth = firstChild.offsetWidth + 12; // ширина + gap (12px = gap-3)
    const maxScroll = container.scrollWidth - container.clientWidth;

    // Если дошли до конца — плавно возвращаемся в начало
    if (container.scrollLeft >= maxScroll - 10) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }
  }, [isPaused, images.length]);

  // 🔹 Запуск автопрокрутки
  useEffect(() => {
    if (images.length <= 3) return; // Если фото 3 или меньше — автопрокрутка не нужна

    intervalRef.current = setInterval(scrollToNext, autoPlayInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [scrollToNext, autoPlayInterval, images.length]);

  // 🔹 Остановка при наведении
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // 🔹 Управление лайтбоксом
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // 🔹 Клавиатура
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  if (images.length === 0) return null;

  // 🔹 Показываем максимум 3 фото в карусели (остальные в лайтбоксе)
  const visibleImages = images.slice(0, 3);

  return (
    <>
      {/* 🔹 Карусель — только 3 фото */}
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {visibleImages.map((image, idx) => (
            <button
              key={idx}
              onClick={() => openLightbox(idx)}
              className="relative flex-shrink-0 w-full md:w-[calc(33.333%-8px)] max-w-[400px] h-48 md:h-64 rounded-xl overflow-hidden snap-start group cursor-zoom-in transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <Image
                src={image}
                alt={`${alt} - фото ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              {/* Оверлей при наведении */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Индикатор автопрокрутки */}
        {images.length > 3 && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
            {isPaused ? '⏸ Пауза' : '▶ Авто'}
          </div>
        )}

        {/* Индикатор количества фото */}
        {images.length > 3 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
            {visibleImages.length} из {images.length} фото
          </div>
        )}
      </div>

      {/*  ЛАЙТБОКС с полупрозрачным фоном */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Кнопка закрытия */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
            aria-label="Закрыть"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Кнопка назад */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
            aria-label="Предыдущее"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Кнопка вперёд */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
            aria-label="Следующее"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Изображение */}
          <div
            className="relative max-w-6xl max-h-[85vh] w-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${alt} - фото ${lightboxIndex + 1}`}
              width={1200}
              height={800}
              className="object-contain max-h-[85vh] rounded-xl shadow-2xl"
              priority
            />
          </div>

          {/* Счётчик */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}

      {/* Скрываем скроллбар */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}