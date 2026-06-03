import { config as dotenvConfig } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
dotenvConfig();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_C_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_C_API_KEY,
  api_secret: process.env.CLOUDINARY_C_API_SECRET,
});
async function test() {
  const result = await cloudinary.uploader.upload_large('public/images/beyondCode/reels/1.mp4', {
    folder: 'portfolio/test',
    resource_type: 'video',
    chunk_size: 6000000
  });
  console.log(result);
}
test();
