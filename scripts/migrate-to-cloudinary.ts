/**
 * FULL Migration Script: Upload ALL public/ assets to Cloudinary
 * and update code references.
 *
 * Usage: npx tsx scripts/migrate-to-cloudinary.ts
 *
 * This handles:
 * - sequence/ frames (scrolly hero animation)
 * - sequence_exp/ frames (experience hero)
 * - sequence_com/ frames (community hero)
 * - sequence_beyond/ frames (informal hero)
 * - images/beyondCode/ (hero, reels, gallery)
 * - images/community/ (event photos)
 */

import { config as dotenvConfig } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

dotenvConfig();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(PROJECT_ROOT, 'src/data/config.json');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

// Track all results
const results: { local: string; cdn: string }[] = [];
let uploadCount = 0;

async function uploadFile(
  filePath: string,
  folder: string,
  resourceType: 'image' | 'video' | 'raw' = 'image',
  publicId?: string
): Promise<string> {
  uploadCount++;
  const basename = publicId || path.parse(filePath).name;
  process.stdout.write(`  [${uploadCount}] ${path.basename(filePath)} → portfolio/${folder}/... `);

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
      // Use chunked upload for large video files
      result = await cloudinary.uploader.upload_large(filePath, {
        ...uploadOptions,
        chunk_size: 6_000_000, // 6MB chunks
      }) as any;
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

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── SEQUENCE FRAMES ───────────────────────────────────────────────
async function migrateSequenceFolder(folderName: string): Promise<string> {
  const folderPath = path.join(PUBLIC_DIR, folderName);
  if (!fs.existsSync(folderPath)) {
    console.log(`  ⚠️  ${folderName}/ not found, skipping`);
    return '';
  }

  const files = fs.readdirSync(folderPath).filter((f) => f.endsWith('.webp')).sort();
  console.log(`\n🎞️  Migrating ${folderName}/ (${files.length} frames)...`);

  let baseUrl = '';

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(folderPath, file);
    // Use the filename without extension as the public_id
    const publicId = path.parse(file).name;

    const url = await uploadFile(filePath, `sequence/${folderName}`, 'image', publicId);
    results.push({ local: `/${folderName}/${file}`, cdn: url });

    if (i === 0) {
      // Extract the base URL pattern (everything before the frame-specific part)
      // e.g., "https://res.cloudinary.com/xxx/image/upload/v123/portfolio/sequence/sequence/"
      baseUrl = url.replace(publicId + '.webp', '');
    }

    // Small delay to avoid rate limiting (Cloudinary free tier)
    if (i % 10 === 0 && i > 0) await sleep(500);
  }

  return baseUrl;
}

// ─── CONFIG IMAGES ─────────────────────────────────────────────────
async function migrateConfigAssets() {
  console.log('\n📋 Migrating config.json assets...');

  const configRaw = fs.readFileSync(CONFIG_PATH, 'utf8');
  const config = JSON.parse(configRaw);
  const informal = config.informal;

  // Hero image
  if (informal.heroImage && informal.heroImage.startsWith('/')) {
    const localPath = path.join(PUBLIC_DIR, informal.heroImage);
    if (fs.existsSync(localPath)) {
      console.log('\n  📸 Hero image...');
      const url = await uploadFile(localPath, 'beyondCode/hero');
      results.push({ local: informal.heroImage, cdn: url });
      informal.heroImage = url;
    }
  }

  // Reels
  if (informal.reels?.length) {
    console.log(`\n  🎬 ${informal.reels.length} reels...`);
    for (let i = 0; i < informal.reels.length; i++) {
      const reel = informal.reels[i];
      if (reel.src && reel.src.startsWith('/')) {
        const localPath = path.join(PUBLIC_DIR, reel.src);
        if (fs.existsSync(localPath)) {
          const url = await uploadFile(localPath, 'beyondCode/reels', 'video');
          results.push({ local: reel.src, cdn: url });
          informal.reels[i].src = url;
        }
      }
    }
  }

  // Gallery photos
  if (informal.photos?.length) {
    console.log(`\n  🖼️  ${informal.photos.length} gallery photos...`);
    for (let i = 0; i < informal.photos.length; i++) {
      const photo = informal.photos[i];
      if (photo && photo.startsWith('/')) {
        const localPath = path.join(PUBLIC_DIR, photo);
        if (fs.existsSync(localPath)) {
          const url = await uploadFile(localPath, 'beyondCode/gallery');
          results.push({ local: photo, cdn: url });
          informal.photos[i] = url;
        }
      }
    }
  }

  // Community images
  if (config.community?.length) {
    console.log(`\n  🏘️  Community event images...`);
    for (let i = 0; i < config.community.length; i++) {
      const event = config.community[i];
      if (event.image && Array.isArray(event.image)) {
        for (let j = 0; j < event.image.length; j++) {
          const img = event.image[j];
          if (img && img.startsWith('/')) {
            const localPath = path.join(PUBLIC_DIR, img);
            if (fs.existsSync(localPath)) {
              const safeTitle = (event.title || `event_${i}`).replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
              const url = await uploadFile(localPath, `community/${safeTitle}`);
              results.push({ local: img, cdn: url });
              config.community[i].image[j] = url;
            }
          }
        }
      }
    }
  }

  // Save updated config
  console.log('\n💾 Saving updated config.json...');
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
}

// ─── UPDATE SOURCE CODE FOR SEQUENCES ──────────────────────────────
function updateSequenceReferences(baseUrls: Record<string, string>) {
  console.log('\n📝 Updating source code with Cloudinary sequence URLs...');

  const updates: { file: string; search: string; replace: string }[] = [
    {
      file: 'src/components/ScrollyCanvas.tsx',
      search: '`/sequence/frame_${paddedIndex}_delay-0.066s.webp`',
      replace: `\`${baseUrls['sequence']}frame_\${paddedIndex}_delay-0.066s.webp\``,
    },
    {
      file: 'src/components/ExperienceHero.tsx',
      search: '`/sequence_exp/frame_${paddedIndex}_delay-0.041s.webp`',
      replace: `\`${baseUrls['sequence_exp']}frame_\${paddedIndex}_delay-0.041s.webp\``,
    },
    {
      file: 'src/components/CommunityHero.tsx',
      search: '`/sequence_com/frame_${paddedIndex}_delay-0.041s.webp`',
      replace: `\`${baseUrls['sequence_com']}frame_\${paddedIndex}_delay-0.041s.webp\``,
    },
    {
      file: 'src/components/InformalHero.tsx',
      search: '`/sequence_beyond/frame_${paddedIndex}_delay-0.041s.webp`',
      replace: `\`${baseUrls['sequence_beyond']}frame_\${paddedIndex}_delay-0.041s.webp\``,
    },
  ];

  for (const update of updates) {
    const filePath = path.join(PROJECT_ROOT, update.file);
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️  ${update.file} not found, skipping`);
      continue;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(update.search)) {
      content = content.replace(update.search, update.replace);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ Updated ${update.file}`);
    } else {
      console.log(`  ⚠️  Pattern not found in ${update.file} (may already be updated)`);
    }
  }
}

// ─── MAIN ──────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 FULL Cloudinary Migration — Moving ALL assets from public/\n');
  console.log(`   Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`   Total public/ files: 735`);
  console.log('');

  // 1. Sequence frames — ALREADY UPLOADED, using known base URLs
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const baseUrls: Record<string, string> = {
    sequence: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1/portfolio/sequence/sequence/`,
    sequence_exp: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1/portfolio/sequence/sequence_exp/`,
    sequence_com: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1/portfolio/sequence/sequence_com/`,
    sequence_beyond: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1/portfolio/sequence/sequence_beyond/`,
  };
  console.log('⏭️  Skipping sequence uploads (already done)\n');

  // 2. Config-referenced assets (images/beyondCode, images/community)
  await migrateConfigAssets();

  // 3. Update source code with Cloudinary URLs for sequences
  if (Object.values(baseUrls).some((u) => u)) {
    updateSequenceReferences(baseUrls);
  }

  // Summary
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`✅ Migration complete! ${results.length} files uploaded.`);
  console.log(`${'═'.repeat(60)}`);
  console.log('\nNext steps:');
  console.log('  1. Test the site locally: npm run dev');
  console.log('  2. If everything works, empty public/ (keep only favicon):');
  console.log('     rm -rf public/sequence* public/images');
  console.log('  3. Commit and deploy!');
}

main().catch((err) => {
  console.error('\n❌ Migration failed:', err);
  process.exit(1);
});
