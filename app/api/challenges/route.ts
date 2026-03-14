import { NextRequest, NextResponse } from 'next/server';
import { getCompletedChallenges, completeChallenge } from '@/lib/db';

export async function GET() {
  const challenges = await getCompletedChallenges();
  return NextResponse.json({ challenges });
}

export async function POST(req: NextRequest) {
  const { date } = await req.json();
  await completeChallenge(date);
  return NextResponse.json({ success: true });
}
