'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import { writingPrompts } from '@/lib/content';
import { formatDate } from '@/lib/utils';

interface Profile { type: 'young' | 'senior'; name: string | null }
interface Entry { id: number; text: string; created_at: string }

export default function JournalPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const profileRes = await fetch('/api/profile');
    const profileData = await profileRes.json();
    if (!profileData.profile) { router.push('/onboarding'); return; }
    setProfile(profileData.profile);

    const res = await fetch('/api/journal');
    const data = await res.json();
    setEntries(data.entries);
    setLoading(false);
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim() }),
    });
    setText('');
    loadData();
  };

  const handleUpdate = async (id: number) => {
    if (!editText.trim()) return;
    await fetch('/api/journal', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, text: editText.trim() }),
    });
    setEditingId(null);
    loadData();
  };

  const handleDelete = async (id: number) => {
    await fetch('/api/journal', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    loadData();
  };

  if (loading || !profile) return <div className="min-h-screen bg-[#F9F8F5]" />;

  const accentColor = profile.type === 'young' ? '#7F77DD' : '#1D9E75';
  const promptIndex = new Date().getDate() % writingPrompts.length;

  return (
    <div className="max-w-[540px] mx-auto px-5 pb-24 pt-8">
      <h1 className="font-heading text-2xl font-bold text-[#444441] mb-6">Journal</h1>

      <div className="bg-white rounded-xl border border-[#D3D1C7] p-5 mb-4 animate-fadeIn">
        <p className="text-xs text-[#888780] mb-2 italic">{writingPrompts[promptIndex]}</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your thoughts..."
          rows={4}
          className="w-full px-4 py-2.5 rounded-lg border border-[#D3D1C7] text-sm text-[#444441] placeholder-[#888780] focus:outline-none focus:border-[#888780] bg-white resize-none"
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="mt-2 text-sm font-medium px-4 py-2 rounded-lg text-white disabled:opacity-40 transition-opacity"
          style={{ backgroundColor: accentColor }}
        >
          Save Entry
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-[#888780]">No journal entries yet. Start writing!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl border border-[#D3D1C7] p-5 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-[#888780]">{formatDate(entry.created_at)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingId(entry.id); setEditText(entry.text); }}
                    className="text-xs text-[#888780] hover:text-[#444441] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-xs text-[#888780] hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {editingId === entry.id ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D3D1C7] text-sm text-[#444441] focus:outline-none focus:border-[#888780] bg-white resize-none"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleUpdate(entry.id)}
                      className="text-xs font-medium px-3 py-1.5 rounded-md text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs font-medium px-3 py-1.5 rounded-md border border-[#D3D1C7] text-[#444441]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#444441] leading-relaxed whitespace-pre-wrap">{entry.text}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <Nav profileType={profile.type} />
    </div>
  );
}
