'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import AiChat from '@/components/AiChat';
import { suggestionChips } from '@/lib/content';

interface Profile { type: 'young' | 'senior'; name: string | null }

export default function AskPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (!data.profile) { router.push('/onboarding'); return; }
      setProfile(data.profile);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading || !profile) return <div className="min-h-screen bg-[#F9F8F5]" />;

  const accentColor = profile.type === 'young' ? '#7F77DD' : '#1D9E75';

  return (
    <div className="max-w-[540px] mx-auto px-5 pb-24 pt-8">
      <h1 className="font-heading text-2xl font-bold text-[#444441] mb-1">Ask Me</h1>
      <p className="text-sm text-[#888780] mb-6">Ask any financial question and get personalized guidance.</p>

      <AiChat accentColor={accentColor} suggestions={suggestionChips[profile.type]} />

      <p className="text-xs text-[#D3D1C7] text-center mt-6">
        General financial education only. Not professional advice.
      </p>

      <Nav profileType={profile.type} />
    </div>
  );
}
