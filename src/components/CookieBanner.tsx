// ========================================
// File: src/components/CookieBanner.tsx
// Description: Уведомление о cookies (152-ФЗ)
// ========================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Показываем баннер, если пользователь ещё не согласился
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Задержка 2 секунды, чтобы не мешать загрузке
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-t border-gray-700 shadow-2xl animate-slide-up">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-200 text-center sm:text-left">
            <p>
              Мы используем{' '}
              <Link 
                href="/policy" 
                className="text-primary-400 hover:text-primary-300 underline"
              >
                cookies
              </Link>{' '}
              для улучшения работы сайта и анализа трафика. Продолжая использовать сайт, вы соглашаетесь с{' '}
              <Link 
                href="/policy" 
                className="text-primary-400 hover:text-primary-300 underline"
              >
                политикой конфиденциальности
              </Link>.
            </p>
          </div>
          <button
            onClick={handleAccept}
            className="btn btn-accent px-6 py-2 text-sm whitespace-nowrap flex-shrink-0"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}