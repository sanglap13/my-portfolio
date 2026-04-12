'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, LayoutGroup, useScroll } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/experience', label: 'Experience' },
  // { path: '/projects', label: 'Projects' },
  { path: '/community', label: 'Community' },
  { path: '/informal', label: 'Beyond Code' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(true);
  // Delay pill rendering until after navbar fade-in completes so layoutId
  // always captures stable, un-transformed coordinates.
  const [isPillReady, setIsPillReady] = useState(false);

  useEffect(() => {
    if (pathname !== '/') {
      setIsVisible(true);
      return;
    }

    if (typeof window !== 'undefined') {
      setIsVisible(window.scrollY > window.innerHeight * 3.8);
    }

    const unsubscribe = scrollY.on('change', (latest) => {
      setIsVisible(latest > window.innerHeight * 3.8);
    });

    return () => unsubscribe();
  }, [pathname, scrollY]);

  useEffect(() => {
    if (isVisible) {
      // Wait for navbar fade-in (~250ms) to finish before mounting the pill
      const t = setTimeout(() => setIsPillReady(true), 280);
      return () => clearTimeout(t);
    } else {
      setIsPillReady(false);
    }
  }, [isVisible]);

  return (
    <div className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
        className="flex items-center gap-1.5 px-3 py-2 bg-black/50 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_0_40px_rgba(99,102,241,0.15)]"
      >
        <LayoutGroup>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <motion.div
                key={item.path}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.path}
                  className={cn(
                    'relative flex px-4 md:px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-colors duration-300',
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                  )}
                >
                  {isActive && isPillReady && (
                    <motion.div
                      layoutId="nav-pill"
                      initial={false}
                      className="absolute inset-0 bg-gradient-to-r from-theme-indigo/20 to-theme-amber/20 border border-theme-indigo/30 rounded-full z-[-1] shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 25,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </LayoutGroup>
      </motion.nav>
    </div>
  );
}
