'use client';

import { usePathname, useRouter } from 'next/navigation';

const sectionTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/overlay': 'Overlay Editor',
  '/dashboard/about': 'About Editor',
  '/dashboard/experience': 'Experience Editor',
  '/dashboard/projects': 'Projects Editor',
  '/dashboard/community': 'Community Editor',
  '/dashboard/informal': 'Beyond the Code Editor',
  '/dashboard/footer': 'Footer Editor',
  '/dashboard/contacts': 'Contact Requests',
};

export default function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const currentTitle = sectionTitles[pathname] || 'Dashboard';

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/dashboard/login');
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-6 md:px-8">
      <div className="flex items-center gap-4">
        <div className="md:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <span className="text-black font-black text-xs">P</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">{currentTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-wider"
        >
          View Site →
        </a>
        <button
          onClick={handleLogout}
          className="text-xs font-mono text-red-400/70 hover:text-red-400 transition-colors uppercase tracking-wider"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
