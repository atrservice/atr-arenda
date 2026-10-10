// ========================================
// File: src/components/InfiniteCardsCarousel.tsx
// Description: Бесконечная карусель карточек (свайп/драг с инерцией)
// Project: ООО «АТР-СЕРВИС»
// ========================================

'use client';

import { useRef, useState, useLayoutEffect, useCallback } from 'react';

interface InfiniteCardsCarouselProps {
  perCopy: number;          // сколько карточек в одной копии
  children: React.ReactNode; // слоты-обёртки с карточками (3 копии)
  ariaLabel?: string;
}

const GAP = 24; // gap-6

export default function InfiniteCardsCarousel({ perCopy, children, ariaLabel }: InfiniteCardsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [arrows, setArrows] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flingRaf = useRef<number | null>(null);
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0, moved: 0, lastX: 0, lastT: 0, v: 0 });

  const loopable = perCopy >= 2;

  const poke = useCallback(() => {
    setArrows(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setArrows(false), 1500);
  }, []);

  useLayoutEffect(() => {
    if (!loopable) return;
    const el = scrollRef.current;
    const mid = el?.children[perCopy] as HTMLElement | undefined;
    if (el && mid) el.scrollLeft = mid.offsetLeft;
  }, [perCopy, loopable]);

  const normalize = useCallback(() => {
    if (!loopable) return;
    const el = scrollRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement;
    const mid = el.children[perCopy] as HTMLElement;
    const last = el.children[perCopy * 2] as HTMLElement;
    if (!mid || !last) return;
    const copyWidth = mid.offsetLeft - first.offsetLeft;
    if (copyWidth < el.clientWidth) return; // кольцо не помещается — не прыгаем
    if (el.scrollLeft + el.clientWidth <= mid.offsetLeft) el.scrollLeft += copyWidth;
    else if (el.scrollLeft >= last.offsetLeft) el.scrollLeft -= copyWidth;
  }, [perCopy, loopable]);

  const updateActive = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement;
    const step = first.offsetWidth + GAP;
    const idx = Math.round(el.scrollLeft / step);
    setActiveIndex(((idx % perCopy) + perCopy) % perCopy);
  }, [perCopy]);

  const onScroll = () => { normalize(); updateActive(); poke(); };

  const snapNearest = () => {
    const el = scrollRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement;
    const step = first.offsetWidth + GAP;
    el.scrollTo({ left: Math.round(el.scrollLeft / step) * step, behavior: 'smooth' });
  };

  const nudge = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement;
    const step = first.offsetWidth + GAP;
    el.scrollTo({ left: (Math.round(el.scrollLeft / step) + dir) * step, behavior: 'smooth' });
  };

  // 🔹 Драг мышью + инерция (как у фото-карусели)
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
      let v = Math.max(-60, Math.min(60, -st.v * 16.7));
      const frame = () => {
        v *= 0.95;
        el.scrollLeft += v;
        if (Math.abs(v) > 0.4) flingRaf.current = requestAnimationFrame(frame);
        else { el.style.scrollSnapType = ''; snapNearest(); }
      };
      if (Math.abs(v) > 2) flingRaf.current = requestAnimationFrame(frame);
      else { el.style.scrollSnapType = ''; snapNearest(); }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up, { once: true });
  };

  // 🔹 После протяжки клик по карточке/ссылке гасим
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved >= 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const arrowCls = (visible: boolean) =>
    `absolute top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/40 hover:bg-black/60 text-white p-2 md:p-3 transition-opacity duration-300 ` +
    `md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:pointer-events-auto ` +
    (visible ? 'opacity-100' : 'opacity-0 pointer-events-none');

  return (
    <div className="group relative">
      <div
        ref={scrollRef}
        role="region"
        aria-label={ariaLabel || 'Карусель карточек'}
        onPointerDown={onPointerDown}
        onScroll={onScroll}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 cursor-grab select-none scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {children}
      </div>

      {loopable && (
        <>
          <button type="button" onClick={() => nudge(-1)} aria-label="Предыдущие карточки" className={`${arrowCls(arrows)} left-2`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button type="button" onClick={() => nudge(1)} aria-label="Следующие карточки" className={`${arrowCls(arrows)} right-2`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="flex justify-center gap-1.5 mt-3">
            {Array.from({ length: perCopy }).map((_, idx) => (
              <span key={idx} className={`h-1.5 rounded-full transition-all ${idx === activeIndex ? 'w-6 bg-primary-500' : 'w-1.5 bg-gray-300'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}