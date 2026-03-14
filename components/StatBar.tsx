'use client';

interface StatBarProps {
  streak: number;
  challengesCompleted: number;
  activeGoals: number;
  accentColor: string;
}

export default function StatBar({ streak, challengesCompleted, activeGoals, accentColor }: StatBarProps) {
  return (
    <div className="grid grid-cols-3 gap-3 animate-fadeIn">
      {[
        { label: 'Day Streak', value: streak, icon: '🔥' },
        { label: 'Challenges', value: challengesCompleted, icon: '✓' },
        { label: 'Active Goals', value: activeGoals, icon: '◎' },
      ].map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl border border-[#D3D1C7] p-3 text-center">
          <p className="text-lg mb-0.5">{stat.icon}</p>
          <p className="text-xl font-semibold" style={{ color: accentColor }}>{stat.value}</p>
          <p className="text-xs text-[#888780]">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
