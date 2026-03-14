'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface GoalCardProps {
  id: number;
  name: string;
  target: number;
  current: number;
  accentColor: string;
  onUpdate: (id: number, newCurrent: number) => void;
  onDelete: (id: number) => void;
}

export default function GoalCard({ id, name, target, current, accentColor, onUpdate, onDelete }: GoalCardProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const isComplete = percentage >= 100;

  const handleAdd = (amount: number) => {
    const newCurrent = Math.min(current + amount, target);
    onUpdate(id, newCurrent);
    if (newCurrent >= target && current < target) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#D3D1C7] p-5 animate-fadeIn relative overflow-hidden">
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10 animate-fadeIn">
          <div className="text-center">
            <p className="text-4xl mb-2">🎉</p>
            <p className="font-heading text-lg font-semibold" style={{ color: accentColor }}>Goal Reached!</p>
            <p className="text-sm text-[#888780]">Amazing work!</p>
          </div>
        </div>
      )}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-heading text-base font-semibold text-[#444441]">{name}</h3>
        <button onClick={() => onDelete(id)} className="text-[#D3D1C7] hover:text-red-400 text-sm transition-colors">✕</button>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-lg font-semibold" style={{ color: accentColor }}>{formatCurrency(current)}</span>
        <span className="text-sm text-[#888780]">/ {formatCurrency(target)}</span>
      </div>
      <div className="w-full h-2.5 bg-[#F1EFE8] rounded-full mb-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%`, backgroundColor: accentColor }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#888780]">{percentage}%</span>
        {!isComplete && (
          <div className="flex gap-2">
            {[50, 100, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => handleAdd(amount)}
                className="text-xs px-2.5 py-1 rounded-md border border-[#D3D1C7] text-[#444441] hover:border-[#888780] transition-colors"
              >
                +${amount}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
