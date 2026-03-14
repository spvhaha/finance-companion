'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import GoalCard from '@/components/GoalCard';
import { goalTemplates } from '@/lib/content';

interface Profile { type: 'young' | 'senior'; name: string | null }
interface Goal { id: number; name: string; target: number; current: number; created_at: string }

export default function GoalsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const profileRes = await fetch('/api/profile');
    const profileData = await profileRes.json();
    if (!profileData.profile) { router.push('/onboarding'); return; }
    setProfile(profileData.profile);

    const goalsRes = await fetch('/api/goals');
    const goalsData = await goalsRes.json();
    setGoals(goalsData.goals);
    setLoading(false);
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreate = async (name: string, target: number) => {
    await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, target }),
    });
    setShowForm(false);
    setNewName('');
    setNewTarget('');
    loadData();
  };

  const handleUpdate = async (id: number, current: number) => {
    await fetch('/api/goals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, current }),
    });
    loadData();
  };

  const handleDelete = async (id: number) => {
    await fetch('/api/goals', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    loadData();
  };

  if (loading || !profile) return <div className="min-h-screen bg-[#F9F8F5]" />;

  const accentColor = profile.type === 'young' ? '#7F77DD' : '#1D9E75';
  const templates = goalTemplates[profile.type];

  return (
    <div className="max-w-[540px] mx-auto px-5 pb-24 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-[#444441]">Goals</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: accentColor }}
        >
          + New Goal
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-[#D3D1C7] p-5 mb-4 animate-fadeIn">
          <div className="space-y-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Goal name"
              className="w-full px-4 py-2.5 rounded-lg border border-[#D3D1C7] text-sm text-[#444441] placeholder-[#888780] focus:outline-none focus:border-[#888780] bg-white"
            />
            <input
              type="number"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              placeholder="Target amount ($)"
              className="w-full px-4 py-2.5 rounded-lg border border-[#D3D1C7] text-sm text-[#444441] placeholder-[#888780] focus:outline-none focus:border-[#888780] bg-white"
            />
            <button
              onClick={() => newName && newTarget && handleCreate(newName, parseFloat(newTarget))}
              disabled={!newName || !newTarget}
              className="w-full py-2.5 rounded-lg text-white text-sm font-medium disabled:opacity-40 transition-opacity"
              style={{ backgroundColor: accentColor }}
            >
              Create Goal
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-[#F1EFE8]">
            <p className="text-xs text-[#888780] mb-2">Quick templates:</p>
            <div className="flex flex-wrap gap-2">
              {templates.map((t) => (
                <button
                  key={t.name}
                  onClick={() => handleCreate(t.name, t.target)}
                  className="text-xs px-3 py-1.5 rounded-full border border-[#D3D1C7] text-[#444441] hover:border-[#888780] transition-colors"
                >
                  {t.name} (${t.target.toLocaleString()})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-[#888780]">No goals yet. Create your first savings goal!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              id={goal.id}
              name={goal.name}
              target={goal.target}
              current={goal.current}
              accentColor={accentColor}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Nav profileType={profile.type} />
    </div>
  );
}
