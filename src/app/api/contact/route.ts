import { NextResponse } from 'next/server';
import dbConnect from '@/utils/mongoose';
import ContactRequest from '@/models/ContactRequest';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { intent, senderEmail, senderName, message } = body;

    if (!intent || !senderEmail) {
      return NextResponse.json(
        { error: 'Intent and email are required.' },
        { status: 400 }
      );
    }

    const newRequest = await ContactRequest.create({
      intent,
      senderEmail,
      senderName,
      message,
    });

    return NextResponse.json({ success: true, data: newRequest }, { status: 201 });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact request.' },
      { status: 500 }
    );
  }
}
