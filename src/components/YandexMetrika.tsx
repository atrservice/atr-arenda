'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const METRIKA_ID = parseInt(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || '0', 10);

export default function YandexMetrika() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!METRIKA_ID || METRIKA_ID === 0) return;

    let initialized = false;

    const initMetrika = () => {
      if (initialized || (window as any).ym) return;
      initialized = true;

      (function(m, e, t, r, i, k, a) {
        m[i] = m[i] || function() { (m[i].a = m[i].a || []).push(arguments) };
        m[i].l = Date.now();
        for (var j = 0; j < document.scripts.length; j++) {
          if (document.scripts[j].src === r) { return; }
        }
        k = e.createElement(t), a = e.getElementsByTagName(t)[0], 
        k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
      })(
        window, document, 'script',
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
    };

    // Загрузка после первого взаимодействия (скролл/клик/тач)
    const events = ['scroll', 'click', 'touchstart', 'keydown'];
    const handleInteraction = () => {
      initMetrika();
      events.forEach(event => window.removeEventListener(event, handleInteraction));
    };

    events.forEach(event => window.addEventListener(event, handleInteraction, { once: true, passive: true }));

    // Fallback: если пользователь не взаимодействует — загружаем через 5 секунд
    setTimeout(initMetrika, 5000);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleInteraction));
    };
  }, []);

  useEffect(() => {
    if (!METRIKA_ID || !(window as any).ym) return;
    const fullUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    (window as any).ym(METRIKA_ID, 'hit', fullUrl);
  }, [pathname, searchParams]);

  return null;
}