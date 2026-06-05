// ========================================
// File: src/components/YandexMetrika.tsx
// Description: Компонент Яндекс.Метрики с отслеживанием переходов
// Project: ООО «АТР-СЕРВИС»
// Важно: Использует usePathname для отслеживания SPA-переходов
// ========================================

'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// 🔹 Исправление TypeScript ошибки: используем parseInt для обработки undefined
const METRIKA_ID = parseInt(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || '0', 10);

export default function YandexMetrika() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 🔹 Инициализация счётчика (один раз при загрузке)
  useEffect(() => {
    if (!METRIKA_ID || METRIKA_ID === 0) return;

    // Проверяем, не инициализирован ли уже счётчик
    if ((window as any).ym && (window as any).ym(METRIKA_ID, 'get', 'counter')) {
      return;
    }

    // Правильный код от Яндекса (с ssr:true для Next.js)
    // ✅ Исправлено: Date.now() вместо 1 * new Date()
    (function(m, e, t, r, i, k, a) {
      m[i] = m[i] || function() { (m[i].a = m[i].a || []).push(arguments) };
      m[i].l = Date.now(); // ← ИСПРАВЛЕНО: было 1 * new Date()
      for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) { return; }
      }
      k = e.createElement(t), a = e.getElementsByTagName(t)[0], 
      k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
    })(
      window, 
      document, 
      'script', 
      `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`, 
      'ym'
    );

    (window as any).ym(METRIKA_ID, 'init', {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: "dataLayer",
      referrer: document.referrer,
      url: window.location.href,
      accurateTrackBounce: true,
      trackLinks: true,
    });

    console.log(`✅ Яндекс.Метрика инициализирована (ID: ${METRIKA_ID})`);
  }, []);

  // 🔹 Отслеживание переходов между страницами (SPA-navigation)
  useEffect(() => {
    if (!METRIKA_ID || !(window as any).ym) return;

    const fullUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    
    // Отправляем хит о просмотре страницы
    (window as any).ym(METRIKA_ID, 'hit', fullUrl);
    
  }, [pathname, searchParams]);

  return null; // Компонент ничего не рендерит
}