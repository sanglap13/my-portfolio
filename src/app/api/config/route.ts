import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/utils/mongoose';
import ConfigModel from '@/models/Config';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE_PATH = path.join(process.cwd(), 'src/data/config.json');

// GET: Return full config
export async function GET() {
  try {
    await dbConnect();
    const config = await ConfigModel.findOne().sort({ updatedAt: -1 });

    if (!config) {
      return NextResponse.json({ error: 'No config found.' }, { status: 404 });
    }

    const data = config.toObject();
    
    // Merge with SKELETON_CONFIG to ensure all fields exist
    const { SKELETON_CONFIG } = require('@/utils/config');
    const finalData = { 
      ...SKELETON_CONFIG, 
      ...data,
      global: {
        ...SKELETON_CONFIG.global,
        ...(data.global || {}),
        underConstruction: {
          ...SKELETON_CONFIG.global.underConstruction,
          ...(data.global?.underConstruction || {})
        }
      },
      informal: {
        ...SKELETON_CONFIG.informal,
        ...(data.informal || {}),
        heroText: { ...SKELETON_CONFIG.informal.heroText, ...(data.informal?.heroText || {}) },
        badge: { ...SKELETON_CONFIG.informal.badge, ...(data.informal?.badge || {}) },
        gallery: { 
          ...SKELETON_CONFIG.informal.gallery, 
          ...(data.informal?.gallery || {}),
          items: data.informal?.gallery?.items || SKELETON_CONFIG.informal.gallery.items 
        },
        followSection: { ...SKELETON_CONFIG.informal.followSection, ...(data.informal?.followSection || {}) },
        stats: data.informal?.stats || SKELETON_CONFIG.informal.stats
      }
    };

    delete finalData._id;
    delete finalData.__v;
    delete finalData.createdAt;
    delete finalData.updatedAt;

    return NextResponse.json(finalData);
  } catch (error) {
    console.error('Config GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch config.' }, { status: 500 });
  }
}

// PATCH: Partial update
export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const patch = await req.json();

    // Find the current config
    const config = await ConfigModel.findOne().sort({ updatedAt: -1 });

    if (!config) {
      return NextResponse.json({ error: 'No config found to update.' }, { status: 404 });
    }

    // Deep merge: for each top-level key in the patch, replace the entire section
    for (const key of Object.keys(patch)) {
      config.set(key, patch[key]);
    }
    config.markModified('global');
    config.markModified('overlay');
    config.markModified('about');
    config.markModified('experience');
    config.markModified('projects');
    config.markModified('community');
    config.markModified('informal');
    config.markModified('sequences');
    config.markModified('footer');

    await config.save();

    // Trigger revalidation for all pages that use the config
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/experience');
    revalidatePath('/projects');
    revalidatePath('/community');
    revalidatePath('/informal');
    revalidatePath('/contact');

    console.log('✅ Config updated in MongoDB and revalidation triggered.');
    
    const configData = config.toObject();
    delete configData._id;
    delete configData.__v;
    delete configData.createdAt;
    delete configData.updatedAt;

    return NextResponse.json({ success: true, data: configData });
  } catch (error) {
    console.error('Config PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update config.' }, { status: 500 });
  }
}
