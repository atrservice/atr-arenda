// ========================================
// File: src/lib/indexing.ts
// Description: Управление индексацией страниц через флаги
// Project: ООО «АТР-СЕРВИС»
// ========================================

import indexingConfig from '@/config/indexing.json';

export interface IndexingRule {
  path: string;
  index: boolean;
  reason?: string;
}

export interface IndexingConfig {
  description?: string;
  defaultIndex: boolean;
  rules: IndexingRule[];
}

const config = indexingConfig as IndexingConfig;

/**
 * Проверяет, должна ли страница индексироваться
 * @param pathname - путь страницы, например '/uslugi/avtovyshki'
 */
export function shouldIndexPage(pathname: string): boolean {
  // Нормализуем путь: убираем трейлинг слэш, если есть
  const path = pathname.endsWith('/') && pathname !== '/' 
    ? pathname.slice(0, -1) 
    : pathname;
  
  // Ищем правило для этого пути
  const rule = config.rules.find(r => r.path === path);
  
  // Если правило найдено — возвращаем его значение, иначе — дефолт
  return rule !== undefined ? rule.index : config.defaultIndex;
}

/**
 * Возвращает список путей, которые НЕ должны индексироваться
 * (для использования в robots.txt или других местах)
 */
export function getNonIndexablePaths(): string[] {
  return config.rules
    .filter(rule => !rule.index)
    .map(rule => rule.path);
}

/**
 * Генерирует meta-тег robots для страницы
 * @param pathname - путь страницы
 */
export function getRobotsMeta(pathname: string): string {
  return shouldIndexPage(pathname) 
    ? 'index, follow' 
    : 'noindex, nofollow';
}

/**
 * Возвращает объект для поля `robots` в Next.js Metadata API
 * Использование: в page.tsx → export const metadata = { robots: getRobotsMetadata('/path') }
 */
export function getRobotsMetadata(pathname: string) {
  const shouldIndex = shouldIndexPage(pathname);
  return {
    index: shouldIndex,
    follow: shouldIndex,
  };
}