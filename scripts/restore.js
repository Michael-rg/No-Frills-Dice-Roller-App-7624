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

// Function to remove directory recursively
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
    console.log('❌ No backups directory found. Create a backup first with: npm run backup');
    rl.close();
    return;
  }
  
  const backups = fs.readdirSync(backupsDir)
    .filter(name => fs.statSync(path.join(backupsDir, name)).isDirectory())
    .sort()
    .reverse(); // Most recent first
  
  if (backups.length === 0) {
    console.log('❌ No backups found. Create a backup first with: npm run backup');
    rl.close();
    return;
  }
  
  console.log('📦 Available backups:\n');
  
  // Display backups with info
  backups.forEach((backup, index) => {
    const backupInfoPath = path.join(backupsDir, backup, 'backup-info.json');
    let info = { description: 'No description', date: 'Unknown date' };
    
    if (fs.existsSync(backupInfoPath)) {
      try {
        info = JSON.parse(fs.readFileSync(backupInfoPath, 'utf8'));
      } catch (e) {
        // Use default info if parsing fails
      }
    }
    
    console.log(`${index + 1}. ${backup}`);
    console.log(`   📝 ${info.description}`);
    console.log(`   🕐 ${info.date}`);
    console.log('');
  });
  
  const choice = await question('Enter the number of the backup to restore (or "q" to quit): ');
  
  if (choice.toLowerCase() === 'q') {
    console.log('👋 Restore cancelled.');
    rl.close();
    return;
  }
  
  const backupIndex = parseInt(choice) - 1;
  
  if (isNaN(backupIndex) || backupIndex < 0 || backupIndex >= backups.length) {
    console.log('❌ Invalid selection.');
    rl.close();
    return;
  }
  
  const selectedBackup = backups[backupIndex];
  const backupPath = path.join(backupsDir, selectedBackup);
  
  console.log(`\n⚠️  This will replace your current project files with the backup: ${selectedBackup}`);
  const confirm = await question('Are you sure? (y/N): ');
  
  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log('👋 Restore cancelled.');
    rl.close();
    return;
  }
  
  console.log('\n🔄 Restoring backup...');
  
  // Get list of files to restore from backup info
  const backupInfoPath = path.join(backupPath, 'backup-info.json');
  let filesToRestore = ['src', 'index.html', 'package.json', 'tailwind.config.js', 'vite.config.js', 'postcss.config.js', 'eslint.config.js'];
  
  if (fs.existsSync(backupInfoPath)) {
    try {
      const info = JSON.parse(fs.readFileSync(backupInfoPath, 'utf8'));
      if (info.files) {
        filesToRestore = info.files;
      }
    } catch (e) {
      console.log('⚠️  Could not read backup info, using default file list.');
    }
  }
  
  // Restore files
  for (const file of filesToRestore) {
    const srcPath = path.join(backupPath, file);
    const destPath = path.join(projectRoot, file);
    
    if (fs.existsSync(srcPath)) {
      // Remove existing file/directory
      if (fs.existsSync(destPath)) {
        const stat = fs.statSync(destPath);
        if (stat.isDirectory()) {
          removeDir(destPath);
        } else {
          fs.unlinkSync(destPath);
        }
      }
      
      // Copy from backup
      const srcStat = fs.statSync(srcPath);
      if (srcStat.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        copyFile(srcPath, destPath);
      }
      
      console.log(`✅ Restored: ${file}`);
    }
  }
  
  console.log('\n✨ Backup restored successfully!');
  console.log('💡 You may need to run "npm install" if package.json was restored.');
  
  rl.close();
}

main().catch(console.error);