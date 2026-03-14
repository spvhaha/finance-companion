'use client';

import { useState } from 'react';

interface ChallengeCardProps {
  text: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  reward: string;
  completed: boolean;
  accentColor: string;
  onComplete: () => void;
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard: 'bg-red-100 text-red-700',
};

export default function ChallengeCard({ text, difficulty, reward, completed, accentColor, onComplete }: ChallengeCardProps) {
  const [justCompleted, setJustCompleted] = useState(false);

  const handleComplete = () => {
    setJustCompleted(true);
    onComplete();
  };

  return (
    <div className="bg-white rounded-xl border border-[#D3D1C7] p-5 animate-fadeIn">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: accentColor }}>
          Weekly Challenge
        </p>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
      </div>
      <p className="text-sm text-[#444441] font-medium mb-2">{text}</p>
      <p className="text-xs text-[#888780] mb-4">Reward: {reward}</p>
      {completed || justCompleted ? (
        <div className="flex items-center gap-2 text-sm font-medium" style={{ color: accentColor }}>
          <span className="text-lg">✓</span> Completed!
        </div>
      ) : (
        <button
          onClick={handleComplete}
          className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: accentColor }}
        >
          Mark Complete
        </button>
      )}
    </div>
  );
}
