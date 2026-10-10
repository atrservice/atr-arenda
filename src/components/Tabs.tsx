// ========================================
// File: src/components/Tabs.tsx
// Description: Вкладки с превью и полным контентом (мобильные без наложений)
// Project: ООО «АТР-СЕРВИС»
// ========================================

'use client';

import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: string;
  preview: string;
  content: React.ReactNode;
}

export default function Tabs({ tabs }: { tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? '');
  const [expanded, setExpanded] = useState(false);
  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* 🔹 Шапка: на мобильных — скролл вбок, мелкий шрифт, без наложений */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => { setActiveTab(tab.id); setExpanded(false); }}
            className={`flex-1 min-w-max sm:min-w-0 px-3 sm:px-4 py-3 sm:py-4 text-[11px] leading-4 sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab.icon && <span className="mr-1 sm:mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-6">
        {!expanded ? (
          <div>
            <p className="text-gray-700 leading-relaxed line-clamp-3">{currentTab?.preview}</p>
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-semibold inline-flex items-center gap-1"
            >
              Показать полностью
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        ) : (
          <div key={currentTab?.id} className="animate-fade-in">
            {currentTab?.content}
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-semibold inline-flex items-center gap-1"
            >
              Свернуть
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}