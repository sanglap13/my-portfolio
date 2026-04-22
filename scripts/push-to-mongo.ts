/**
 * One-time script to push local config.json to MongoDB, 
 * replacing whatever is there.
 */
import { config as dotenvConfig } from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

dotenvConfig({ path: '.env' });
if (!process.env.MONGODB_URI) {
  dotenvConfig({ path: '.env.local' });
}

const CONFIG_PATH = path.join(__dirname, '..', 'src', 'data', 'config.json');

const ConfigSchema = new mongoose.Schema({
  // Using Schema.Types.Mixed allows us to store the flexible JSON structure
  overlay: mongoose.Schema.Types.Mixed,
  about: mongoose.Schema.Types.Mixed,
  experience: mongoose.Schema.Types.Mixed,
  projects: mongoose.Schema.Types.Mixed,
  community: mongoose.Schema.Types.Mixed,
  informal: mongoose.Schema.Types.Mixed,
  sequences: mongoose.Schema.Types.Mixed,
  footer: mongoose.Schema.Types.Mixed
}, {
  timestamps: true,
  strict: false // Allows adding fields that aren't strictly defined
});

const ConfigModel = mongoose.models.Config || mongoose.model('Config', ConfigSchema);

async function pushToMongo() {
  console.log('🔗 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('✅ Connected.');

  const configRaw = fs.readFileSync(CONFIG_PATH, 'utf8');
  const config = JSON.parse(configRaw);

  console.log('🗑️  Clearing old configs in MongoDB...');
  await ConfigModel.deleteMany({});

  console.log('💾 Saving local config.json to MongoDB...');
  await ConfigModel.create(config);
  
  console.log('🎉 Done! MongoDB now exactly matches config.json.');
  process.exit(0);
}

pushToMongo().catch(e => {
  console.error(e);
  process.exit(1);
});
