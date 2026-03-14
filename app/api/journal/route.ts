import { NextRequest, NextResponse } from 'next/server';
import { getJournalEntries, createJournalEntry, updateJournalEntry, deleteJournalEntry } from '@/lib/db';

export async function GET() {
  const entries = await getJournalEntries();
  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  await createJournalEntry(text);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const { id, text } = await req.json();
  await updateJournalEntry(id, text);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await deleteJournalEntry(id);
  return NextResponse.json({ success: true });
}
