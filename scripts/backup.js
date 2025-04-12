import { mkdir, copyFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const BACKUP_DIR = 'backup_' + new Date().toISOString().replace(/[:.]/g, '-');

async function copyDirectory(source, destination) {
  // Create destination directory
  await mkdir(destination, { recursive: true });
  
  // Read all files/folders from source
  const entries = await readdir(source, { withFileTypes: true });
  
  // Process each file/folder
  for (const entry of entries) {
    const srcPath = join(source, entry.name);
    const destPath = join(destination, entry.name);
    
    // Skip the backup directory itself and node_modules
    if (entry.name === 'node_modules' || entry.name === 'backup_' || entry.name === 'dist') {
      continue;
    }
    
    if (entry.isDirectory()) {
      // Recursively copy directories
      await copyDirectory(srcPath, destPath);
    } else {
      // Create parent directory if it doesn't exist
      await mkdir(dirname(destPath), { recursive: true });
      // Copy files
      await copyFile(srcPath, destPath);
    }
  }
}

async function createBackup() {
  console.log(`Creating backup in ./${BACKUP_DIR}`);
  
  try {
    if (!existsSync(BACKUP_DIR)) {
      await copyDirectory('.', BACKUP_DIR);
      console.log(`✅ Backup completed successfully!`);
      console.log(`📁 Your project is backed up to: ./${BACKUP_DIR}`);
      console.log(`⚠️ Note: node_modules and dist folders were not backed up`);
    } else {
      console.error(`❌ Backup directory ${BACKUP_DIR} already exists`);
    }
  } catch (error) {
    console.error(`❌ Backup failed: ${error.message}`);
  }
}

// Run the backup
createBackup();