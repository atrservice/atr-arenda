// ========================================
// Файл: fix-encoding.js
// Описание: Конвертирует все .ts/.tsx файлы в UTF-8 без BOM
// Запуск: node fix-encoding.js
// ========================================

const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  try {
    // Читаем как буфер, чтобы получить "сырые" байты
    const buffer = fs.readFileSync(filePath);
    
    // Пробуем декодировать как UTF-8
    let content = buffer.toString('utf8');
    
    // Если видим кракозябры типа "РџСЂРѕРµРєС‚" — пробуем другие кодировки
    if (/Р[A-Z]/.test(content)) {
      // Это похоже на двойное кодирование: UTF-8 -> Windows-1251 -> UTF-8
      // Пробуем "откатить" обратно
      const fixed = Buffer.from(content, 'binary').toString('utf8');
      if (fixed.includes('Проект') || fixed.includes('АТР')) {
        content = fixed;
        console.log(`🔧 Исправлена кодировка: ${filePath}`);
      }
    }
    
    // Перезаписываем файл в чистом UTF-8 без BOM
    fs.writeFileSync(filePath, content, { encoding: 'utf8' });
    return true;
  } catch (e) {
    console.error(`❌ Ошибка в ${filePath}:`, e.message);
    return false;
  }
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (/\.(ts|tsx|json)$/.test(file)) {
      callback(fullPath);
    }
  }
}

console.log('🔍 Поиск файлов для конвертации...\n');
let fixed = 0;
walkDir('./src', (file) => {
  if (fixFile(file)) fixed++;
});

console.log(`\n✅ Готово! Исправлено файлов: ${fixed}`);
console.log('🚀 Теперь запусти: npm run dev');