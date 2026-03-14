'use client';

import { useState } from 'react';

interface AiChatProps {
  accentColor: string;
  suggestions: string[];
}

interface QA {
  question: string;
  answer: string;
}

export default function AiChat({ accentColor, suggestions }: AiChatProps) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<QA[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const loadHistory = async () => {
    if (historyLoaded) return;
    const res = await fetch('/api/ask');
    const data = await res.json();
    if (data.history) {
      setHistory(data.history.map((h: { question: string; answer: string }) => ({ question: h.question, answer: h.answer })));
    }
    setHistoryLoaded(true);
  };

  useState(() => { loadHistory(); });

  const handleAsk = async (q: string) => {
    if (!q.trim() || loading) return;
    setLoading(true);
    setQuestion('');
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (data.error) {
        setHistory((prev) => [{ question: q, answer: `Error: ${data.error}` }, ...prev]);
      } else {
        setHistory((prev) => [{ question: q, answer: data.answer }, ...prev]);
      }
    } catch {
      setHistory((prev) => [{ question: q, answer: 'Something went wrong. Please try again.' }, ...prev]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => handleAsk(s)}
            className="text-xs px-3 py-1.5 rounded-full border border-[#D3D1C7] text-[#444441] hover:border-[#888780] transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk(question)}
          placeholder="Ask any financial question..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-[#D3D1C7] text-sm text-[#444441] placeholder-[#888780] focus:outline-none focus:border-[#888780] bg-white"
        />
        <button
          onClick={() => handleAsk(question)}
          disabled={loading || !question.trim()}
          className="px-4 py-2.5 rounded-lg text-white text-sm font-medium disabled:opacity-50 transition-opacity"
          style={{ backgroundColor: accentColor }}
        >
          Ask
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-[#D3D1C7] p-5 animate-pulse">
          <div className="flex items-center gap-2 text-sm text-[#888780]">
            <span className="inline-block w-4 h-4 border-2 border-[#D3D1C7] border-t-transparent rounded-full animate-spin" />
            Thinking...
          </div>
        </div>
      )}

      {history.map((qa, i) => (
        <div key={i} className="bg-white rounded-xl border border-[#D3D1C7] p-5 animate-fadeIn">
          <p className="text-sm font-medium text-[#444441] mb-3">{qa.question}</p>
          <div className="text-sm text-[#888780] leading-relaxed whitespace-pre-wrap">{qa.answer}</div>
        </div>
      ))}
    </div>
  );
}
