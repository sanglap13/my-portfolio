/**
 * Multi-Account Cloudinary Migration Script
 * 
 * Splits assets across 3 Cloudinary accounts to stay within free tier limits:
 *   Account A → Sequence frames (~48MB, 655 files)
 *   Account B → Images: community photos, gallery, hero (~180MB)
 *   Account C → Reels/Videos (~230MB, 4 videos)
 *
 * Usage:
 *   1. Add credentials to .env (see below)
 *   2. npx tsx scripts/migrate-multi-cloudinary.ts
 *
 * Required .env variables:
 *   # Account A — Sequences
 *   CLOUDINARY_A_CLOUD_NAME=xxx
 *   CLOUDINARY_A_API_KEY=xxx
 *   CLOUDINARY_A_API_SECRET=xxx
 *
 *   # Account B — Images  
 *   CLOUDINARY_B_CLOUD_NAME=xxx
 *   CLOUDINARY_B_API_KEY=xxx
 *   CLOUDINARY_B_API_SECRET=xxx
 *
 *   # Account C — Reels
 *   CLOUDINARY_C_CLOUD_NAME=xxx
 *   CLOUDINARY_C_API_KEY=xxx
 *   CLOUDINARY_C_API_SECRET=xxx
 *
 *   # MongoDB (for updating config)
 *   MONGODB_URI=xxx
 */

import { config as dotenvConfig } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

dotenvConfig();

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

// ─── Account Configuration ────────────────────────────────────────
interface CloudinaryAccount {
  name: string;
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

const ACCOUNTS: Record<'A' | 'B' | 'C', CloudinaryAccount> = {
  A: {
    name: 'Sequences',
    cloud_name: process.env.CLOUDINARY_A_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_A_API_KEY || '',
    api_secret: process.env.CLOUDINARY_A_API_SECRET || '',
  },
  B: {
    name: 'Images',
    cloud_name: process.env.CLOUDINARY_B_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_B_API_KEY || '',
    api_secret: process.env.CLOUDINARY_B_API_SECRET || '',
  },
  C: {
    name: 'Reels',
    cloud_name: process.env.CLOUDINARY_C_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_C_API_KEY || '',
    api_secret: process.env.CLOUDINARY_C_API_SECRET || '',
  },
};

// ─── Helpers ───────────────────────────────────────────────────────
function switchAccount(account: CloudinaryAccount) {
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
const results: { local: string; cdn: string; account: string }[] = [];

async function uploadFile(
  filePath: string,
  folder: string,
  account: CloudinaryAccount,
  resourceType: 'image' | 'video' | 'raw' = 'image',
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
      // Don't auto-transform sequence frames — they need exact naming
      ...(folder.startsWith('sequence') ? {} : { quality: 'auto', fetch_format: 'auto' }),
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
    results.push({ local: filePath, cdn: result.secure_url, account: account.name });
    return result.secure_url;
  } catch (error: any) {
    console.log(`❌ ${error.message || error}`);
    throw error;
  }
}

// ─── ACCOUNT A: Sequence Frames ────────────────────────────────────
async function migrateSequences(): Promise<Record<string, string>> {
  const account = ACCOUNTS.A;
  const baseUrls: Record<string, string> = {};

  const sequenceFolders = [
    { name: 'sequence', count: 111 },
    { name: 'sequence_exp', count: 192 },
    { name: 'sequence_com', count: 181 },
    { name: 'sequence_beyond', count: 171 },
  ];

  for (const seq of sequenceFolders) {
    const folderPath = path.join(PUBLIC_DIR, seq.name);
    if (!fs.existsSync(folderPath)) {
      console.log(`  ⚠️  ${seq.name}/ not found, skipping`);
      continue;
    }

    const files = fs.readdirSync(folderPath).filter((f) => f.endsWith('.webp')).sort();
    console.log(`\n🎞️  Migrating ${seq.name}/ (${files.length} frames) → Account A...`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(folderPath, file);
      const publicId = path.parse(file).name;

      const url = await uploadFile(filePath, `sequence/${seq.name}`, account, 'image', publicId);

      if (i === 0) {
        // Extract base URL from first upload
        baseUrls[seq.name] = url.replace(publicId + '.webp', '');
      }

      // Rate limiting - pause every 10 uploads
      if (i % 10 === 0 && i > 0) await sleep(500);
    }
  }

  return baseUrls;
}

// ─── ACCOUNT B: Images (hero, gallery, community) ──────────────────
async function migrateImages(mongoConfig: any): Promise<any> {
  const account = ACCOUNTS.B;
  const informal = mongoConfig.informal || {};
  const community = mongoConfig.community || [];

  // 1. Hero image
  if (informal.heroImage && informal.heroImage.startsWith('/')) {
    const localPath = path.join(PUBLIC_DIR, informal.heroImage);
    if (fs.existsSync(localPath)) {
      console.log('\n📸 Migrating hero image → Account B...');
      informal.heroImage = await uploadFile(localPath, 'beyondCode/hero', account);
    }
  }

  // 2. Gallery photos (informal.photos)
  if (informal.photos?.length) {
    console.log(`\n🖼️  Migrating ${informal.photos.length} gallery photos → Account B...`);
    for (let i = 0; i < informal.photos.length; i++) {
      const photo = informal.photos[i];
      if (photo && photo.startsWith('/')) {
        const localPath = path.join(PUBLIC_DIR, photo);
        if (fs.existsSync(localPath)) {
          informal.photos[i] = await uploadFile(localPath, 'beyondCode/gallery', account);
          await sleep(300);
        }
      }
    }
  }

  // 3. Community event images
  if (community.length) {
    console.log(`\n🏘️  Migrating community event images (${community.length} events) → Account B...`);
    for (let i = 0; i < community.length; i++) {
      const event = community[i];
      if (event.image && Array.isArray(event.image)) {
        for (let j = 0; j < event.image.length; j++) {
          const img = event.image[j];
          if (img && img.startsWith('/')) {
            const localPath = path.join(PUBLIC_DIR, img);
            if (fs.existsSync(localPath)) {
              const safeTitle = (event.title || `event_${i}`)
                .replace(/[^a-zA-Z0-9_]/g, '_')
                .toLowerCase();
              community[i].image[j] = await uploadFile(
                localPath,
                `community/${safeTitle}`,
                account
              );
              await sleep(300);
            }
          }
        }
      }
    }
  }

  return { informal, community };
}

// ─── ACCOUNT C: Reels (videos) ─────────────────────────────────────
async function migrateReels(mongoConfig: any): Promise<any> {
  const account = ACCOUNTS.C;
  const informal = mongoConfig.informal || {};

  if (informal.reels?.length) {
    console.log(`\n🎬 Migrating ${informal.reels.length} reels → Account C...`);
    for (let i = 0; i < informal.reels.length; i++) {
      const reel = informal.reels[i];
      if (reel.src && reel.src.startsWith('/')) {
        const localPath = path.join(PUBLIC_DIR, reel.src);
        if (fs.existsSync(localPath)) {
          informal.reels[i].src = await uploadFile(
            localPath,
            'beyondCode/reels',
            account,
            'video'
          );
          // Videos take longer, larger delay
          await sleep(1000);
        }
      }
    }
  }

  return { informal };
}

// ─── MongoDB Update ────────────────────────────────────────────────
async function updateMongoDB(
  sequenceBaseUrls: Record<string, string>,
  updatedInformal: any,
  updatedCommunity: any
) {
  console.log('\n🗄️  Updating MongoDB config...');

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.log('  ⚠️  MONGODB_URI not set. Skipping MongoDB update.');
    console.log('  You will need to update the config manually via your dashboard.');
    return;
  }

  await mongoose.connect(MONGODB_URI);

  const ConfigModel =
    mongoose.models.Config ||
    mongoose.model(
      'Config',
      new mongoose.Schema({}, { strict: false, timestamps: true })
    );

  const existingConfig = await ConfigModel.findOne().sort({ updatedAt: -1 });

  if (!existingConfig) {
    console.log('  ❌ No config found in MongoDB. Create one first via your dashboard.');
    await mongoose.disconnect();
    return;
  }

  const updates: any = {};

  // Update sequences
  if (Object.keys(sequenceBaseUrls).length > 0) {
    const seqMap: Record<string, { key: string; frameCount: number; framePattern: string }> = {
      sequence: { key: 'hero', frameCount: 111, framePattern: 'frame_{index}_delay-0.066s.webp' },
      sequence_exp: { key: 'experience', frameCount: 192, framePattern: 'frame_{index}_delay-0.041s.webp' },
      sequence_com: { key: 'community', frameCount: 181, framePattern: 'frame_{index}_delay-0.041s.webp' },
      sequence_beyond: { key: 'informal', frameCount: 171, framePattern: 'frame_{index}_delay-0.041s.webp' },
    };

    const sequences: any = {};
    for (const [folder, baseUrl] of Object.entries(sequenceBaseUrls)) {
      const meta = seqMap[folder];
      if (meta) {
        sequences[meta.key] = {
          baseUrl,
          frameCount: meta.frameCount,
          framePattern: meta.framePattern,
        };
      }
    }
    updates.sequences = sequences;
  }

  // Update informal (hero image, gallery photos, reels)
  if (updatedInformal) {
    const currentInformal = existingConfig.toObject().informal || {};
    updates.informal = {
      ...currentInformal,
      heroImage: updatedInformal.heroImage || currentInformal.heroImage,
      photos: updatedInformal.photos || currentInformal.photos,
      reels: updatedInformal.reels || currentInformal.reels,
    };
  }

  // Update community
  if (updatedCommunity) {
    updates.community = updatedCommunity;
  }

  await ConfigModel.updateOne({ _id: existingConfig._id }, { $set: updates });
  console.log('  ✅ MongoDB config updated successfully!');

  await mongoose.disconnect();
}

// ─── Validation ────────────────────────────────────────────────────
function validateCredentials() {
  const missing: string[] = [];

  for (const [key, account] of Object.entries(ACCOUNTS)) {
    if (!account.cloud_name) missing.push(`CLOUDINARY_${key}_CLOUD_NAME`);
    if (!account.api_key) missing.push(`CLOUDINARY_${key}_API_KEY`);
    if (!account.api_secret) missing.push(`CLOUDINARY_${key}_API_SECRET`);
  }

  if (missing.length > 0) {
    console.error('❌ Missing environment variables:');
    missing.forEach((v) => console.error(`   - ${v}`));
    console.error('\nAdd them to your .env file. See script header for details.');
    process.exit(1);
  }
}

// ─── MAIN ──────────────────────────────────────────────────────────
async function main() {
  console.log('═'.repeat(60));
  console.log('🚀 Multi-Account Cloudinary Migration');
  console.log('═'.repeat(60));
  console.log(`\n  Account A (Sequences): ${ACCOUNTS.A.cloud_name}`);
  console.log(`  Account B (Images):    ${ACCOUNTS.B.cloud_name}`);
  console.log(`  Account C (Reels):     ${ACCOUNTS.C.cloud_name}`);
  console.log('');

  validateCredentials();

  // Connect to MongoDB to get current config
  const MONGODB_URI = process.env.MONGODB_URI;
  let mongoConfig: any = {};

  if (MONGODB_URI) {
    console.log('📡 Fetching current config from MongoDB...');
    await mongoose.connect(MONGODB_URI);
    const ConfigModel =
      mongoose.models.Config ||
      mongoose.model(
        'Config',
        new mongoose.Schema({}, { strict: false, timestamps: true })
      );
    const dbConfig = await ConfigModel.findOne().sort({ updatedAt: -1 });
    if (dbConfig) {
      mongoConfig = dbConfig.toObject();
      console.log('  ✅ Config loaded from MongoDB\n');
    } else {
      console.log('  ⚠️  No config in MongoDB. Will only upload sequences.\n');
    }
    await mongoose.disconnect();
  } else {
    console.log('⚠️  MONGODB_URI not set. Will only upload sequences.\n');
  }

  // ── Step 1: Upload sequences to Account A ──
  console.log('\n' + '─'.repeat(60));
  console.log('📦 STEP 1: Sequences → Account A');
  console.log('─'.repeat(60));
  const sequenceBaseUrls = await migrateSequences();

  // ── Step 2: Upload images to Account B ──
  console.log('\n' + '─'.repeat(60));
  console.log('📦 STEP 2: Images → Account B');
  console.log('─'.repeat(60));
  const imageResult = await migrateImages(mongoConfig);

  // ── Step 3: Upload reels to Account C ──
  console.log('\n' + '─'.repeat(60));
  console.log('📦 STEP 3: Reels → Account C');
  console.log('─'.repeat(60));
  const reelResult = await migrateReels(mongoConfig);

  // Merge informal updates (images from B + reels from C)
  const mergedInformal = {
    ...mongoConfig.informal,
    heroImage: imageResult.informal.heroImage,
    photos: imageResult.informal.photos,
    reels: reelResult.informal.reels,
  };

  // ── Step 4: Update MongoDB ──
  console.log('\n' + '─'.repeat(60));
  console.log('📦 STEP 4: Update MongoDB Config');
  console.log('─'.repeat(60));
  await updateMongoDB(sequenceBaseUrls, mergedInformal, imageResult.community);

  // ── Summary ──
  console.log('\n' + '═'.repeat(60));
  console.log(`✅ Migration complete! ${results.length} files uploaded.`);
  console.log('═'.repeat(60));

  const byAccount = results.reduce((acc, r) => {
    acc[r.account] = (acc[r.account] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\nBreakdown:');
  for (const [account, count] of Object.entries(byAccount)) {
    console.log(`  ${account}: ${count} files`);
  }

  console.log('\n📋 Next steps:');
  console.log('  1. Test the site: npm run dev');
  console.log('  2. Verify all images/videos load correctly');
  console.log('  3. Deploy to Vercel');
  console.log('  4. Update Vercel env vars (remove old CLOUDINARY_* vars)');
}

main().catch((err) => {
  console.error('\n❌ Migration failed:', err);
  mongoose.disconnect().catch(() => {});
  process.exit(1);
});
