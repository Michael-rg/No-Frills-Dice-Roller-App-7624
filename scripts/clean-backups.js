import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        removeDir(fullPath);
      } else {
        fs.unlinkSync(fullPath);
      }
    }
    fs.rmdirSync(dirPath);
  }
}

async function main() {
  const backupsDir = path.join(projectRoot, 'backups');
  
  if (!fs.existsSync(backupsDir)) {
    console.log('❌ No backups directory found.');
    rl.close();
    return;
  }
  
  const backups = fs.readdirSync(backupsDir)
    .filter(name => fs.statSync(path.join(backupsDir, name)).isDirectory())
    .sort();
  
  if (backups.length === 0) {
    console.log('❌ No backups found.');
    rl.close();
    return;
  }
  
  console.log(`📦 Found ${backups.length} backups`);
  console.log('\nCleanup options:');
  console.log('1. Keep last 5 backups (delete older ones)');
  console.log('2. Keep last 10 backups (delete older ones)');
  console.log('3. Delete all backups');
  console.log('4. Custom cleanup (choose which to keep)');
  
  const choice = await question('\nEnter your choice (1-4, or "q" to quit): ');
  
  if (choice.toLowerCase() === 'q') {
    console.log('👋 Cleanup cancelled.');
    rl.close();
    return;
  }
  
  let toDelete = [];
  
  switch (choice) {
    case '1':
      toDelete = backups.slice(0, -5); // Keep last 5
      break;
    case '2':
      toDelete = backups.slice(0, -10); // Keep last 10
      break;
    case '3':
      toDelete = [...backups]; // Delete all
      break;
    case '4':
      console.log('\nAvailable backups:');
      backups.forEach((backup, index) => {
        const backupInfoPath = path.join(backupsDir, backup, 'backup-info.json');
        let info = { description: 'No description', date: 'Unknown date' };
        
        if (fs.existsSync(backupInfoPath)) {
          try {
            info = JSON.parse(fs.readFileSync(backupInfoPath, 'utf8'));
          } catch (e) {
            // Use default info
          }
        }
        
        console.log(`${index + 1}. ${backup} - ${info.description} (${info.date})`);
      });
      
      const keepIndices = await question('\nEnter numbers of backups to KEEP (comma-separated, e.g. 1,3,5): ');
      const keepSet = new Set(keepIndices.split(',').map(n => parseInt(n.trim()) - 1));
      
      toDelete = backups.filter((_, index) => !keepSet.has(index));
      break;
    default:
      console.log('❌ Invalid choice.');
      rl.close();
      return;
  }
  
  if (toDelete.length === 0) {
    console.log('✅ No backups to delete.');
    rl.close();
    return;
  }
  
  console.log(`\n⚠️  This will delete ${toDelete.length} backup(s):`);
  toDelete.forEach(backup => console.log(`  - ${backup}`));
  
  const confirm = await question('\nAre you sure? (y/N): ');
  
  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log('👋 Cleanup cancelled.');
    rl.close();
    return;
  }
  
  console.log('\n🗑️  Deleting backups...');
  
  for (const backup of toDelete) {
    const backupPath = path.join(backupsDir, backup);
    removeDir(backupPath);
    console.log(`✅ Deleted: ${backup}`);
  }
  
  console.log(`\n✨ Cleanup complete! Deleted ${toDelete.length} backup(s).`);
  console.log(`📦 ${backups.length - toDelete.length} backup(s) remaining.`);
  
  rl.close();
}

main().catch(console.error);