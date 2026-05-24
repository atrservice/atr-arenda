'use client';

import { useEffect } from 'react';

export default function DebugLogger() {
  useEffect(() => {
    const startTime = performance.now();
    
    console.log('🚀 Page start:', window.location.href);
    
    window.addEventListener('load', () => {
      const loadTime = performance.now() - startTime;
      console.log(`🎉 Page loaded in ${loadTime.toFixed(0)}ms`);
      console.log('📱 User agent:', navigator.userAgent);
      console.log('📡 Connection:', (navigator as any).connection?.effectiveType || 'unknown');
    });
    
    // Глобальный перехват ошибок
    window.addEventListener('error', (e) => {
      console.error('❌ Global error:', {
        message: e.message,
        source: e.filename,
        lineno: e.lineno,
        colno: e.colno,
      });
    });
    
    window.addEventListener('unhandledrejection', (e) => {
      console.error('❌ Unhandled promise rejection:', e.reason);
    });
  }, []);
  
  return null;
}