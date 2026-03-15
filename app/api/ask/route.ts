import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
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
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    });

    const recentHistory = (await getAskHistory()).slice(0, 5).reverse();
    const historyMessages = recentHistory.flatMap((entry) => [
      { role: 'user' as const, parts: [{ text: entry.question }] },
      { role: 'model' as const, parts: [{ text: entry.answer }] },
    ]);

    const chat = model.startChat({ history: historyMessages });
    const result = await chat.sendMessage(question);
    const answer = result.response.text();

    await saveAskHistory(question, answer);

    return NextResponse.json({ answer });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
