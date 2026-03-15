import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
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

  const systemPrompt = `You are a warm, friendly financial well-wisher — like a wise older sibling who knows a lot about money. The user is a ${profileContext}. Keep answers simple, practical, under 200 words. Use everyday language, not jargon. Canadian financial context (TFSA, RRSP, CPP). Always note you're not a licensed financial advisor.`;

  try {
    const client = new OpenAI({
      baseURL: process.env.AI_BASE_URL,
      apiKey: process.env.AI_API_KEY,
    });

    const recentHistory = (await getAskHistory()).slice(0, 5).reverse();
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];
    for (const entry of recentHistory) {
      messages.push({ role: 'user', content: entry.question });
      messages.push({ role: 'assistant', content: entry.answer });
    }
    messages.push({ role: 'user', content: question });

    const response = await client.chat.completions.create({
      model: process.env.AI_MODEL || 'claude-4-sonnet',
      max_tokens: 1024,
      messages,
    });

    const answer = response.choices[0]?.message?.content || '';
    await saveAskHistory(question, answer);

    return NextResponse.json({ answer });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
