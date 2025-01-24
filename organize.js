import { globSync } from 'glob';
import fs from 'fs-extra';
import path from 'path';

// Define the mapping for folders
const folderMappings = [
  { source: 'build/tables/sources/*.js', destination: 'definitions/' },
  { source: 'build/tables/transformations/*.js', destination: 'definitions/' },
  { source: 'build/includes/*.js', destination: 'definitions/includes' },
  { source: 'build/tables/tests/*.js', destination: 'definitions/tests' },
];

async function cleanDefinitionsFolder() {
  const jsFiles = globSync('definitions/**/*.js');
  for (const file of jsFiles) {
    await fs.remove(file);
    console.log(`Removed: ${file}`);
  }
}

// Function to move files based on the mappings
async function organizeFiles() {
  // Clean existing .js files first
  await cleanDefinitionsFolder();

  for (const { source, destination } of folderMappings) {
    // Match files using glob
    const files = globSync(source);

    for (const file of files) {
      const fileName = path.basename(file); // Extract file name
      const targetPath = path.join(destination, fileName); // Build destination path

      // Ensure the destination folder exists
      await fs.ensureDir(destination);

      // Move the file
      await fs.copy(file, targetPath, { overwrite: true });
      console.log(`Moved: ${file} -> ${targetPath}`);
    }
  }
}

// Run the organize function
organizeFiles().catch((err) => {
  console.error('Error organizing files:', err);
}).finally(() => console.log("Organizing files done."))