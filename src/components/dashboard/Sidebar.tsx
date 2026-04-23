'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: '◈' },
  { type: 'divider', label: 'Management' },
  { label: 'Global Settings', href: '/dashboard/global', icon: '⚙️' },
  { label: 'Contact Requests', href: '/dashboard/contacts', icon: '✉' },
  { type: 'divider', label: 'Content' },
  { label: 'Overlay', href: '/dashboard/overlay', icon: '◐' },
  { label: 'About', href: '/dashboard/about', icon: '◉' },
  { label: 'Experience', href: '/dashboard/experience', icon: '◆' },
  { label: 'Projects', href: '/dashboard/projects', icon: '◇' },
  { label: 'Community', href: '/dashboard/community', icon: '◎' },
  { label: 'Beyond the Code', href: '/dashboard/informal', icon: '◌' },
  { label: 'Footer', href: '/dashboard/footer', icon: '◁' },
  { label: 'Sequences', href: '/dashboard/sequences', icon: '▦' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-[#0c0c12] border-r border-white/[0.06] flex flex-col transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
            <span className="text-black font-black text-xs">P</span>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Portfolio CMS</p>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {navItems.map((item, i) => {
            if (item.type === 'divider') {
              return (
                <p key={i} className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.2em] px-3 pt-6 pb-2">
                  {item.label}
                </p>
              );
            }

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-0.5 ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <span className={`text-base ${isActive ? 'opacity-100' : 'opacity-40'}`}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.06]">
          <p className="text-[10px] font-mono text-gray-600 text-center uppercase tracking-wider">
            v1.0 · Sanglap Mridha
          </p>
        </div>
      </aside>
    </>
  );
}
