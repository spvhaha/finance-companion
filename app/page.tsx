'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import TipCard from '@/components/TipCard';
import ChallengeCard from '@/components/ChallengeCard';
import StatBar from '@/components/StatBar';
import { tips, challenges } from '@/lib/content';
import { seededRandom, getDailySeed, getWeeklySeed, getGreeting, formatCurrency } from '@/lib/utils';

interface Profile { type: 'young' | 'senior'; name: string | null }
interface Goal { id: number; name: string; target: number; current: number }

export default function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [streak, setStreak] = useState(0);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const profileRes = await fetch('/api/profile');
      const profileData = await profileRes.json();
      if (!profileData.profile) {
        router.push('/onboarding');
        return;
      }
      setProfile(profileData.profile);

      const [streakRes, challengeRes, goalsRes] = await Promise.all([
        fetch('/api/streaks', { method: 'POST' }),
        fetch('/api/challenges'),
        fetch('/api/goals'),
      ]);
      const streakData = await streakRes.json();
      const challengeData = await challengeRes.json();
      const goalsData = await goalsRes.json();

      setStreak(streakData.streak.current_streak);
      setChallengesCompleted(challengeData.challenges.length);
      setGoals(goalsData.goals);

      const weekStr = getWeekString();
      setChallengeCompleted(challengeData.challenges.some((c: { challenge_date: string }) => c.challenge_date === weekStr));
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading || !profile) return <div className="min-h-screen bg-[#F9F8F5]" />;

  const accentColor = profile.type === 'young' ? '#7F77DD' : '#1D9E75';
  const profileTips = tips[profile.type];
  const profileChallenges = challenges[profile.type];

  const dailySeed = getDailySeed();
  const weeklySeed = getWeeklySeed();
  const tipIndex = Math.floor(seededRandom(dailySeed) * profileTips.length);
  const challengeIndex = Math.floor(seededRandom(weeklySeed) * profileChallenges.length);

  const todayTip = profileTips[tipIndex];
  const weekChallenge = profileChallenges[challengeIndex];
  const activeGoals = goals.filter(g => g.current < g.target);

  const handleCompleteChallenge = async () => {
    const weekStr = getWeekString();
    await fetch('/api/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: weekStr }),
    });
    setChallengeCompleted(true);
    setChallengesCompleted(prev => prev + 1);
  };

  return (
    <div className="max-w-[540px] mx-auto px-5 pb-24 pt-8">
      <h1 className="font-heading text-2xl font-bold text-[#444441] mb-1">
        {getGreeting(profile.name)}
      </h1>
      <p className="text-sm text-[#888780] mb-6">
        {profile.type === 'young' ? 'Growth Explorer' : 'Steady Protector'}
      </p>

      <div className="space-y-4">
        <StatBar
          streak={streak}
          challengesCompleted={challengesCompleted}
          activeGoals={activeGoals.length}
          accentColor={accentColor}
        />

        <TipCard title={todayTip.title} body={todayTip.body} accentColor={accentColor} />

        <ChallengeCard
          text={weekChallenge.text}
          difficulty={weekChallenge.difficulty}
          reward={weekChallenge.reward}
          completed={challengeCompleted}
          accentColor={accentColor}
          onComplete={handleCompleteChallenge}
        />

        {activeGoals.length > 0 && (
          <div className="bg-white rounded-xl border border-[#D3D1C7] p-5 animate-fadeIn">
            <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: accentColor }}>
              Goal Progress
            </p>
            <div className="space-y-3">
              {activeGoals.slice(0, 3).map((goal) => {
                const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100);
                return (
                  <div key={goal.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#444441] font-medium">{goal.name}</span>
                      <span className="text-[#888780]">{formatCurrency(goal.current)} / {formatCurrency(goal.target)}</span>
                    </div>
                    <div className="w-full h-2 bg-[#F1EFE8] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: accentColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Nav profileType={profile.type} />
    </div>
  );
}

function getWeekString(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.getFullYear(), today.getMonth(), diff);
  return monday.toISOString().split('T')[0];
}
