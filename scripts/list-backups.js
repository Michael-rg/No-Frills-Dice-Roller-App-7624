import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const backupsDir = path.join(projectRoot, 'backups');

if (!fs.existsSync(backupsDir)) {
  console.log('❌ No backups directory found. Create a backup first with: npm run backup');
  process.exit(1);
}

const backups = fs.readdirSync(backupsDir)
  .filter(name => fs.statSync(path.join(backupsDir, name)).isDirectory())
  .sort()
  .reverse(); // Most recent first

if (backups.length === 0) {
  console.log('❌ No backups found. Create a backup first with: npm run backup');
  process.exit(1);
}

console.log('📦 Available backups:\n');

let totalSize = 0;

backups.forEach((backup, index) => {
  const backupPath = path.join(backupsDir, backup);
  const backupInfoPath = path.join(backupPath, 'backup-info.json');
  
  let info = { 
    description: 'No description', 
    date: 'Unknown date',
    files: []
  };
  
  if (fs.existsSync(backupInfoPath)) {
    try {
      info = JSON.parse(fs.readFileSync(backupInfoPath, 'utf8'));
    } catch (e) {
      // Use default info if parsing fails
    }
  }
  
  // Calculate backup size
  function getDirSize(dirPath) {
    let size = 0;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        size += getDirSize(fullPath);
      } else {
        size += fs.statSync(fullPath).size;
      }
    }
    return size;
  }
  
  const size = getDirSize(backupPath);
  totalSize += size;
  const sizeStr = size > 1024 * 1024 
    ? `${(size / (1024 * 1024)).toFixed(1)} MB`
    : `${(size / 1024).toFixed(1)} KB`;
  
  console.log(`${index + 1}. ${backup}`);
  console.log(`   📝 ${info.description}`);
  console.log(`   🕐 ${info.date}`);
  console.log(`   📊 Size: ${sizeStr}`);
  console.log(`   📁 Files: ${info.files ? info.files.length : 'Unknown'} items`);
  console.log('');
});

const totalSizeStr = totalSize > 1024 * 1024 
  ? `${(totalSize / (1024 * 1024)).toFixed(1)} MB`
  : `${(totalSize / 1024).toFixed(1)} KB`;

console.log(`📊 Total: ${backups.length} backups, ${totalSizeStr}`);
console.log('\n💡 Use "npm run restore" to restore a backup');
console.log('💡 Use "npm run backup" to create a new backup');