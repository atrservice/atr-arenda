// ========================================
// File: src/components/ContactLink.tsx
// Description: Universal clickable contact link with image icons + Metrika tracking
// Project: ООО «АТР-СЕРВИС»
// Usage: <ContactLink type="phone" />
// Supports: SVG/PNG/JPG/WebP icons from public/images/icons/
// ========================================

'use client';

import Image from 'next/image';
import { CONTACTS, createContactClickHandler, ContactType } from '@/lib/contacts';

interface ContactLinkProps {
  type: ContactType;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  variant?: 'text' | 'button';
  iconSize?: number; // Размер иконки в пикселях (по умолчанию 20)
}

// 🔹 Пути к иконкам — поддерживают SVG/PNG/JPG/WebP
const ICONS: Record<ContactType, string> = {
  phone: '/images/icons/icon_phone.png',
  email: '/images/icons/icon_email.png',
  telegram: '/images/icons/icon_telegram.png',
  whatsapp: '/images/icons/icon_whatsapp.png',
  max: '/images/icons/icon_vk.png', // "max" = ВКонтакте
};

// 🔹 Подписи для aria-label и метрики
const LABELS: Record<ContactType, string> = {
  phone: 'Позвонить',
  email: 'Написать на почту',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  max: 'ВКонтакте',
};

// 🔹 Цели для Яндекс.Метрики
const METRIKA_GOALS: Record<ContactType, string> = {
  phone: 'phone_click',
  email: 'email_click',
  telegram: 'telegram_click',
  whatsapp: 'whatsapp_click',
  max: 'vk_click',
};

export default function ContactLink({ 
  type, 
  children, 
  className = '', 
  showIcon = true,
  variant = 'text',
  iconSize = 20
}: ContactLinkProps) {
  const handleClick = createContactClickHandler(type);
  
  const config = {
    phone: {
      href: CONTACTS.phone.link,
      text: children || CONTACTS.phone.formatted,
      icon: ICONS.phone,
      label: LABELS.phone,
      goal: METRIKA_GOALS.phone,
    },
    email: {
      href: CONTACTS.email.link,
      text: children || CONTACTS.email.address,
      icon: ICONS.email,
      label: LABELS.email,
      goal: METRIKA_GOALS.email,
    },
    telegram: {
      href: CONTACTS.telegram.link,
      text: children || LABELS.telegram,
      icon: ICONS.telegram,
      label: LABELS.telegram,
      goal: METRIKA_GOALS.telegram,
    },
    whatsapp: {
      href: CONTACTS.whatsapp.link,
      text: children || LABELS.whatsapp,
      icon: ICONS.whatsapp,
      label: LABELS.whatsapp,
      goal: METRIKA_GOALS.whatsapp,
    },
    max: {
      href: CONTACTS.max?.link || 'https://vk.com/atr_service',
      text: children || LABELS.max,
      icon: ICONS.max,
      label: LABELS.max,
      goal: METRIKA_GOALS.max,
    },
  }[type];

  const baseClasses = variant === 'button' 
    ? 'btn btn-primary inline-flex items-center gap-2' 
    : `inline-flex items-center gap-2 hover:opacity-80 transition-opacity ${className}`;

  return (
    <a
      href={config.href}
      onClick={() => {
        // ✅ Вызываем без аргументов — handleClick не принимает event
        handleClick();
        
        // 🔹 Дополнительная отправка цели в Метрику (дублирующая страховка)
        if (typeof window !== 'undefined' && (window as any).ym) {
          (window as any).ym(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID, 'reachGoal', config.goal);
        }
      }}
      className={baseClasses}
      aria-label={config.label}
      rel={type === 'telegram' || type === 'whatsapp' || type === 'max' ? 'noopener noreferrer' : undefined}
      target={type === 'telegram' || type === 'whatsapp' || type === 'max' ? '_blank' : undefined}
    >
      {showIcon && (
        <span className="inline-flex items-center" aria-hidden="true">
          <Image 
            src={config.icon}
            alt={config.label}
            width={iconSize}
            height={iconSize}
            className="object-contain"
          />
        </span>
      )}
      <span>{config.text}</span>
    </a>
  );
}