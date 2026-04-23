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

    isSynced = true;
    return dbConfig;
  } catch (error) {
    console.error('❌ Error in syncConfig:', error);
    throw error;
  }
}
