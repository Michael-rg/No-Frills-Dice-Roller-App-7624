import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Files and directories to backup
const BACKUP_PATHS = [
  'src',
  'index.html',
  'package.json',
  'tailwind.config.js',
  'vite.config.js',
  'postcss.config.js',
  'eslint.config.js'
];

// Create backups directory if it doesn't exist
const backupsDir = path.join(projectRoot, 'backups');
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

// Generate timestamp for backup folder
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupDir = path.join(backupsDir, `backup-${timestamp}`);

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Function to copy file
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

// Create backup
console.log('🔄 Creating backup...');
fs.mkdirSync(backupDir, { recursive: true });

for (const backupPath of BACKUP_PATHS) {
  const srcPath = path.join(projectRoot, backupPath);
  const destPath = path.join(backupDir, backupPath);
  
  if (fs.existsSync(srcPath)) {
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
    console.log(`✅ Backed up: ${backupPath}`);
  } else {
    console.log(`⚠️  Skipped (not found): ${backupPath}`);
  }
}

// Create backup info file
const backupInfo = {
  timestamp: new Date().toISOString(),
  date: new Date().toLocaleString(),
  description: process.argv[2] || 'Manual backup',
  files: BACKUP_PATHS.filter(p => fs.existsSync(path.join(projectRoot, p)))
};

fs.writeFileSync(
  path.join(backupDir, 'backup-info.json'),
  JSON.stringify(backupInfo, null, 2)
);

console.log(`\n✨ Backup created successfully!`);
console.log(`📁 Location: ${path.relative(projectRoot, backupDir)}`);
console.log(`📝 Description: ${backupInfo.description}`);
console.log(`🕐 Time: ${backupInfo.date}`);