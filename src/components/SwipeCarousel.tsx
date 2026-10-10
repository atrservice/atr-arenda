// ========================================
// File: src/components/SwipeCarousel.tsx
// Description: Бесконечная свайп-карусель с инерцией и лайтбоксом
// Project: ООО «АТР-СЕРВИС»
// ========================================

'use client';

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import Image from 'next/image';

interface SwipeCarouselProps {
  images: string[];
  alt: string;
}

const GAP = 12; // совпадает с gap-3

export default function SwipeCarousel({ images, alt }: SwipeCarouselProps) {
  const n = images.length;
  const loopable = n >= 2;
  // 🔹 Три копии для бесконечного кольца (при n > 1)
  const extended = n > 1 ? [...images, ...images, ...images] : images;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [carArrows, setCarArrows] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lbArrows, setLbArrows] = useState(true);

  const carTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lbTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flingRaf = useRef<number | null>(null);
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0, moved: 0, lastX: 0, lastT: 0, v: 0 });

  const pokeCar = useCallback(() => {
    setCarArrows(true);
    if (carTimer.current) clearTimeout(carTimer.current);
    carTimer.current = setTimeout(() => setCarArrows(false), 1500);
  }, []);

  const pokeLb = useCallback(() => {
    setLbArrows(true);
    if (lbTimer.current) clearTimeout(lbTimer.current);
    lbTimer.current = setTimeout(() => setLbArrows(false), 1500);
  }, []);

  // 🔹 Стартовая позиция — начало средней копии
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || n < 2) return;
    const mid = el.children[n] as HTMLElement | undefined;
    if (mid) el.scrollLeft = mid.offsetLeft;
  }, [n]);

  // 🔹 Нормализация: замкнём кольцо, когда вьюпорт ушёл в крайнюю копию
  const normalize = useCallback(() => {
    const el = scrollRef.current;
    if (!el || n < 2) return;
    const first = el.children[0] as HTMLElement;
    const mid = el.children[n] as HTMLElement;
    const last = el.children[2 * n] as HTMLElement;
    if (!mid || !last) return;
    const copyWidth = mid.offsetLeft - first.offsetLeft;
    if (el.scrollLeft + el.clientWidth <= mid.offsetLeft) el.scrollLeft += copyWidth;
    else if (el.scrollLeft >= last.offsetLeft) el.scrollLeft -= copyWidth;
  }, [n]);

  const updateActive = useCallback(() => {
    const el = scrollRef.current;
    if (!el || n < 1) return;
    const first = el.children[0] as HTMLElement;
    const step = first.offsetWidth + GAP;
    const idx = Math.round(el.scrollLeft / step);
    setActiveIndex(((idx % n) + n) % n);
  }, [n]);

  const onScroll = () => {
    normalize();
    updateActive();
    pokeCar();
  };

  // 🔹 Доводка до ближайшего фото
  const snapNearest = () => {
    const el = scrollRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement;
    const step = first.offsetWidth + GAP;
    el.scrollTo({ left: Math.round(el.scrollLeft / step) * step, behavior: 'smooth' });
  };

  // 🔹 Стрелки: шаг на ±1 фото (кольцо замкнуто)
  const nudge = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement;
    const step = first.offsetWidth + GAP;
    el.scrollTo({ left: (Math.round(el.scrollLeft / step) + dir) * step, behavior: 'smooth' });
  };

  // 🔹 Драг мышью + fling-инерция (десктоп). Без pointer capture — клики работают!
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = scrollRef.current;
    if (!el) return;
    if (flingRaf.current) cancelAnimationFrame(flingRaf.current);
    drag.current = { down: true, startX: e.pageX, scrollLeft: el.scrollLeft, moved: 0, lastX: e.pageX, lastT: performance.now(), v: 0 };
    el.style.scrollSnapType = 'none';
    el.style.cursor = 'grabbing';

    const move = (ev: PointerEvent) => {
      const st = drag.current;
      if (!st.down) return;
      const dx = ev.pageX - st.startX;
      st.moved = Math.max(st.moved, Math.abs(dx));
      el.scrollLeft = st.scrollLeft - dx;
      const now = performance.now();
      const dt = now - st.lastT;
      if (dt > 0) st.v = 0.8 * st.v + 0.2 * ((ev.pageX - st.lastX) / dt);
      st.lastX = ev.pageX;
      st.lastT = now;
    };

    const up = () => {
      window.removeEventListener('pointermove', move);
      const st = drag.current;
      if (!st.down) return;
      st.down = false;
      el.style.cursor = 'grab';
      // Инерция: скорость указателя → скорость ленты, трение 0.95/кадр
      let v = Math.max(-60, Math.min(60, -st.v * 16.7));
      const frame = () => {
        v *= 0.95;
        el.scrollLeft += v;
        if (Math.abs(v) > 0.4) flingRaf.current = requestAnimationFrame(frame);
        else {
          el.style.scrollSnapType = '';
          snapNearest();
        }
      };
      if (Math.abs(v) > 2) flingRaf.current = requestAnimationFrame(frame);
      else {
        el.style.scrollSnapType = '';
        snapNearest();
      }
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up, { once: true });
  };

  // 🔹 Лайтбокс
  const openLightbox = (idx: number) => {
    setLightboxIndex(((idx % n) + n) % n);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
    pokeLb();
  };
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  }, []);
  const prev = useCallback(() => { setLightboxIndex((i) => (i - 1 + n) % n); pokeLb(); }, [n, pokeLb]);
  const next = useCallback(() => { setLightboxIndex((i) => (i + 1) % n); pokeLb(); }, [n, pokeLb]);

  const touch = useRef({ x: 0, y: 0 });
  const onTouchStart = (e: React.TouchEvent) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev();
    else if (dy > 80 && Math.abs(dy) > Math.abs(dx)) closeLightbox();
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [lightboxOpen, closeLightbox, prev, next]);

  if (!n) return null;

  const arrowCls = (visible: boolean) =>
    `absolute top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/40 hover:bg-black/60 text-white p-2 md:p-3 transition-opacity duration-300 ` +
    `md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:pointer-events-auto ` +
    (visible ? 'opacity-100' : 'opacity-0 pointer-events-none');

  return (
    <>
      {/* 🔹 ЛЕНТА (3 копии = бесконечное кольцо) */}
      <div className="group relative">
        <div
          ref={scrollRef}
          onPointerDown={onPointerDown}
          onScroll={onScroll}
          onDragStart={(e) => e.preventDefault()}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 cursor-grab select-none scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {extended.map((src, idx) => {
            // Каноническая копия — средняя (или единственная)
            const isCanonical = !loopable || (idx >= n && idx < 2 * n);
            // LCP-кадр — первое фото канонической копии
            const isLCP = isCanonical && (idx % n) === 0;

            return (
              <button
                key={`${idx}-${src}`}
                type="button"
                onClick={() => { if (drag.current.moved < 6) openLightbox(idx); }}
                tabIndex={isCanonical ? 0 : -1}
                aria-hidden={!isCanonical}
                className="relative flex-shrink-0 w-[85%] sm:w-[60%] md:w-[45%] lg:w-[32%] aspect-[4/3] snap-center rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
                aria-label={isCanonical ? `Открыть фото ${(idx % n) + 1}` : undefined}
              >
                <Image
                  src={src}
                  alt={isCanonical ? `${alt} — фото ${(idx % n) + 1}` : ''}
                  fill
                  priority={isLCP}
                  loading={isLCP ? undefined : 'lazy'}
                  className="object-contain"
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 60vw, 32vw"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>

        {/* Стрелки-оверлеи */}
        {n > 1 && (
          <>
            <button type="button" onClick={() => nudge(-1)} aria-label="Предыдущее фото" className={`${arrowCls(carArrows)} left-2`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button type="button" onClick={() => nudge(1)} aria-label="Следующее фото" className={`${arrowCls(carArrows)} right-2`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}

        {/* Точки (нормализованный индекс) */}
        {n > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {images.map((_, idx) => (
              <span key={idx} className={`h-1.5 rounded-full transition-all ${idx === activeIndex ? 'w-6 bg-primary-500' : 'w-1.5 bg-gray-300'}`} />
            ))}
          </div>
        )}
      </div>

      {/* 🔹 ЛАЙТБОКС */}
      {lightboxOpen && (
        <div
          className="group fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col"
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center justify-between px-4 py-3" onClick={(e) => e.stopPropagation()}>
            <span className="text-white/80 text-sm">{lightboxIndex + 1} / {n}</span>
            <button onClick={closeLightbox} className="text-white bg-white/10 hover:bg-white/20 rounded-full p-2" aria-label="Закрыть">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 relative" onClick={(e) => e.stopPropagation()}>
            <Image src={images[lightboxIndex]} alt={`${alt} — фото ${lightboxIndex + 1}`} fill className="object-contain" sizes="100vw" priority />
            <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Предыдущее фото" className={`${arrowCls(lbArrows)} left-2 md:left-6`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Следующее фото" className={`${arrowCls(lbArrows)} right-2 md:right-6`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}