// ========================================
// Файл: src/components/AliceFAQBlock.tsx
// Описание: Интерактивный аккордеон для FAQ с анимацией
// Проект: ООО «АТР-СЕРВИС»
// ========================================

'use client'; // ✅ Обязательно: компонент использует useState

import { useState } from 'react';

interface AliceFAQBlockProps {
  question: string;
  answer: string;
  isAliceOptimized?: boolean;
}

export default function AliceFAQBlock({ question, answer, isAliceOptimized }: AliceFAQBlockProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200">
      {/* Кнопка-вопрос */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900 pr-4 leading-snug">
          {question}
        </span>
        
        {/* Стрелка с анимацией поворота */}
        <span className={`flex-shrink-0 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Ответ с плавной анимацией высоты */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`px-6 pb-6 text-gray-600 leading-relaxed ${isAliceOptimized ? 'border-t border-gray-100 pt-4 mt-2' : ''}`}>
          {answer}
        </div>
      </div>
    </div>
  );
}