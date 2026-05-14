// ========================================
// File: src/components/ContactLink.tsx
// Description: Universal clickable contact link with Metrika tracking
// Project: АТР-СЕРВИС
// Usage: <ContactLink type="phone" />
// ========================================

'use client';

import { CONTACTS, createContactClickHandler, ContactType } from '@/lib/contacts';

interface ContactLinkProps {
  type: ContactType;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  variant?: 'text' | 'button';
}

const ICONS: Record<ContactType, string> = {
  phone: '📞',
  email: '✉️',
  telegram: '✈️',
};

const LABELS: Record<ContactType, string> = {
  phone: 'Позвонить',
  email: 'Написать на почту',
  telegram: 'Написать в Telegram',
};

export default function ContactLink({ 
  type, 
  children, 
  className = '', 
  showIcon = true,
  variant = 'text'
}: ContactLinkProps) {
  const handleClick = createContactClickHandler(type);
  
  const config = {
    phone: {
      href: CONTACTS.phone.link,
      text: children || CONTACTS.phone.formatted,
      icon: ICONS.phone,
      label: LABELS.phone,
    },
    email: {
      href: CONTACTS.email.link,
      text: children || CONTACTS.email.address,
      icon: ICONS.email,
      label: LABELS.email,
    },
    telegram: {
      href: CONTACTS.telegram.link,
      text: children || CONTACTS.telegram.username,
      icon: ICONS.telegram,
      label: LABELS.telegram,
    },
  }[type];

  const baseClasses = variant === 'button' 
    ? 'btn btn-primary inline-flex items-center gap-2' 
    : `inline-flex items-center gap-1 hover:underline ${className}`;

  return (
    <a
      href={config.href}
      onClick={handleClick}
      className={baseClasses}
      aria-label={`${config.label}: ${config.text}`}
      rel={type === 'telegram' ? 'noopener noreferrer' : undefined}
      target={type === 'telegram' ? '_blank' : undefined}
    >
      {showIcon && <span aria-hidden="true">{config.icon}</span>}
      <span>{config.text}</span>
    </a>
  );
}