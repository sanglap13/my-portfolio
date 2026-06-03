/**
 * Re-upload images & reels from local public/ to new Cloudinary accounts.
 * 
 * Sequences were uploaded to Account A already.
 * This script handles:
 *   - Hero image, gallery photos, community event images → Account B
 *   - Reel videos → Account C
 *
 * Usage: npx tsx scripts/reupload-images-reels.ts
 */

import { config as dotenvConfig } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

dotenvConfig();

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

// ─── Account Config ────────────────────────────────────────────────
const ACCOUNT_B = {
  name: 'Images',
  cloud_name: process.env.CLOUDINARY_B_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_B_API_KEY || '',
  api_secret: process.env.CLOUDINARY_B_API_SECRET || '',
};

const ACCOUNT_C = {
  name: 'Reels',
  cloud_name: process.env.CLOUDINARY_C_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_C_API_KEY || '',
  api_secret: process.env.CLOUDINARY_C_API_SECRET || '',
};

// ─── Explicit mapping: MongoDB event index → local folder name ─────
// Based on verified analysis of folder contents and image counts
const COMMUNITY_FOLDER_MAP: Record<number, string> = {
  0:  'gdsc',                    // Google Developer Student Clubs Lead (7 imgs)
  1:  'rebase_2024',             // Speaker at Rebase (4 imgs)
  2:  'fossKolkata_2024',        // Speaker at Kolkata Foss Meetup (2 imgs)
  3:  'devfest_durgapur_2024',   // Speaker at Devfest Durgapur 2024 (7 imgs)
  4:  'gdgoc_techWinterBreak',   // Speaker at Tech Winter Break (1 img)
  5:  'smash_2024',              // Judge at Smash Hackathon (3 imgs)
  6:  'devfest_ahlen_2024',      // Speaker at Devfest Ahlen 2024 (3 imgs)
  7:  'sih_2024',                // Mentor at SIH Finals 2024 (4 imgs)
  8:  'diversion_2025',          // Mentor/Judge at Diversion 2025 (3 imgs)
  9:  'binary_2025',             // Mentor/Judge at Binary 2025 (4 imgs)
  10: 'hacktonix_2025',          // Judge at Hacktonix (2 imgs)
  11: 'hack4bengal_2025',        // Mentor at Hack4Bengal (3 imgs)
  12: 'hexafalls_2025',          // Judge at Hexafalls (3 imgs)
  13: 'ignitaverse',             // Judge at Ignitaverse (1 img)
  14: 'statusCode_2025',         // Mentor/Judge at StatusCode2 (2 imgs)
  15: 'metamorph_2025',          // Judge at Metamorph 2025 (3 imgs)
  16: 'hackspire_2025',          // Judge at Hackspire 2025 (3 imgs)
  17: 'cloudkraft_2026',         // Speaker at Cloudkraft 2026 (4 imgs)
  18: 'diversion_2026',          // Mentor/Judge at Diversion 2026 (4 imgs)
  19: 'binary_2026',             // Judge at Binary V2 2026 (2 imgs)
  20: 'hacktropica_2026',        // Judge at Hacktropica 2026 (4 imgs)
};

function switchAccount(account: typeof ACCOUNT_B) {
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
  account: typeof ACCOUNT_B,
  resourceType: 'image' | 'video' = 'image',
  publicId?: string
): Promise<string> {
  uploadCount++;
  const basename = publicId || path.parse(filePath).name;
  process.stdout.write(
    `  [${uploadCount}] (${account.name}) ${path.basename(filePath)} → portfolio/${folder}/... `
  );

  switchAccount(account);

  try {
    const uploadOptions: any = {
      folder: `portfolio/${folder}`,
      public_id: basename,
      resource_type: resourceType,
      overwrite: true,
      quality: 'auto',
      fetch_format: 'auto',
    };

    let result;
    if (resourceType === 'video') {
      result = (await cloudinary.uploader.upload_large(filePath, {
        ...uploadOptions,
        chunk_size: 6_000_000,
      })) as any;
    } else {
      result = await cloudinary.uploader.upload(filePath, uploadOptions);
    }

    console.log('✅');
    return result.secure_url;
  } catch (error: any) {
    console.log(`❌ ${error.message || error}`);
    throw error;
  }
}

async function main() {
  console.log('═'.repeat(60));
  console.log('🔄 Re-uploading Images & Reels to new Cloudinary accounts');
  console.log('═'.repeat(60));
  console.log(`  Account B (Images): ${ACCOUNT_B.cloud_name}`);
  console.log(`  Account C (Reels):  ${ACCOUNT_C.cloud_name}\n`);

  // Validate env
  const missing: string[] = [];
  if (!ACCOUNT_B.cloud_name) missing.push('CLOUDINARY_B_CLOUD_NAME');
  if (!ACCOUNT_B.api_key) missing.push('CLOUDINARY_B_API_KEY');
  if (!ACCOUNT_B.api_secret) missing.push('CLOUDINARY_B_API_SECRET');
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
  const community = [...config.community];

  // ══════════════════════════════════════════════════════════════════
  // ACCOUNT B: Images
  // ══════════════════════════════════════════════════════════════════
  console.log('\n' + '─'.repeat(60));
  console.log('📸 STEP 1: Images → Account B');
  console.log('─'.repeat(60));

  // 1. Hero image
  const heroPath = path.join(PUBLIC_DIR, 'images/beyondCode/hero/hero.JPG');
  if (fs.existsSync(heroPath)) {
    console.log('\n  🖼️  Hero image:');
    informal.heroImage = await uploadFile(heroPath, 'beyondCode/hero', ACCOUNT_B);
  } else {
    console.log('  ⚠️  Hero image not found locally');
  }

  // 2. Gallery photos
  const galleryDir = path.join(PUBLIC_DIR, 'images/beyondCode/gallery');
  if (fs.existsSync(galleryDir)) {
    const galleryFiles = fs.readdirSync(galleryDir)
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort();
    console.log(`\n  🖼️  Gallery photos (${galleryFiles.length}):`);

    informal.photos = [];
    for (const file of galleryFiles) {
      const url = await uploadFile(path.join(galleryDir, file), 'beyondCode/gallery', ACCOUNT_B);
      informal.photos.push(url);
      await sleep(300);
    }
  }

  // 3. Community event images (using explicit folder mapping)
  console.log(`\n  🏘️  Community events (${community.length}):`);
  const communityBaseDir = path.join(PUBLIC_DIR, 'images/community');

  for (let i = 0; i < community.length; i++) {
    const event = community[i];
    const localFolderName = COMMUNITY_FOLDER_MAP[i];

    if (!localFolderName) {
      console.log(`\n  ⚠️  [${i}] "${event.title}" — no folder mapping, skipping`);
      continue;
    }

    const localFolderPath = path.join(communityBaseDir, localFolderName);
    if (!fs.existsSync(localFolderPath)) {
      console.log(`\n  ⚠️  [${i}] "${event.title}" — folder ${localFolderName}/ not found, skipping`);
      continue;
    }

    const files = fs.readdirSync(localFolderPath)
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort();

    console.log(`\n  📂 [${i}] ${event.title} (${localFolderName}/, ${files.length} files):`);

    const safeTitle = (event.title || `event_${i}`)
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .toLowerCase();

    const newImages: string[] = [];
    for (const file of files) {
      const url = await uploadFile(
        path.join(localFolderPath, file),
        `community/${safeTitle}`,
        ACCOUNT_B
      );
      newImages.push(url);
      await sleep(300);
    }
    community[i].image = newImages;
  }

  // ══════════════════════════════════════════════════════════════════
  // ACCOUNT C: Reels
  // ══════════════════════════════════════════════════════════════════
  console.log('\n\n' + '─'.repeat(60));
  console.log('🎬 STEP 2: Reels → Account C');
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
      console.log(`\n  🎬 Reel ${i + 1}/${informal.reels.length} (${fileSize}MB):`);
      informal.reels[i].src = await uploadFile(filePath, 'beyondCode/reels', ACCOUNT_C, 'video');
      await sleep(1000);
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
        community: community,
      },
    }
  );

  console.log('  ✅ MongoDB config updated!');
  await mongoose.disconnect();

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log(`✅ Done! ${uploadCount} files uploaded.`);
  console.log('═'.repeat(60));
  console.log('\n📋 Next steps:');
  console.log('  1. npm run dev — verify all images and videos load');
  console.log('  2. Deploy to Vercel');
  console.log('  3. Remove old CLOUDINARY_* env vars from Vercel');
}

main().catch((err) => {
  console.error('\n❌ Failed:', err);
  mongoose.disconnect().catch(() => {});
  process.exit(1);
});
