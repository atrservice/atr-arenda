'use client';

// ========================================
// File: src/components/Tabs.tsx
// Description: Компонент вкладок
// Project: ООО «АТР-СЕРВИС»
// ========================================

import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: string;
  preview: string; // Краткий текст (2-3 строки)
  content: React.ReactNode; // Полный контент
}

interface TabsProps {
  tabs: Tab[];
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');
  const [expanded, setExpanded] = useState(false);

  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Вкладки */}
      <div className="flex border-b border-gray-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setExpanded(false);
            }}
            className={`flex-1 min-w-[120px] px-4 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Контент */}
      <div className="p-6">
        {/* Превью (2-3 строки) */}
        {!expanded && (
          <div className="relative">
            <p className="text-gray-700 leading-relaxed line-clamp-3">
              {currentTab?.preview}
            </p>
            <button
              onClick={() => setExpanded(true)}
              className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-semibold inline-flex items-center gap-1"
            >
              Показать полностью
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Полный контент */}
        {expanded && (
          <div className="animate-fade-in">
            {currentTab?.content}
            <button
              onClick={() => setExpanded(false)}
              className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-semibold inline-flex items-center gap-1"
            >
              Свернуть
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}