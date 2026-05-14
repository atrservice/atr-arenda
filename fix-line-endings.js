// ========================================
// File: fix-line-endings.js
// Purpose: Convert all .ts/.tsx/.json files to LF line endings
// Run: node fix-line-endings.js
// ========================================

const fs = require('fs');
const path = require('path');

function fixLineEndings(filePath) {
  try {
    // Read as buffer to handle raw bytes
    const buffer = fs.readFileSync(filePath);
    
    // Convert CRLF (\r\n) -> LF (\n), then remove any standalone \r
    let content = buffer.toString('utf8');
    content = content.replace(/\r\n/g, '\n').replace(/\r/g, '');
    
    // Write back with LF only
    fs.writeFileSync(filePath, content, { encoding: 'utf8', endOfLine: 'lf' });
    
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
    } else if (/\.(ts|tsx|json|js|mjs)$/.test(file)) {
      callback(fullPath);
    }
  }
}

console.log('🔧 Fixing line endings (CRLF → LF)...\n');
let fixed = 0;
walkDir('./src', (file) => {
  if (fixLineEndings(file)) fixed++;
});
walkDir('./', (file) => {
  // Also fix root config files
  if (['package.json', 'next.config.mjs', 'tsconfig.json'].includes(path.basename(file))) {
    if (fixLineEndings(file)) fixed++;
  }
});

console.log(`✅ Done! Fixed ${fixed} files.`);
console.log('🚀 Now run: npm run dev');