// ========================================
// File: scripts/optimize-images.mjs
// Description: Сжатие всех изображений в WebP
// Project: ООО «АТР-СЕРВИС»
// ========================================

import sharp from 'sharp';
import { readdir, stat, mkdir, writeFile } from 'fs/promises';
import { join, dirname, basename, extname, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_DIR = join(__dirname, '..', 'public', 'images');
const OUTPUT_DIR = join(__dirname, '..', 'public', 'images', 'optimized');

const TARGET_SIZES = {
  services: { width: 800, quality: 80 },   // Карточки услуг
  icons: { width: 128, quality: 90 },      // Иконки
  hero: { width: 1920, quality: 85 },      // Hero-секция
  default: { width: 1200, quality: 80 },
};

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        return getFiles(fullPath);
      }
      const stats = await stat(fullPath);
      return { path: fullPath, size: stats.size, name: entry.name };
    })
  );
  return files.flat();
}

async function optimizeImage(inputPath, outputDir, category = 'default') {
  const { width, quality } = TARGET_SIZES[category] || TARGET_SIZES.default;
  
  // ✅ ИСПРАВЛЕНО: используем basename для кроссплатформенности
  const fileName = basename(inputPath).replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  // ✅ ИСПРАВЛЕНО: сохраняем структуру папок
  const relativePath = relative(INPUT_DIR, dirname(inputPath));
  const outputSubdir = join(outputDir, relativePath);
  
  // Создаём подпапку, если её нет
  await mkdir(outputSubdir, { recursive: true });
  
  const outputPath = join(outputSubdir, fileName);
  
  try {
    await sharp(inputPath)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality })
      .toFile(outputPath);
    
    const originalSize = (await stat(inputPath)).size;
    const newSize = (await stat(outputPath)).size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${relative(INPUT_DIR, inputPath)}: ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB (${savings}% экономии)`);
  } catch (error) {
    console.error(`❌ Ошибка ${relative(INPUT_DIR, inputPath)}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Начинаю оптимизацию изображений...\n');
  
  await mkdir(OUTPUT_DIR, { recursive: true });
  
  const files = await getFiles(INPUT_DIR);
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f.name));
  
  console.log(`📸 Найдено ${imageFiles.length} изображений\n`);
  
  for (const file of imageFiles) {
    const relativePath = relative(INPUT_DIR, file.path);
    const category = relativePath.includes('services') ? 'services' 
                   : relativePath.includes('icons') ? 'icons'
                   : relativePath.includes('hero') ? 'hero'
                   : 'default';
    
    await optimizeImage(file.path, OUTPUT_DIR, category);
  }
  
  console.log('\n🎉 Готово! Файлы сохранены в', relative(process.cwd(), OUTPUT_DIR));
  console.log('\n💡 Следующий шаг: замени в коде ссылки с .jpg/.png на .webp');
}

main().catch(console.error);