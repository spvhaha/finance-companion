'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';

interface Profile { type: 'young' | 'senior'; name: string | null }

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [streak, setStreak] = useState(0);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [goalsCount, setGoalsCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const profileRes = await fetch('/api/profile');
      const profileData = await profileRes.json();
      if (!profileData.profile) { router.push('/onboarding'); return; }
      setProfile(profileData.profile);
      setName(profileData.profile.name || '');

      const [streakRes, challengeRes, goalsRes, journalRes] = await Promise.all([
        fetch('/api/streaks'),
        fetch('/api/challenges'),
        fetch('/api/goals'),
        fetch('/api/journal'),
      ]);
      const streakData = await streakRes.json();
      const challengeData = await challengeRes.json();
      const goalsData = await goalsRes.json();
      const journalData = await journalRes.json();

      setStreak(streakData.streak.current_streak);
      setChallengesCompleted(challengeData.challenges.length);
      setGoalsCount(goalsData.goals.length);
      setJournalCount(journalData.entries.length);
      setLoading(false);
    }
    load();
  }, [router]);

  const handleUpdateName = async () => {
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() || null }),
    });
  };

  const handleSwitchProfile = async () => {
    if (!profile) return;
    const newType = profile.type === 'young' ? 'senior' : 'young';
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: newType }),
    });
    setProfile({ ...profile, type: newType });
  };

  const handleExport = async () => {
    const res = await fetch('/api/export');
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial-companion-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = async () => {
    await fetch('/api/reset', { method: 'POST' });
    router.push('/onboarding');
  };

  if (loading || !profile) return <div className="min-h-screen bg-[#F9F8F5]" />;

  const accentColor = profile.type === 'young' ? '#7F77DD' : '#1D9E75';

  return (
    <div className="max-w-[540px] mx-auto px-5 pb-24 pt-8">
      <h1 className="font-heading text-2xl font-bold text-[#444441] mb-6">Settings</h1>

      <div className="space-y-4">
        {/* Profile */}
        <div className="bg-white rounded-xl border border-[#D3D1C7] p-5 animate-fadeIn">
          <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: accentColor }}>
            Profile
          </p>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-[#444441]">
                {profile.type === 'young' ? 'Growth Explorer' : 'Steady Protector'}
              </p>
              <p className="text-xs text-[#888780]">
                {profile.type === 'young' ? 'Beginner investor, long horizon' : 'Pre-retirement, capital preservation'}
              </p>
            </div>
            <button
              onClick={handleSwitchProfile}
              className="text-xs px-3 py-1.5 rounded-md border border-[#D3D1C7] text-[#444441] hover:border-[#888780] transition-colors"
            >
              Switch
            </button>
          </div>
          <div>
            <label className="text-xs text-[#888780] mb-1 block">Display name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="flex-1 px-4 py-2 rounded-lg border border-[#D3D1C7] text-sm text-[#444441] placeholder-[#888780] focus:outline-none focus:border-[#888780] bg-white"
              />
              <button
                onClick={handleUpdateName}
                className="text-xs px-3 py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: accentColor }}
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl border border-[#D3D1C7] p-5 animate-fadeIn">
          <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: accentColor }}>
            Statistics
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Day Streak', value: streak },
              { label: 'Challenges Done', value: challengesCompleted },
              { label: 'Goals Created', value: goalsCount },
              { label: 'Journal Entries', value: journalCount },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 bg-[#F9F8F5] rounded-lg">
                <p className="text-xl font-semibold" style={{ color: accentColor }}>{stat.value}</p>
                <p className="text-xs text-[#888780]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Data */}
        <div className="bg-white rounded-xl border border-[#D3D1C7] p-5 animate-fadeIn">
          <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: accentColor }}>
            Data
          </p>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full text-left text-sm text-[#444441] px-4 py-3 rounded-lg border border-[#D3D1C7] hover:border-[#888780] transition-colors"
            >
              Export all data (JSON)
            </button>
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full text-left text-sm text-red-400 px-4 py-3 rounded-lg border border-[#D3D1C7] hover:border-red-300 transition-colors"
              >
                Reset all data
              </button>
            ) : (
              <div className="p-4 rounded-lg border-2 border-red-300 bg-red-50">
                <p className="text-sm text-red-600 mb-3">Are you sure? This cannot be undone.</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="text-xs px-4 py-2 rounded-md bg-red-500 text-white font-medium"
                  >
                    Yes, reset everything
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="text-xs px-4 py-2 rounded-md border border-[#D3D1C7] text-[#444441]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center py-4">
          <p className="text-xs text-[#D3D1C7] leading-relaxed">
            General financial education only. Not professional advice.<br />
            Always consult a licensed financial advisor for your specific situation.
          </p>
        </div>
      </div>

      <Nav profileType={profile.type} />
    </div>
  );
}
