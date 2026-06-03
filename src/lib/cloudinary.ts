import { v2 as cloudinary } from 'cloudinary';

// ─── Multi-Account Configuration ───────────────────────────────────
// Account A → Sequences (scroll animation frames)
// Account B → Images (community, gallery, hero, projects)
// Account C → Reels (videos)

interface CloudinaryAccount {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

const ACCOUNT_A: CloudinaryAccount = {
  cloud_name: process.env.CLOUDINARY_A_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_A_API_KEY || '',
  api_secret: process.env.CLOUDINARY_A_API_SECRET || '',
};

const ACCOUNT_B: CloudinaryAccount = {
  cloud_name: process.env.CLOUDINARY_B_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_B_API_KEY || '',
  api_secret: process.env.CLOUDINARY_B_API_SECRET || '',
};

const ACCOUNT_C: CloudinaryAccount = {
  cloud_name: process.env.CLOUDINARY_C_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_C_API_KEY || '',
  api_secret: process.env.CLOUDINARY_C_API_SECRET || '',
};

/**
 * Determine which Cloudinary account to use based on folder and resource type.
 *   - Sequences (folder starts with "sequence") → Account A
 *   - Videos (resourceType === "video") → Account C
 *   - Everything else (images, community, gallery, hero, projects) → Account B
 */
function getAccount(folder: string, resourceType: 'image' | 'video' = 'image'): CloudinaryAccount {
  if (folder.startsWith('sequence')) {
    return ACCOUNT_A;
  }
  if (resourceType === 'video' || folder.includes('reels')) {
    return ACCOUNT_C;
  }
  return ACCOUNT_B;
}

function switchAccount(account: CloudinaryAccount) {
  cloudinary.config({
    cloud_name: account.cloud_name,
    api_key: account.api_key,
    api_secret: account.api_secret,
  });
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string,
  resourceType: 'image' | 'video' = 'image'
): Promise<string> {
  const account = getAccount(folder, resourceType);
  switchAccount(account);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `portfolio/${folder}`,
        resource_type: resourceType,
        quality: 'auto',
        fetch_format: 'auto',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  // Default to Account B for deletions (most common use case)
  switchAccount(ACCOUNT_B);
  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
