import { NextRequest, NextResponse } from 'next/server';
import { getProfile, createProfile, updateProfile } from '@/lib/db';

export async function GET() {
  const profile = await getProfile();
  return NextResponse.json({ profile: profile || null });
}

export async function POST(req: NextRequest) {
  const { type, name } = await req.json();
  await createProfile(type, name);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const { type, name } = await req.json();
  await updateProfile(type, name);
  return NextResponse.json({ success: true });
}
