import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getProfile, saveAskHistory, getAskHistory } from '@/lib/db';

export async function GET() {
  const history = await getAskHistory();
  return NextResponse.json({ history });
}

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  const profile = await getProfile();

  if (!profile) {
    return NextResponse.json({ error: 'No profile found' }, { status: 400 });
  }

  const profileContext = profile.type === 'young'
    ? 'Growth Explorer — a beginner investor in their 20s-30s with a 30-40 year horizon, high risk tolerance, focused on learning and growing wealth'
    : 'Steady Protector — a pre-retirement investor in their 50s-60s with a 5-15 year horizon, low-moderate risk tolerance, focused on capital preservation and income';

  try {
    const client = new Anthropic();

    const recentHistory = (await getAskHistory()).slice(0, 5).reverse();
    const conversationMessages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    for (const entry of recentHistory) {
      conversationMessages.push({ role: 'user', content: entry.question });
      conversationMessages.push({ role: 'assistant', content: entry.answer });
    }
    conversationMessages.push({ role: 'user', content: question });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are a warm, friendly financial well-wisher — like a wise older sibling who knows a lot about money. The user is a ${profileContext}. Keep answers simple, practical, under 200 words. Use everyday language, not jargon. Canadian financial context (TFSA, RRSP, CPP). Always note you're not a licensed financial advisor.`,
      messages: conversationMessages,
    });

    const answer = message.content[0].type === 'text' ? message.content[0].text : '';
    await saveAskHistory(question, answer);

    return NextResponse.json({ answer });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
