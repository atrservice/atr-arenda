'use client';

// ========================================
// File: src/components/ImageCarousel.tsx
// Description: Карусель изображений с лайтбоксом
// Project: ООО «АТР-СЕРВИС»
// ========================================

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
  mainImage: string;
  images: string[];
  alt: string;
}

export default function ImageCarousel({ mainImage, images, alt }: ImageCarouselProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const allImages = [mainImage, ...images];

  // 🔹 Открыть лайтбокс
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // 🔹 Закрыть лайтбокс
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  // 🔹 Предыдущее изображение
  const prevImage = () => {
    setLightboxIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  // 🔹 Следующее изображение
  const nextImage = () => {
    setLightboxIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  // 🔹 Управление клавиатурой
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

  return (
    <>
      {/* 🔹 Главное изображение */}
      <div 
        className="aspect-video relative overflow-hidden rounded-2xl bg-gray-100 cursor-zoom-in"
        onClick={() => openLightbox(0)}
      >
        <Image
          src={selectedImage}
          alt={alt}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
          Нажмите для увеличения
        </div>
      </div>

      {/* 🔹 Карусель миниатюр */}
      {allImages.length > 1 && (
        <div className="mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {allImages.map((image, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedImage(image);
                  openLightbox(idx);
                }}
                className={`relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === image
                    ? 'border-primary-500 scale-105'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={image}
                  alt={`${alt} - фото ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 ЛАЙТБОКС (увеличенное изображение) */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Кнопка закрытия */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Кнопка назад */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Кнопка вперед */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Изображение */}
          <div 
            className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[lightboxIndex]}
              alt={`${alt} - фото ${lightboxIndex + 1}`}
              width={1200}
              height={800}
              className="object-contain max-h-[90vh]"
              priority
            />
          </div>

          {/* Счетчик */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
            {lightboxIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </>
  );
}