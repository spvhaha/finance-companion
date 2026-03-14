import { NextResponse } from 'next/server';
import { exportAllData } from '@/lib/db';

export async function GET() {
  const data = await exportAllData();
  return NextResponse.json(data);
}
