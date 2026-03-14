import { NextResponse } from 'next/server';
import { resetAllData } from '@/lib/db';

export async function POST() {
  await resetAllData();
  return NextResponse.json({ success: true });
}
