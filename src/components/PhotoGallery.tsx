'use client';

// ========================================
// File: src/components/PhotoGallery.tsx
// Description: Галерея фото техники с каруселью
// Project: ООО «АТР-СЕРВИС»
// ========================================

import { useState } from 'react';
import Image from 'next/image';

interface PhotoGalleryProps {
  mainImage: string;
  realPhotos: string[];
  alt: string;
}

export default function PhotoGallery({ mainImage, realPhotos, alt }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState(mainImage);
  const allPhotos = [mainImage, ...realPhotos];

  return (
    <div className="space-y-4">
      {/* Главное фото */}
      <div className="aspect-video relative overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={selectedPhoto}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />
      </div>

      {/* Миниатюры */}
      {allPhotos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allPhotos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPhoto(photo)}
              className={`relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                selectedPhoto === photo
                  ? 'border-primary-500 scale-105'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={photo}
                alt={`${alt} - фото ${idx + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}