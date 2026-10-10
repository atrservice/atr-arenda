// ========================================
// File: src/components/InfoTip.tsx
// Description: Кружок "?" → маленькая модалка с пояснением (закрытие по любому тапу)
// Project: ООО «АТР-СЕРВИС»
// ========================================

'use client';

import { useState } from 'react';

interface InfoTipProps {
  text: string;
  label?: string;
}

export default function InfoTip({ text, label = 'Пояснение к цене' }: InfoTipProps) {
  const [open, setOpen] = useState(false);

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
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6"
          onClick={() => setOpen(false)} // любой тап по экрану закрывает
        >
          {/* Рамка-контур, чтобы текст не сливался с страницей */}
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white border-2 border-gray-300 rounded-xl shadow-2xl p-4 w-full max-w-xs text-sm text-gray-700 leading-relaxed"
          >
            {text}
          </div>
        </div>
      )}
    </>
  );
}