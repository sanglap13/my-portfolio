'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/experience', label: 'Experience' },
  { path: '/projects', label: 'Projects' },
  { path: '/community', label: 'Community' },
  { path: '/informal', label: 'Beyond Code' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // If we're not on the home page, it is always visible
    if (pathname !== '/') {
      setIsVisible(true);
      return;
    }

    // Initial check (in case user refreshes further down the page)
    if (typeof window !== 'undefined') {
      setIsVisible(window.scrollY > window.innerHeight * 3.8);
    }

    // Hide on home page until scrolled past the sticky container (~400vh)
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsVisible(latest > window.innerHeight * 3.8);
    });

    return () => unsubscribe();
  }, [pathname, scrollY]);

  return (
    <div className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50">
      <AnimatePresence>
        {isVisible && (
          <motion.nav 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="flex items-center gap-1 px-2 py-2 bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "relative px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-colors duration-300",
                    isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 border border-white/20 rounded-full z-[-1]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
