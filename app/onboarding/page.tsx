'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState<'welcome' | 'profile'>('welcome');
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleStart = async () => {
    if (!selectedType) return;
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: selectedType, name: name.trim() || undefined }),
    });
    router.push('/');
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="max-w-[540px] w-full text-center animate-fadeIn">
          <p className="text-4xl mb-4">💰</p>
          <h1 className="font-heading text-3xl font-bold text-[#444441] mb-3">Financial Companion</h1>
          <p className="text-[#888780] mb-8 leading-relaxed">
            Your personal guide to building better money habits. Get daily tips, track goals,
            journal your journey, and ask questions — all tailored to where you are in life.
          </p>
          <button
            onClick={() => setStep('profile')}
            className="px-8 py-3 bg-[#444441] text-white rounded-lg font-medium hover:bg-[#333330] transition-colors"
          >
            Get Started
          </button>
          <p className="text-xs text-[#D3D1C7] mt-6">General financial education only. Not professional advice.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="max-w-[540px] w-full animate-fadeIn">
        <h2 className="font-heading text-2xl font-bold text-[#444441] text-center mb-2">Which describes you best?</h2>
        <p className="text-[#888780] text-center mb-6 text-sm">This helps us personalize your experience.</p>

        <div className="space-y-4 mb-6">
          <button
            onClick={() => setSelectedType('young')}
            className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
              selectedType === 'young' ? 'border-[#7F77DD] bg-[#7F77DD]/5' : 'border-[#D3D1C7] bg-white hover:border-[#888780]'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🌱</span>
              <h3 className="font-heading text-lg font-semibold text-[#444441]">Growth Explorer</h3>
            </div>
            <p className="text-sm text-[#888780]">
              In my 20s-30s, starting my investment journey. Long time horizon, eager to learn and grow wealth.
            </p>
          </button>

          <button
            onClick={() => setSelectedType('senior')}
            className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
              selectedType === 'senior' ? 'border-[#1D9E75] bg-[#1D9E75]/5' : 'border-[#D3D1C7] bg-white hover:border-[#888780]'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🛡️</span>
              <h3 className="font-heading text-lg font-semibold text-[#444441]">Steady Protector</h3>
            </div>
            <p className="text-sm text-[#888780]">
              In my 50s-60s, approaching or in retirement. Focused on protecting what I&apos;ve built and generating income.
            </p>
          </button>
        </div>

        <div className="mb-6">
          <label className="text-sm text-[#888780] mb-1 block">What should we call you? (optional)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2.5 rounded-lg border border-[#D3D1C7] text-sm text-[#444441] placeholder-[#D3D1C7] focus:outline-none focus:border-[#888780] bg-white"
          />
        </div>

        <button
          onClick={handleStart}
          disabled={!selectedType}
          className="w-full py-3 rounded-lg text-white font-medium disabled:opacity-40 transition-all"
          style={{ backgroundColor: selectedType === 'young' ? '#7F77DD' : selectedType === 'senior' ? '#1D9E75' : '#888780' }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
