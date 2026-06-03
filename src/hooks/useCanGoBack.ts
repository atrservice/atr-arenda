// ========================================
// File: src/hooks/useCanGoBack.ts
// Description: Хук для определения, можно ли вернуться назад
// Project: ООО «АТР-СЕРВИС»
// ========================================

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Определяет, есть ли история для возврата назад
 * Возвращает true, если текущая страница не главная
 */
export function useCanGoBack(): boolean {
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Если мы не на главной — значит, можем вернуться назад
    setCanGoBack(pathname !== '/');
  }, [pathname]);

  return canGoBack;
}