/**
 * Targeted patch for MongoDB reels.
 */
import { config as dotenvConfig } from 'dotenv';
import mongoose from 'mongoose';

dotenvConfig({ path: '.env' });
if (!process.env.MONGODB_URI) {
  dotenvConfig({ path: '.env.local' });
}

const ConfigSchema = new mongoose.Schema({
  informal: mongoose.Schema.Types.Mixed,
}, { strict: false });

const ConfigModel = mongoose.models.Config || mongoose.model('Config', ConfigSchema);

async function patchMongo() {
  console.log('🔗 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('✅ Connected.');

  const config = await ConfigModel.findOne().sort({ updatedAt: -1 });
  if (!config) throw new Error('No config found!');

  const informal = config.informal || {};
  if (!informal.reels) informal.reels = [];

  const reelsData = [
    {
      src: "https://res.cloudinary.com/dh6pwbdn2/video/upload/v1/portfolio/beyondCode/reels/1.mp4",
      youtubeUrl: "https://www.youtube.com/shorts/0_aEyHILpZM",
      instaUrl: "",
      views: "145.2K Views",
      likes: "13.4K Likes",
      title: "Mountain Run"
    },
    {
      src: "https://res.cloudinary.com/dh6pwbdn2/video/upload/v1/portfolio/beyondCode/reels/2.mp4",
      youtubeUrl: "https://www.youtube.com/shorts/om57HcEzXig",
      instaUrl: "",
      views: "89.1K Views",
      likes: "8.2K Likes",
      title: "Sunset Cruise"
    },
    {
      src: "https://res.cloudinary.com/dh6pwbdn2/video/upload/v1/portfolio/beyondCode/reels/3.mp4",
      youtubeUrl: "https://www.youtube.com/shorts/cDrn1Sui32w",
      instaUrl: "",
      views: "210.5K Views",
      likes: "21.1K Likes",
      title: "Track Day"
    },
    {
      src: "https://res.cloudinary.com/dh6pwbdn2/video/upload/v1/portfolio/beyondCode/reels/4.mp4",
      youtubeUrl: "https://www.youtube.com/shorts/BCIKPAHxtHY",
      instaUrl: "",
      views: "112.3K Views",
      likes: "10.5K Likes",
      title: "City Nights"
    }
  ];

  config.informal.reels = reelsData;
  config.markModified('informal');
  await config.save();
  
  console.log('🎉 Reels injected successfully directly to MongoDB!');
  process.exit(0);
}

patchMongo().catch(e => {
  console.error(e);
  process.exit(1);
});
