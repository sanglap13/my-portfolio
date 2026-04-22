'use client';

import { usePathname } from 'next/navigation';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/dashboard/login';

  if (isLoginPage) {
    return (
      <html lang="en">
        <body className="bg-[#0a0a0f] text-white antialiased min-h-screen">
          {children}
        </body>
      </html>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <DashboardNavbar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
