// ========================================
// File: src/components/DebugLogger.tsx
// Description: Клиентский компонент для отладки загрузки на мобильных
// Project: ООО «АТР-СЕРВИС»
// ========================================

'use client'; // ✅ Обязательно: используем useEffect

import { useEffect } from 'react';

export default function DebugLogger() {
  useEffect(() => {
    console.log('✅ Page loaded:', window.location.href);
    console.log('📱 User agent:', navigator.userAgent);
    
    window.addEventListener('load', () => {
      console.log('🎉 Window load event fired');
    });
    
    // Ловим ошибки для отладки
    window.addEventListener('error', (e) => {
      console.error('❌ Global error:', e.message, e.filename, e.lineno);
    });
  }, []);
  
  return null; // Не рендерит ничего в DOM
}