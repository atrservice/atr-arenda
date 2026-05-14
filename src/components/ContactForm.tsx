// ========================================
// Файл: src/components/ContactForm.tsx
// Описание: Форма заявки с валидацией и Яндекс.Метрикой
// Проект: АТР-СЕРВИС
// Контакты: берутся из .env.local через @/lib/contacts
// ========================================

'use client';

import { useState, FormEvent } from 'react';
import ContactLink from '@/components/ContactLink';
import { CONTACTS, trackMetricaGoal } from '@/lib/contacts';

interface FormData {
  name: string;
  phone: string;
  equipment: string;
  message: string;
  consent: boolean;
}

interface FormErrors {
  name?: string;
  phone?: string;
  consent?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    equipment: 'avtovyshka',
    message: '',
    consent: false
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 🔹 Форматирование телефона: +7 (___) ___-__-__
  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';
    if (digits.length <= 1) return `+7 (${digits}`;
    if (digits.length <= 4) return `+7 (${digits.slice(1)}`;
    if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
  };

  // 🔹 Валидация формы
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя';
    }
    
    // ✅ ИСПРАВЛЕННАЯ РЕГУЛЯРКА: \+ вместо +
    if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(formData.phone)) {
      newErrors.phone = 'Введите телефон в формате +7 (___) ___-__-__';
    }
    
    if (!formData.consent) {
      newErrors.consent = 'Необходимо согласие на обработку данных';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Обработчик отправки
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // 🔹 ЗАГЛУШКА: здесь будет fetch('/api/submit', ...)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // 🔹 Отправка цели в Яндекс.Метрику
    trackMetricaGoal('form_submit', {
      equipment_selected: formData.equipment,
      phone_digits: formData.phone.replace(/\D/g, '').slice(2),
      timestamp: new Date().toISOString(),
    });
    
    // Сброс формы
    setTimeout(() => {
      setFormData({
        name: '',
        phone: '',
        equipment: 'avtovyshka',
        message: '',
        consent: false
      });
      setIsSuccess(false);
    }, 3000);
  };

  // 🔹 Обработчик изменений
  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'phone' ? formatPhone(value as string) : value
    }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // ✅ Экран успеха
  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Заявка отправлена!</h3>
        <p className="text-green-700">
          Менеджер свяжется с вами в течение 15 минут.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Имя */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Ваше имя *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          } focus:outline-none focus:ring-2 transition`}
          placeholder="Иван Иванов"
          required
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Телефон */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Телефон *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          } focus:outline-none focus:ring-2 transition`}
          placeholder="+7 (___) ___-__-__"
          required
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
      </div>

      {/* Тип техники */}
      <div>
        <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 mb-1">
          Какая техника нужна?
        </label>
        <select
          id="equipment"
          name="equipment"
          value={formData.equipment}
          onChange={(e) => handleChange('equipment', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="avtovyshka">🪜 Автовышка</option>
          <option value="kmu">🏗️ Кран-манипулятор (КМУ)</option>
          <option value="avtokran">🔧 Автокран</option>
          <option value="prikrytie">🚨 Машина прикрытия</option>
          <option value="other">❓ Другое / нужна консультация</option>
        </select>
      </div>

      {/* Сообщение */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Комментарий к заказу
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
          placeholder="Адрес объекта, даты, особенности работ..."
        />
      </div>

      {/* Согласие */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={(e) => handleChange('consent', e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
          />
          <span className="text-sm text-gray-600">
            Я согласен на <a href="/policy" className="text-blue-600 hover:underline">обработку персональных данных</a> *
          </span>
        </label>
        {errors.consent && <p className="mt-1 text-sm text-red-600">{errors.consent}</p>}
      </div>

      {/* Кнопка */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin">⏳</span>
            Отправка...
          </>
        ) : (
          '📞 Заказать звонок'
        )}
      </button>

      {/* Подсказка с контактами — теперь шаблонизировано! */}
      <p className="text-xs text-gray-500 text-center space-x-2">
        <span>Или свяжитесь напрямую:</span>
        <ContactLink type="phone" className="font-medium" showIcon={false} />
        <span>·</span>
        <ContactLink type="email" className="font-medium" showIcon={false} />
        <span>·</span>
        <ContactLink type="telegram" className="font-medium" showIcon={false} />
      </p>
    </form>
  );
}