import { config as dotenvConfig } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import path from 'path';

dotenvConfig({ path: '.env' });
if (!process.env.MONGODB_URI) {
  dotenvConfig({ path: '.env.local' });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadLargeFile(filePath: string, publicId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(filePath, {
      resource_type: 'video',
      folder: 'portfolio/beyondCode/reels',
      public_id: publicId,
      chunk_size: 6000000
    }, (error, result) => {
      if (error) reject(error);
      else resolve(result!.secure_url);
    });
  });
}

const ConfigSchema = new mongoose.Schema({
  informal: mongoose.Schema.Types.Mixed,
}, { strict: false });

const ConfigModel = mongoose.models.Config || mongoose.model('Config', ConfigSchema);

async function uploadAndPatch() {
  console.log('🔗 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('✅ Connected.');

  const config = await ConfigModel.findOne().sort({ updatedAt: -1 });
  if (!config) throw new Error('No config found!');

  const informal = config.informal || {};
  if (!informal.reels) informal.reels = [];

  const reelsToUpload = [2, 3, 4];
  
  for (const num of reelsToUpload) {
    const localFile = `/Users/sanglapmridha/Developer/projects/portfolio/public/images/beyondCode/reels/${num}.mp4`;
    console.log(`Uploading ${num}.mp4 (this may take a minute)...`);
    const secureUrl = await uploadLargeFile(localFile, `${num}`);
    console.log(`✅ Uploaded ${num}.mp4 -> ${secureUrl}`);
    
    // Update the corresponding slot in the reels array (0-indexed)
    informal.reels[num - 1].src = secureUrl;
  }

  config.markModified('informal');
  await config.save();
  
  console.log('🎉 Reels fully uploaded and injected into MongoDB!');
  process.exit(0);
}

uploadAndPatch().catch(e => {
  console.error(e);
  process.exit(1);
});
