'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: '⌂' },
  { href: '/goals', label: 'Goals', icon: '◎' },
  { href: '/journal', label: 'Journal', icon: '✎' },
  { href: '/ask', label: 'Ask', icon: '?' },
  { href: '/settings', label: 'Settings', icon: '⚙' },
];

export default function Nav({ profileType }: { profileType: string }) {
  const pathname = usePathname();
  const accentColor = profileType === 'young' ? '#7F77DD' : '#1D9E75';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D3D1C7] z-50">
      <div className="max-w-[540px] mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const hideOnMobile = 'flex';
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${hideOnMobile} flex-col items-center gap-0.5 text-xs transition-colors`}
              style={{ color: isActive ? accentColor : '#888780' }}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
