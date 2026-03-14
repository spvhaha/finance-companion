import { NextResponse } from 'next/server';
import { getStreak, updateStreak } from '@/lib/db';

export async function GET() {
  const streak = await getStreak();
  return NextResponse.json({ streak });
}

export async function POST() {
  const streak = await updateStreak();
  return NextResponse.json({ streak });
}
