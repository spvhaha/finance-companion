'use client';

interface TipCardProps {
  title: string;
  body: string;
  accentColor: string;
}

export default function TipCard({ title, body, accentColor }: TipCardProps) {
  return (
    <div
      className="bg-white rounded-xl border border-[#D3D1C7] p-5 animate-fadeIn"
      style={{ borderLeftWidth: '4px', borderLeftColor: accentColor }}
    >
      <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: accentColor }}>
        Daily Tip
      </p>
      <h3 className="font-heading text-lg font-semibold text-[#444441] mb-2">{title}</h3>
      <p className="text-sm text-[#888780] leading-relaxed">{body}</p>
    </div>
  );
}
