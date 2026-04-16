import fs from 'fs';
import path from 'path';
import { Config, SKELETON_CONFIG } from '@/utils/config';

/**
 * Server-only utility to read config.json.
 * This file should NEVER be imported by a Client Component.
 */
export function getServerConfig(): Config {
  try {
    const configPath = path.join(process.cwd(), 'src/data/config.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
  } catch (error) {
    console.error('Server Config Loader: config.json missing or invalid.');
  }
  
  return SKELETON_CONFIG;
}
