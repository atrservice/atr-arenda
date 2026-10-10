'use client';

// ========================================
// File: src/components/PriceCalculator.tsx
// Description: Калькулятор с поиском города и геолокацией
// Project: ООО «АТР-СЕРВИС»
// ========================================

'use client';

import { useState, useEffect, useMemo } from 'react';
import { getCities, calculatePrice, formatPrice } from '@/lib/pricing';
import pricingData from '@/data/pricing.json';
import { TAX_CONFIG, roundUpToHundreds } from '@/lib/constants';
import SearchableSelect from './SearchableSelect';

interface PriceCalculatorProps {
  defaultService?: string;
  defaultCity?: string;
  defaultModel?: string;  // ✅ ДОБАВЛЕНО
}

export default function PriceCalculator({
  defaultService,
  defaultCity,
  defaultModel,  // ✅ ДОБАВЛЕНО в деструктуризацию
}: PriceCalculatorProps) {
  const cities = useMemo(() => getCities(), []);
  const services = pricingData.services;

  const [selectedService, setSelectedService] = useState(defaultService || services[0]?.slug || '');
  const [selectedModel, setSelectedModel] = useState(defaultModel || ''); // ✅ ИСПОЛЬЗУЕМ defaultModel
  const [selectedCity, setSelectedCity] = useState(defaultCity || '');
  const [geoCity, setGeoCity] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  // 🔹 Геолокация пользователя
  useEffect(() => {
    if (defaultCity || geoCity) return;

    const detectCity = async () => {
      setGeoLoading(true);
      try {
        // Получаем IP и город
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const userCityName = data.city?.toLowerCase() || '';

        // Ищем совпадение в списке городов
        const match = cities.find(
          (c) =>
            c.name.toLowerCase() === userCityName ||
            c.name.toLowerCase().includes(userCityName) ||
            userCityName.includes(c.name.toLowerCase())
        );

        if (match) {
          setGeoCity(match.slug);
          setSelectedCity(match.slug);
        } else {
          // Fallback — Москва
          setGeoCity('moskva');
        }
      } catch (error) {
        console.warn('Геолокация недоступна:', error);
      } finally {
        setGeoLoading(false);
      }
    };

    detectCity();
  }, [cities, defaultCity, geoCity]);

  // 🔹 Опции для селекта городов
  const cityOptions = useMemo(() => {
    return cities.map((city) => ({
      value: city.slug,
      label: city.name,
      sublabel: `${city.distance_km} км от МКАД • ${city.highway}`,
    }));
  }, [cities]);

  // 🔹 Текущие данные
  const currentService = services.find((s: any) => s.slug === selectedService);
  const currentCity = cities.find((c) => c.slug === selectedCity);
  const currentModel = currentService?.models.find((m: any) => m.slug === selectedModel);

  // 🔹 Автовыбор первой модели (ИСПРАВЛЕНО: не трогает переданный defaultModel)
  useEffect(() => {
    if (currentService?.models?.length > 0 && !selectedModel) {
      setSelectedModel(currentService.models[0].slug);
    }
  }, [currentService, selectedModel]);

  // 🔹 Расчёт цены
  const calculation = useMemo(() => {
    if (!currentModel || !currentCity) return null;
    return calculatePrice(selectedService, selectedModel, currentCity.distance_km);
  }, [selectedService, selectedModel, currentCity, currentModel]);

  // 🔹 Три типа цен
  const prices = useMemo(() => {
    if (!calculation) return null;
    const base = calculation.totalPrice;
    return {
      cash: roundUpToHundreds(base),
      withVat: roundUpToHundreds(base * TAX_CONFIG.VAT_MULTIPLIER),
      forIP: roundUpToHundreds(base / TAX_CONFIG.IP_USN_DIVISOR),
    };
  }, [calculation]);

  // 🔹 Отправка цели в Метрику
  useEffect(() => {
    if (calculation && typeof window !== 'undefined' && (window as any).ym) {
      (window as any).ym(
        parseInt(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || '0', 10),
        'reachGoal',
        'calculator_use'
      );
    }
  }, [calculation]);

  const handleServiceChange = (slug: string) => {
    setSelectedService(slug);
    setSelectedModel('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">
        🧮 Калькулятор стоимости
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Рассчитайте предварительную стоимость аренды с учётом подачи
      </p>

      {/* 🔹 Селекторы */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* 1. Услуга */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            1. Тип техники
          </label>
          <select
            value={selectedService}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="input w-full"
          >
            {services.map((service: any) => (
              <option key={service.slug} value={service.slug}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Модель */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            2. Модель
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="input w-full"
          >
            <option value="">— Выберите модель —</option>
            {currentService?.models.map((model: any) => (
              <option key={model.slug} value={model.slug}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Город с поиском */}
        <SearchableSelect
          id="city-select"
          label="3. Город подачи"
          options={cityOptions}
          value={selectedCity}
          onChange={setSelectedCity}
          placeholder={geoLoading ? '🔍 Определяем город...' : '📍 Начните вводить город...'}
        />
      </div>

      {/* 🔹 Индикатор геолокации */}
      {geoCity && !defaultCity && (
        <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
          <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Автоматически определён ваш город
        </div>
      )}

      {/* 🔹 Результат */}
      {prices && calculation && currentCity && currentModel && (
        <div className="mt-8 animate-fade-in">
          {/* Информация */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Техника</div>
              <div className="font-bold text-gray-900 text-sm">{currentModel.name}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Город</div>
              <div className="font-bold text-gray-900 text-sm">{currentCity.name}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Расстояние</div>
              <div className="font-bold text-gray-900 text-sm">{currentCity.distance_km} км</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Подача</div>
              <div className="font-bold text-sm">
                {calculation.isWithinFreeZone ? (
                  <span className="text-green-600">Бесплатно</span>
                ) : (
                  <span className="text-orange-600">{formatPrice(calculation.deliveryCost)} ₽</span>
                )}
              </div>
            </div>
          </div>

          {/* 🔹 ТРИ ТИПА ЦЕН */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border-2 border-gray-200">
              <div className="text-sm text-gray-600 mb-1">💵 Наличный расчёт</div>
              <div className="text-xs text-gray-500 mb-3">Для физических лиц</div>
              <div className="text-3xl font-extrabold text-gray-900">
                {formatPrice(prices.cash)} ₽
              </div>
              <div className="text-xs text-gray-500 mt-1">за смену (7+1 ч)</div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-orange-50 rounded-xl p-5 border-2 border-primary-300 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                ПОПУЛЯРНО
              </div>
              <div className="text-sm text-gray-700 mb-1">💼 Безналичный с НДС</div>
              <div className="text-xs text-gray-500 mb-3">Для ООО на ОСНО (НДС {TAX_CONFIG.VAT_RATE}%)</div>
              <div className="text-3xl font-extrabold text-primary-700">
                {formatPrice(prices.withVat)} ₽
              </div>
              <div className="text-xs text-gray-500 mt-1">за смену (7+1 ч)</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
              <div className="text-sm text-gray-600 mb-1">🏢 Для ИП (УСН)</div>
              <div className="text-xs text-gray-500 mb-3">Без НДС (упрощёнка {TAX_CONFIG.IP_USN_RATE}%)</div>
              <div className="text-3xl font-extrabold text-blue-700">
                {formatPrice(prices.forIP)} ₽
              </div>
              <div className="text-xs text-gray-500 mt-1">за смену (7+1 ч)</div>
            </div>
          </div>

          {/* 🔹 CTA — компактный, внутри калькулятора */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/kontakty#form"
              className="btn btn-accent text-base flex-1 justify-center shadow-glow hover:shadow-glow-lg"
            >
              📞 Заказать со скидкой
            </a>
            <a
              href={`tel:${process.env.NEXT_PUBLIC_PHONE_RAW || '79262097373'}`}
              className="btn border-2 border-gray-300 text-gray-700 hover:bg-gray-50 flex-1 justify-center"
            >
              Позвонить
            </a>
          </div>

          {/* Дисклеймер */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>ℹ️ Предварительный расчёт.</strong> Расстояние {currentCity.distance_km} км указано от МКАД до центра г. {currentCity.name}. Точная стоимость рассчитывается после подтверждения заявки.
            </p>
          </div>
        </div>
      )}

      {/* Заглушка */}
      {!calculation && (
        <div className="mt-8 p-6 bg-gray-50 rounded-xl text-center">
          <p className="text-gray-500">
            Выберите модель техники и город для расчёта стоимости
          </p>
        </div>
      )}
    </div>
  );
}