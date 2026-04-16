import fs from 'fs';
import path from 'path';
import dbConnect from '@/utils/mongoose';
import Config from '@/models/Config';

const CONFIG_FILE_PATH = path.join(process.cwd(), 'src/data/config.json');

// Server-side cache to avoid redundant syncs in the same session
let isSynced = false;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function syncConfig(force = false) {
  if (isSynced && !force) return null;
  
  try {
    // Artificial delay to show off the premium loading screen/typing effect
    await delay(2000);

    await dbConnect();

    // 1. Try to fetch the latest config from MongoDB
    let dbConfig = await Config.findOne().sort({ updatedAt: -1 });

    if (!dbConfig) {
      console.log('🚀 No config found in MongoDB. Seeding from local config.json...');
      
      // 2. Initial Seeding: Read local config.json
      const localConfigRaw = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
      const localConfig = JSON.parse(localConfigRaw);

      // 3. Save to MongoDB
      dbConfig = await Config.create(localConfig);
      console.log('✅ MongoDB seeded successfully.');
      return dbConfig;
    }

    // 4. Sync to Codebase: Write DB config back to local config.json 
    // This ensures local imports like `@/data/config.json` remain up-to-date
    const configData = dbConfig.toObject();
    
    // Remove MongoDB specific fields before writing to JSON
    delete configData._id;
    delete configData.__v;
    delete configData.createdAt;
    delete configData.updatedAt;

    const updatedConfigContent = JSON.stringify(configData, null, 2);
    
    // Ensure the directory exists
    const dir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Only write if the content has changed or file is missing
    const fileExists = fs.existsSync(CONFIG_FILE_PATH);
    const currentConfigContent = fileExists ? fs.readFileSync(CONFIG_FILE_PATH, 'utf8') : null;
    
    if (!fileExists || updatedConfigContent !== currentConfigContent) {
      fs.writeFileSync(CONFIG_FILE_PATH, updatedConfigContent, 'utf8');
      console.log(fileExists ? '🔄 Codebase synced with MongoDB config.' : '📝 config.json recreated from MongoDB.');
    }

    isSynced = true;
    return dbConfig;
  } catch (error) {
    console.error('❌ Error in syncConfig:', error);
    throw error;
  }
}
