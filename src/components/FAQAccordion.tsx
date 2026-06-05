// ========================================
// File: src/components/FAQAccordion.tsx
// Description: Аккордеон с вопросами/ответами для FAQ
// Project: ООО «АТР-СЕРВИС»
// Особенности: плавная анимация, доступность (a11y)
// ========================================

'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  aliceOptimized?: boolean;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        
        return (
          <div
            key={index}
            className="card overflow-hidden border border-gray-100"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-semibold text-gray-900 text-base md:text-lg">
                {item.question}
              </span>
              <span
                className={`flex-shrink-0 w-6 h-6 flex items-center justify-center text-primary-600 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>

            <div
              id={`faq-answer-${index}`}
              role="region"
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-5 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}