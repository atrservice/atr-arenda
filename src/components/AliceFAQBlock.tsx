// ========================================
// Файл: src/components/AliceFAQBlock.tsx
// Описание: Компонент вопроса-ответа, оптимизированный для Алисы
// Проект: АТР-СПЕЦАРЕНДА
// ========================================

'use client';

import { useState } from 'react';

interface AliceFAQBlockProps {
  question: string;
  answer: string;
  isAliceOptimized?: boolean;
}

export default function AliceFAQBlock({ 
  question, 
  answer, 
  isAliceOptimized = false 
}: AliceFAQBlockProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Для Алисы: первый абзац (до первой точки) — прямой ответ
  const directAnswer = isAliceOptimized 
    ? answer.split('.').slice(0, 2).join('.') + '.'
    : answer;

  return (
    <details 
      className="group bg-white rounded-lg border border-gray-200 p-4 cursor-pointer"
      itemScope 
      itemType="https://schema.org/Question"
    >
      <summary 
        className="font-semibold text-lg flex justify-between items-center list-none"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <span itemProp="name">{question}</span>
        <span className="text-primary transition-transform group-open:rotate-180">
          ▼
        </span>
      </summary>
      
      <div 
        className="mt-3 text-gray-700 faq-answer"
        itemScope 
        itemType="https://schema.org/Answer"
      >
        <p itemProp="text">
          {isAliceOptimized ? (
            <>
              <strong className="text-primary">{directAnswer}</strong>
              <br /><br />
              {answer.replace(directAnswer, '').trim()}
            </>
          ) : (
            answer
          )}
        </p>
      </div>
    </details>
  );
}