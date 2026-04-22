'use client';

import { usePathname } from 'next/navigation';
import AmbientBackground from '@/components/AmbientBackground';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <>
      {!isDashboard && <CustomCursor />}
      {!isDashboard && <AmbientBackground />}
      {children}
      {!isDashboard && <Navbar />}
    </>
  );
}
