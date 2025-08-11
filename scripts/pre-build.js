#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🚀 Starting pre-build process...');

/**
 * Step 1: Update git submodules
 */
function updateSubmodules() {
  console.log('📦 Updating git submodules...');
  try {
    execSync('git submodule update --init --recursive', { 
      cwd: projectRoot, 
      stdio: 'inherit' 
    });
    console.log('✅ Submodules updated successfully');
  } catch (error) {
    console.warn('⚠️  Warning: Could not update submodules. This is normal if no submodules are configured yet.');
  }
}

/**
 * Step 2: Install dependencies in submodules
 */
function installSubmoduleDependencies() {
  console.log('📚 Installing dependencies in submodules...');
  
  const packagesRegistryPath = path.join(projectRoot, 'packages', 'registry.json');
  
  if (!fs.existsSync(packagesRegistryPath)) {
    console.log('ℹ️  No packages registry found, skipping submodule dependency installation');
    return;
  }

  try {
    const packagesRegistry = JSON.parse(fs.readFileSync(packagesRegistryPath, 'utf8'));
    
    for (const module of packagesRegistry.modules) {
      const modulePath = path.join(projectRoot, 'packages', module.name);
      const packageJsonPath = path.join(modulePath, 'package.json');
      
      if (fs.existsSync(packageJsonPath)) {
        console.log(`📦 Installing dependencies for ${module.name}...`);
        try {
          execSync('npm install', { 
            cwd: modulePath, 
            stdio: 'inherit' 
          });
          console.log(`✅ Dependencies installed for ${module.name}`);
        } catch (error) {
          console.error(`❌ Failed to install dependencies for ${module.name}:`, error.message);
        }
      } else {
        console.log(`ℹ️  No package.json found for ${module.name}, skipping`);
      }
    }
  } catch (error) {
    console.error('❌ Error processing packages registry:', error.message);
  }
}

/**
 * Step 3: Read registries and generate runtime configuration
 */
function generateRuntimeConfig() {
  console.log('⚙️  Generating runtime configuration...');
  
  const packagesRegistryPath = path.join(projectRoot, 'packages', 'registry.json');
  const contentRegistryPath = path.join(projectRoot, 'content', 'registry.json');
  const runtimeConfigPath = path.join(projectRoot, 'site', 'src', 'config', 'runtime.ts');

  let modules = [];
  let collections = [];

  // Read packages registry
  if (fs.existsSync(packagesRegistryPath)) {
    try {
      const packagesRegistry = JSON.parse(fs.readFileSync(packagesRegistryPath, 'utf8'));
      modules = packagesRegistry.modules || [];
      console.log(`📦 Found ${modules.length} modules`);
    } catch (error) {
      console.error('❌ Error reading packages registry:', error.message);
    }
  }

  // Read content registry
  if (fs.existsSync(contentRegistryPath)) {
    try {
      const contentRegistry = JSON.parse(fs.readFileSync(contentRegistryPath, 'utf8'));
      collections = contentRegistry.collections || [];
      
      // Process each collection to read and parse its TOC file
      collections = collections.map(collection => {
        const collectionPath = path.join(projectRoot, 'content', collection.path);
        const tocPath = path.join(collectionPath, collection.toc);
        const themePath = path.join(collectionPath, 'theme.json');
        
        let tocData = null;
        if (fs.existsSync(tocPath)) {
          try {
            const tocContent = fs.readFileSync(tocPath, 'utf8');
            tocData = yaml.load(tocContent);
          } catch (error) {
            console.error(`❌ Error parsing TOC file ${tocPath}:`, error.message);
          }
        } else {
          console.warn(`⚠️  TOC file not found: ${tocPath}`);
        }

        let themeData = null;
        if (fs.existsSync(themePath)) {
          try {
            const themeContent = fs.readFileSync(themePath, 'utf8');
            themeData = JSON.parse(themeContent);
          } catch (error) {
            console.error(`❌ Error parsing theme file ${themePath}:`, error.message);
          }
        }

        return {
          ...collection,
          tocData: tocData,
          theme: themeData,
          pages: tocData && tocData.chapters ? tocData.chapters.map(chapter => ({
            slug: chapter.id,
            title: chapter.title,
            path: chapter.file,
            description: chapter.description
          })) : []
        };
      });
      
      console.log(`📚 Found ${collections.length} content collections`);
    } catch (error) {
      console.error('❌ Error reading content registry:', error.message);
    }
  }

  // Generate runtime configuration
  const runtimeConfig = `// Auto-generated runtime configuration
// This file is generated by the pre-build script
// DO NOT EDIT MANUALLY

export interface ModuleConfig {
  name: string;
  path: string;
  entry: string;
}

export interface CollectionConfig {
  id: string;
  path: string;
  toc: string;
  theme?: any;
  tocData?: {
    title: string;
    description: string;
    author: string;
    version: string;
    chapters: Array<{
      id: string;
      title: string;
      file: string;
      description: string;
    }>;
  };
  pages?: Array<{
    slug: string;
    title: string;
    path: string;
    description?: string;
  }>;
}

export const modules: ModuleConfig[] = ${JSON.stringify(modules, null, 2)};

export const collections: CollectionConfig[] = ${JSON.stringify(collections, null, 2)};

// Fallback configuration for development
export const fallbackConfig = {
  modules: ${JSON.stringify(modules, null, 2)},
  collections: ${JSON.stringify(collections, null, 2)}
};
`;

  // Ensure the config directory exists
  const configDir = path.dirname(runtimeConfigPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  fs.writeFileSync(runtimeConfigPath, runtimeConfig);
  console.log('✅ Runtime configuration generated successfully');
  return collections;
}

/**
 * Step 4: Generate content imports from collections
 */
function generateContentImports(collections) {
  console.log('📦 Generating content imports...');
  
  let content = '{\n';

  const collectionEntries = [];
  for (const collection of collections) {
    if (collection.tocData && collection.tocData.chapters) {
      let collectionString = `  '${collection.id}': {\n`;
      
      const chapterEntries = [];
      for (const chapter of collection.tocData.chapters) {
        const importPath = `~/content/${collection.path}/${chapter.file}`;
        chapterEntries.push(`    '${chapter.file}': () => import('${importPath}')`);
      }
      collectionString += chapterEntries.join(',\n');
      collectionString += '\n  }';
      collectionEntries.push(collectionString);
    }
  }
  content += collectionEntries.join(',\n');
  content += '\n}';

  const finalContent = `// Auto-generated by pre-build.js
// Do not edit this file directly.
export const contentImports: Record<string, Record<string, () => Promise<any>>> = ${content};
`;

  const outputPath = path.join(projectRoot, 'site', 'src', 'config', 'content-imports.ts');
  fs.writeFileSync(outputPath, finalContent);
  console.log('✅ Content imports generated successfully.');
}


/**
 * Main execution
 */
function main() {
  try {
    updateSubmodules();
    installSubmoduleDependencies();
    const collections = generateRuntimeConfig();
    if (collections) {
      generateContentImports(collections);
    }
    console.log('🎉 Pre-build process completed successfully!');
  } catch (error) {
    console.error('❌ Pre-build process failed:', error.message);
    process.exit(1);
  }
}

main();