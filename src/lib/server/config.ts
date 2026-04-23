import { Config, SKELETON_CONFIG } from '@/utils/config';
import dbConnect from '@/utils/mongoose';
import ConfigModel from '@/models/Config';

/**
 * Server-only utility to fetch config directly from MongoDB.
 * Replaces the old static file read to support dynamic updates on Vercel.
 */
export async function getServerConfig(): Promise<Config> {
  try {
    await dbConnect();
    const dbConfig = await ConfigModel.findOne().sort({ updatedAt: -1 });
    
    if (dbConfig) {
      const configData = dbConfig.toObject();
      return { ...SKELETON_CONFIG, ...configData } as Config;
    }
  } catch (error) {
    console.error('Server Config Loader: Database fetch failed.', error);
  }
  
  return SKELETON_CONFIG;
}
