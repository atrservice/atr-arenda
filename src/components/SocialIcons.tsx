// ========================================
// File: src/components/SocialIcons.tsx
// Description: Клиентский компонент для кликабельных иконок соцсетей
// Project: ООО «АТР-СЕРВИС»
// Usage: <SocialIcons /> — только иконки, без текста, крупные (32px)
// ========================================

'use client'; // ✅ Обязательно: есть интерактивность (onClick)

import Image from 'next/image';
import { CONTACTS } from '@/lib/contacts';

interface SocialIconsProps {
  className?: string;
}

export default function SocialIcons({ className = '' }: SocialIconsProps) {
  // 🔹 Хелпер для отправки цели в Метрику
  const trackSocialClick = (goal: string) => {
    if (typeof window !== 'undefined' && (window as any).ym) {
      (window as any).ym(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID, 'reachGoal', goal);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      
      {/* Telegram */}
      <a 
        href={CONTACTS.telegram.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackSocialClick('telegram_click')}
        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-primary-100 flex items-center justify-center transition-colors"
        aria-label="Telegram"
      >
        <Image 
          src="/images/icons/icon_telegram.svg"
          alt="Telegram"
          width={32}  // ✅ Крупнее, чем 20px в остальном проекте
          height={32}
          className="object-contain"
        />
      </a>
      
      {/* WhatsApp */}
      <a 
        href={CONTACTS.whatsapp.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackSocialClick('whatsapp_click')}
        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-green-100 flex items-center justify-center transition-colors"
        aria-label="WhatsApp"
      >
        <Image 
          src="/images/icons/icon_whatsapp.svg"
          alt="WhatsApp"
          width={32}
          height={32}
          className="object-contain"
        />
      </a>
      
      {/* ВКонтакте (max) */}
      <a 
        href={CONTACTS.max.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackSocialClick('vk_click')}
        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors"
        aria-label="ВКонтакте"
      >
        <Image 
          src="/images/icons/icon_vk.svg"
          alt="ВКонтакте"
          width={32}
          height={32}
          className="object-contain"
        />
      </a>
      
    </div>
  );
}