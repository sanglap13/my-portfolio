'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const sections = [
  { key: 'global', label: 'Global Settings', icon: '⚙️', description: 'Under construction placard & site-wide settings' },
  { key: 'overlay', label: 'Overlay', icon: '◐', description: 'Hero section text & animations' },
  { key: 'about', label: 'About', icon: '◉', description: 'Bio, skills, qualifications, socials' },
  { key: 'experience', label: 'Experience', icon: '◆', description: 'Timeline & work history' },
  { key: 'projects', label: 'Projects', icon: '◇', description: 'Portfolio projects showcase' },
  { key: 'community', label: 'Community', icon: '◎', description: 'Events, hackathons, talks' },
  { key: 'informal', label: 'Beyond the Code', icon: '◌', description: 'Reels, gallery, creator identity' },
  { key: 'footer', label: 'Footer', icon: '◁', description: 'Footer text & credits' },
];

export default function DashboardOverview() {
  const [contactCount, setContactCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch('/api/contacts?limit=1')
      .then((r) => r.json())
      .then((data) => {
        setContactCount(data.pagination?.total || 0);
      })
      .catch(() => {});

    fetch('/api/contacts?status=unread&limit=1')
      .then((r) => r.json())
      .then((data) => {
        setUnreadCount(data.pagination?.total || 0);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm font-mono text-gray-500 mt-1">Manage your portfolio content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Sections</p>
          <p className="text-2xl font-bold text-white">{sections.length}</p>
        </div>
        <Link href="/dashboard/contacts" className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-amber-500/20 transition-colors">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Total Contacts</p>
          <p className="text-2xl font-bold text-white">{contactCount}</p>
        </Link>
        <Link href="/dashboard/contacts?status=unread" className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-amber-500/20 transition-colors">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Unread Messages</p>
          <p className="text-2xl font-bold text-amber-400">{unreadCount}</p>
        </Link>
      </div>

      {/* Section Cards */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Content Sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section) => (
            <Link
              key={section.key}
              href={`/dashboard/${section.key}`}
              className="group bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-amber-500/30 hover:bg-amber-500/[0.02] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl opacity-40 group-hover:opacity-80 transition-opacity">
                  {section.icon}
                </span>
                <span className="text-xs font-mono text-gray-600 group-hover:text-amber-500/70 transition-colors">
                  Edit →
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                {section.label}
              </h3>
              <p className="text-xs font-mono text-gray-500">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
