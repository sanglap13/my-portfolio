import { NextResponse } from 'next/server';
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
    delete data._id;
    delete data.__v;
    delete data.createdAt;
    delete data.updatedAt;

    return NextResponse.json(data);
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
    config.markModified('overlay');
    config.markModified('about');
    config.markModified('experience');
    config.markModified('projects');
    config.markModified('community');
    config.markModified('informal');
    config.markModified('footer');

    await config.save();

    console.log('✅ Config updated in MongoDB via dashboard PATCH.');
    
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
