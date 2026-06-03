// ========================================
// File: src/hooks/useIsPWA.ts
// Description: Хук для определения PWA-режима (standalone)
// Project: ООО «АТР-СЕРВИС»
// ========================================

'use client';

import { useState, useEffect } from 'react';

// 🔹 Расширяем тип Navigator для поддержки iOS Safari
declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

/**
 * Определяет, открыт ли сайт в PWA-режиме (standalone)
 * Работает на iOS (window.navigator.standalone) и Android (display-mode: standalone)
 */
export function useIsPWA(): boolean {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // iOS Safari
    const isIOSStandalone = window.navigator.standalone === true;
    
    // Android Chrome и другие браузеры
    const isAndroidStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    setIsPWA(isIOSStandalone || isAndroidStandalone);
  }, []);

  return isPWA;
}