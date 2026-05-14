// ========================================
// File: fix-paths.js
// Purpose: Normalize all import paths to forward slashes
// Run: node fix-paths.js
// ========================================

const fs = require('fs');
const path = require('path');

function normalizeImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace backslashes in imports with forward slashes
    // Match: import ... from '@/components\Header'
    content = content.replace(
      /(from\s+['"])([^'"]+)(['"])/g,
      (match, before, importPath, after) => {
        // Only fix paths that start with @ or .
        if (importPath.startsWith('@') || importPath.startsWith('.')) {
          const normalized = importPath.replace(/\\/g, '/');
          return `${before}${normalized}${after}`;
        }
        return match;
      }
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (e) {
    console.error(`❌ ${filePath}: ${e.message}`);
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
    } else if (/\.(ts|tsx)$/.test(file)) {
      callback(fullPath);
    }
  }
}

console.log('🔧 Normalizing import paths...\n');
let fixed = 0;
walkDir('./src', (file) => {
  if (normalizeImports(file)) fixed++;
});

console.log(`✅ Done! Fixed ${fixed} files.`);