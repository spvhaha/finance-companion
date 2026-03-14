import { NextRequest, NextResponse } from 'next/server';
import { getGoals, createGoal, updateGoal, deleteGoal } from '@/lib/db';

export async function GET() {
  const goals = await getGoals();
  return NextResponse.json({ goals });
}

export async function POST(req: NextRequest) {
  const { name, target } = await req.json();
  await createGoal(name, target);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const { id, current } = await req.json();
  await updateGoal(id, current);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await deleteGoal(id);
  return NextResponse.json({ success: true });
}
