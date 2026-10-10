// ========================================
// File: src/components/InfoTip.tsx
// Description: Кружок "?" → компактная модалка со скроллом
//              Закрытие: клик ВНЕ окна, крестик, Esc. Прокрутка внутри не закрывает.
// Project: ООО «АТР-СЕРВИС»
// ========================================

'use client';

import { useEffect, useState } from 'react';

interface InfoTipProps {
  text: string;
  label?: string;
}

export default function InfoTip({ text, label = 'Пояснение к цене' }: InfoTipProps) {
  const [open, setOpen] = useState(false);

  // 🔹 Блокируем прокрутку фона, пока модалка открыта
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // 🔹 Закрытие по Esc
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={label}
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-500 text-[10px] leading-none hover:border-primary-500 hover:text-primary-600 transition-colors flex-shrink-0"
      >
        ?
      </button>

      {open && (
        /* Оверлей: клик по нему закрывает модалку */
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          {/* Окно: stopPropagation — клики и прокрутка ВНУТРИ не закрывают */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            onClick={(e) => e.stopPropagation()}
            className="bg-white border-2 border-gray-300 rounded-xl shadow-2xl w-full max-w-sm md:max-w-md max-h-[70vh] flex flex-col overflow-hidden"
          >
            {/* 🔹 Нескроллящаяся шапка с крестиком */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <span className="font-bold text-sm text-gray-900">Условия расчёта</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
                className="text-gray-500 hover:text-gray-800 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 🔹 Скроллящееся тело: max-h ограничен, текст с абзацами */}
            <div className="overflow-y-auto px-4 py-3 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {text}
            </div>

            {/* 🔹 Нескроллящийся подвал-подсказка */}
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-[11px] text-gray-500 flex-shrink-0">
              Прокрутка — внутри окна. Закрытие — крестиком или кликом вне окна.
            </div>
          </div>
        </div>
      )}
    </>
  );
}