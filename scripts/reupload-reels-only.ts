/**
 * Re-upload reels from local public/ to new Cloudinary Account C.
 * Usage: npx tsx scripts/reupload-reels-only.ts
 */

import { config as dotenvConfig } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

dotenvConfig();

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

const ACCOUNT_C = {
  name: 'Reels',
  cloud_name: process.env.CLOUDINARY_C_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_C_API_KEY || '',
  api_secret: process.env.CLOUDINARY_C_API_SECRET || '',
};

function switchAccount(account: typeof ACCOUNT_C) {
  cloudinary.config({
    cloud_name: account.cloud_name,
    api_key: account.api_key,
    api_secret: account.api_secret,
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let uploadCount = 0;

async function uploadFile(
  filePath: string,
  folder: string,
  account: typeof ACCOUNT_C,
  publicId?: string
): Promise<string> {
  uploadCount++;
  const basename = publicId || path.parse(filePath).name;
  process.stdout.write(
    `  [${uploadCount}] (${account.name}) ${path.basename(filePath)} → portfolio/${folder}/${basename} `
  );

  switchAccount(account);

  // Cloudinary upload_large uses minimum 5MB chunks.
  // We'll set it to 5.5MB to be safe and give a huge timeout per chunk.
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      filePath,
      {
        folder: `portfolio/${folder}`,
        public_id: basename,
        resource_type: 'video',
        overwrite: true,
        chunk_size: 5500000, 
        timeout: 600000, // 10 minutes per chunk
      },
      (error, result) => {
        if (error) {
          console.log(`❌ Error:`, error.message || error);
          reject(error);
        } else if (result) {
          console.log('✅');
          resolve(result.secure_url);
        } else {
          console.log('❌ Unknown error');
          reject(new Error('Unknown error'));
        }
      }
    );
  });
}

async function main() {
  console.log('═'.repeat(60));
  console.log('🎬 Re-uploading Reels to new Cloudinary Account C');
  console.log('═'.repeat(60));
  console.log(`  Account C (Reels):  ${ACCOUNT_C.cloud_name}\n`);

  // Validate env
  const missing: string[] = [];
  if (!ACCOUNT_C.cloud_name) missing.push('CLOUDINARY_C_CLOUD_NAME');
  if (!ACCOUNT_C.api_key) missing.push('CLOUDINARY_C_API_KEY');
  if (!ACCOUNT_C.api_secret) missing.push('CLOUDINARY_C_API_SECRET');
  if (!process.env.MONGODB_URI) missing.push('MONGODB_URI');
  if (missing.length > 0) {
    console.error('❌ Missing env vars:', missing.join(', '));
    process.exit(1);
  }

  // Connect to MongoDB
  console.log('📡 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI!);
  const ConfigModel =
    mongoose.models.Config ||
    mongoose.model('Config', new mongoose.Schema({}, { strict: false, timestamps: true }));
  const dbConfig = await ConfigModel.findOne().sort({ updatedAt: -1 });

  if (!dbConfig) {
    console.error('❌ No config found in MongoDB');
    process.exit(1);
  }

  const config = dbConfig.toObject();
  const informal = { ...config.informal };

  // ══════════════════════════════════════════════════════════════════
  // ACCOUNT C: Reels
  // ══════════════════════════════════════════════════════════════════
  console.log('\n\n' + '─'.repeat(60));
  console.log('🎬 STEP 1: Reels → Account C');
  console.log('─'.repeat(60));

  const reelsDir = path.join(PUBLIC_DIR, 'images/beyondCode/reels');
  if (fs.existsSync(reelsDir) && informal.reels?.length) {
    const reelFiles = fs.readdirSync(reelsDir)
      .filter(f => /\.(mp4|mov|webm)$/i.test(f))
      .sort();

    console.log(`\n  ${reelFiles.length} reel videos to upload:`);

    for (let i = 0; i < Math.min(informal.reels.length, reelFiles.length); i++) {
      const filePath = path.join(reelsDir, reelFiles[i]);
      const fileSize = (fs.statSync(filePath).size / 1024 / 1024).toFixed(1);
      
      // Check if already uploaded to avoid re-uploading if it partially succeeded earlier
      if (informal.reels[i].src && informal.reels[i].src.includes('res.cloudinary.com')) {
        console.log(`\n  🎬 Reel ${i + 1}/${informal.reels.length} (${fileSize}MB) - ALREADY UPLOADED ✅`);
        continue;
      }
      
      console.log(`\n  🎬 Reel ${i + 1}/${informal.reels.length} (${fileSize}MB):`);
      
      let success = false;
      let retries = 3;
      
      while (!success && retries > 0) {
        try {
          informal.reels[i].src = await uploadFile(filePath, 'beyondCode/reels', ACCOUNT_C);
          success = true;
          await sleep(1000);
        } catch (err) {
          retries--;
          console.log(`  ⚠️ Retrying... (${retries} retries left)`);
          await sleep(5000);
        }
      }
      
      if (!success) {
        console.log('  ❌ Failed to upload this reel after multiple retries.');
      }
    }
  } else {
    console.log('  ⚠️  No reels directory or no reels in config');
  }

  // ══════════════════════════════════════════════════════════════════
  // Update MongoDB
  // ══════════════════════════════════════════════════════════════════
  console.log('\n\n' + '─'.repeat(60));
  console.log('🗄️  Updating MongoDB config...');
  console.log('─'.repeat(60));

  await ConfigModel.updateOne(
    { _id: dbConfig._id },
    {
      $set: {
        informal: informal,
      },
    }
  );

  console.log('  ✅ MongoDB config updated!');
  await mongoose.disconnect();

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log(`✅ Done!`);
  console.log('═'.repeat(60));
}

main().catch((err) => {
  console.error('\n❌ Failed:', err);
  mongoose.disconnect().catch(() => {});
  process.exit(1);
});
