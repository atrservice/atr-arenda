'use client';

// ========================================
// File: src/components/SearchableSelect.tsx
// Description: Выпадающий список с поиском и динамической фильтрацией
// Project: ООО «АТР-СЕРВИС»
// ========================================

import { useState, useRef, useEffect, useMemo } from 'react';

interface Option {
  value: string;
  label: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
  ariaLabel?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Начните вводить...',
  label,
  id,
  ariaLabel,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 🔹 Фильтрация по поиску
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const query = search.toLowerCase().trim();
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(query) ||
      opt.sublabel?.toLowerCase().includes(query)
    );
  }, [options, search]);

  // 🔹 Выбранный элемент
  const selectedOption = options.find((opt) => opt.value === value);

  // 🔹 Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔹 Фокус на инпут при открытии
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 🔹 Навигация клавиатурой
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearch('');
    }
    if (e.key === 'Enter' && filteredOptions.length > 0) {
      onChange(filteredOptions[0].value);
      setIsOpen(false);
      setSearch('');
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Кнопка открытия */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className="input w-full text-left flex items-center justify-between bg-white"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Выпадающий список */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-72 overflow-hidden flex flex-col">
          {/* Поиск */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Поиск..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          {/* Список опций */}
          <ul
            className="overflow-y-auto flex-1"
            role="listbox"
            aria-label={label || 'Список'}
          >
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-500 text-center">
                Ничего не найдено
              </li>
            ) : (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  role="option"
                  aria-selected={option.value === value}
                  className={`px-4 py-2.5 cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${
                    option.value === value
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'hover:bg-gray-50 text-gray-900'
                  }`}
                >
                  <div className="text-sm">{option.label}</div>
                  {option.sublabel && (
                    <div className="text-xs text-gray-500 mt-0.5">{option.sublabel}</div>
                  )}
                </li>
              ))
            )}
          </ul>

          {/* Счётчик */}
          {search && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
              Найдено: {filteredOptions.length} из {options.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}