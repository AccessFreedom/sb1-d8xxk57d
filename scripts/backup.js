import { mkdir, copyFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const BACKUP_DIR = 'backup_' + new Date().toISOString().replace(/[:.]/g, '-');

/**
 * Copies contents from the source directory to the destination, excluding specified directories.
 * @example
 * copyDirectory('path/to/source', 'path/to/destination')
 * // Copies all contents except 'node_modules', 'backup_', and 'dist' from source to destination
 * @param {string} source - Path to the source directory.
 * @param {string} destination - Path to the destination directory.
 * @returns {Promise<void>} Resolves when the copy operation is complete.
 * @description
 *   - Recursively copies directories and files from the source to the destination.
 *   - Excludes copying directories named 'node_modules', 'backup_', and 'dist'.
 *   - Automatically creates the destination directory and any necessary parent directories.
 */
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

/**
* Creates a backup of the current project directory, excluding certain folders.
* @example
* createBackup()
* undefined
* @param {string} BACKUP_DIR - Directory where the backup will be created.
* @returns {void} Does not return a value.
* @description
*   - Logs progress and results to the console, including success and failure messages.
*   - Ensures the backup directory does not pre-exist to avoid overwriting.
*   - Excludes `node_modules` and `dist` folders from the backup.
*   - Handles errors during copying and logs them to the console.
*/
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