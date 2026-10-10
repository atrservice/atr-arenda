'use client';

// ========================================
// File: src/components/PriceCalculator.tsx
// Description: Калькулятор с поиском города, геолокацией и единым юридическим тултипом
// Project: ООО «АТР-СЕРВИС»
// ========================================

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getCities, calculatePrice, formatPrice } from '@/lib/pricing';
import pricingData from '@/data/pricing.json';
import { TAX_CONFIG, roundUpToHundreds } from '@/lib/constants';
import SearchableSelect from './SearchableSelect';
import InfoTip from './InfoTip';

// 🔹 ЕДИНЫЙ ТЕКСТ ТУЛТИПА — описывает все условия формирования цены
// Размещается рядом с итоговой ценой, блоком доставки и блоком переработки.
// Закрывает юридические риски: калькулятор — предварительный расчёт,
// окончательная цена — в договоре/публичной оферте (ст. 437 ГК РФ).
const PRICING_TERMS_TEXT = `
Как формируется цена:

1. Смена «7+1» — это 7 часов работы техники на объекте + 1 час на подачу техники от места базировки к месту работ. В стоимость смены уже включены: работа аттестованного машиниста, топливо и базовая подача техники.

2. Переработка — стоимость 1 часа работы техники сверх смены «7+1». Переработка тарифицируется почасово, отсчёт начинается с 8-го часа работы. Минимальное время переработки — 1 полный час, неполные часы округляются до часа в большую сторону.

3. Пробег за МКАД — если расстояние от МКАД до адреса заказчика превышает ${pricingData.meta.free_zone_km} км, оплачивается полный пробег техники (подача за МКАД + возврат на МКАД) по кратчайшему автомобильному маршруту. Если расстояние не превышает ${pricingData.meta.free_zone_km} км, доставка бесплатная. При перемещении техники между несколькими адресами за МКАД в рамках одной смены пробег между адресами также оплачивается.

Расчёт в калькуляторе является предварительным и носит информационный характер. Окончательная стоимость, условия оплаты и состав услуг фиксируются в договоре и заявке после согласования с менеджером. Публичная оферта с полными условиями оказания услуг размещена на странице «Условия оказания услуг» в соответствии со ст. 437 ГК РФ.
`.trim();

interface PriceCalculatorProps {
  defaultService?: string;
  defaultCity?: string;
  defaultModel?: string;
}

export default function PriceCalculator({
  defaultService,
  defaultCity,
  defaultModel,
}: PriceCalculatorProps) {
  const cities = useMemo(() => getCities(), []);
  const services = pricingData.services;

  const [selectedService, setSelectedService] = useState(defaultService || services[0]?.slug || '');
  const [selectedModel, setSelectedModel] = useState(defaultModel || '');
  const [selectedCity, setSelectedCity] = useState(defaultCity || '');
  const [geoCity, setGeoCity] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  // 🔹 Геолокация пользователя
  useEffect(() => {
    if (defaultCity || geoCity) return;

    const detectCity = async () => {
      setGeoLoading(true);
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const userCityName = data.city?.toLowerCase() || '';

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

  // 🔹 Автовыбор первой модели (не трогает переданный defaultModel)
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
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-2xl font-bold text-gray-900">
          🧮 Калькулятор стоимости
        </h2>
        <InfoTip text={PRICING_TERMS_TEXT} label="Как формируется цена" />
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Рассчитайте предварительную стоимость аренды с учётом подачи и возврата техники
      </p>

      {/* 🔹 Селекторы */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            1. Тип техники
          </label>
          <select
            className="input w-full"
            value={selectedService}
            onChange={(e) => handleServiceChange(e.target.value)}
            aria-label="Выберите тип техники"
          >
            {services.map((service: any) => (
              <option key={service.slug} value={service.slug}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            2. Модель
          </label>
          <select
            className="input w-full"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            aria-label="Выберите модель техники"
          >
            <option value="">— Выберите модель —</option>
            {currentService?.models.map((model: any) => (
              <option key={model.slug} value={model.slug}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <SearchableSelect
          id="city-select"
          label="3. Город подачи"
          options={cityOptions}
          value={selectedCity}
          onChange={setSelectedCity}
          placeholder={geoLoading ? '🔍 Определяем город...' : '📍 Начните вводить город...'}
          ariaLabel="Выберите город подачи"
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
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                Пробег (за МКАД и обратно)
                <InfoTip text={PRICING_TERMS_TEXT} label="Как считается пробег" />
              </div>
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
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                за смену (7+1 ч)
                <InfoTip text={PRICING_TERMS_TEXT} label="Что входит в смену 7+1 и переработку" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-orange-50 rounded-xl p-5 border-2 border-primary-300 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                ПОПУЛЯРНО
              </div>
              <div className="text-sm text-gray-700 mb-1">💼 Безналичный с НДС</div>
              <div className="text-xs text-gray-500 mb-3">Оплата на ООО на ОСНО (НДС {TAX_CONFIG.VAT_RATE}%)</div>
              <div className="text-3xl font-extrabold text-primary-700">
                {formatPrice(prices.withVat)} ₽
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                за смену (7+1 ч)
                <InfoTip text={PRICING_TERMS_TEXT} label="Что входит в смену 7+1 и переработку" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
              <div className="text-sm text-gray-600 mb-1">🏢 Оплата на ИП (УСН)</div>
              <div className="text-xs text-gray-500 mb-3">Без НДС (упрощёнка {TAX_CONFIG.IP_USN_RATE}%)</div>
              <div className="text-3xl font-extrabold text-blue-700">
                {formatPrice(prices.forIP)} ₽
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                за смену (7+1 ч)
                <InfoTip text={PRICING_TERMS_TEXT} label="Что входит в смену 7+1 и переработку" />
              </div>
            </div>
          </div>

          {/* 🔹 Детализация пробега (раскрытие логики) */}
          {!calculation.isWithinFreeZone && calculation.roundTripDistance > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-700">
              <div className="font-semibold mb-2 flex items-center gap-2">
                📏 Расчёт пробега
                <InfoTip text={PRICING_TERMS_TEXT} label="Правила расчёта пробега" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Расстояние от МКАД до {currentCity.name}:</span>
                  <span className="font-medium">{currentCity.distance_km} км</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Бесплатная зона (до {calculation.freeZoneKm} км от МКАД):</span>
                  <span className="font-medium text-red-600">превышена</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Полный пробег (за МКАД + обратно):</span>
                  <span className="font-medium">{calculation.roundTripDistance} км</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-200">
                  <span className="text-gray-600">Итого ({calculation.roundTripDistance} км × {formatPrice(calculation.pricePerKm)} ₽/км):</span>
                  <span className="font-bold text-orange-600">{formatPrice(calculation.deliveryCost)} ₽</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 italic">
                При расстоянии свыше {calculation.freeZoneKm} км от МКАД оплачивается полный пробег техники (подача + возврат).
              </p>
            </div>
          )}

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

          {/* 🔹 Юридический подвал со ссылкой на оферту (ст. 437 ГК РФ) */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-900 leading-relaxed">
              <strong>ℹ️ Предварительный расчёт.</strong> Пробег за МКАД рассчитан как расстояние × 2 (подача за МКАД + возврат на МКАД).
              Окончательная стоимость, условия оплаты и состав услуг фиксируются в договоре и заявке после согласования с менеджером.{' '}
              <Link href="/terms" className="text-blue-700 hover:text-blue-900 underline font-medium">
                Публичная оферта (ст. 437 ГК РФ)
              </Link>
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