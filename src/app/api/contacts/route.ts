import { NextResponse } from 'next/server';
import dbConnect from '@/utils/mongoose';
import ContactRequest from '@/models/ContactRequest';

// GET: Fetch all contact requests
export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const intent = searchParams.get('intent');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const filter: any = {};
    if (intent) filter.intent = intent;
    if (status) filter.status = status;

    const total = await ContactRequest.countDocuments(filter);
    const contacts = await ContactRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Contacts GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts.' }, { status: 500 });
  }
}

// PATCH: Update contact request status
export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { id, status, starred } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required.' }, { status: 400 });
    }

    const update: any = {};
    if (status !== undefined) update.status = status;
    if (starred !== undefined) update.starred = starred;

    const contact = await ContactRequest.findByIdAndUpdate(id, update, { new: true });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error('Contacts PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update contact.' }, { status: 500 });
  }
}

// DELETE: Remove a contact request
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required.' }, { status: 400 });
    }

    const contact = await ContactRequest.findByIdAndDelete(id);

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contacts DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete contact.' }, { status: 500 });
  }
}
