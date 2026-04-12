'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import AmbientBackground from '@/components/AmbientBackground';
import Footer from '@/components/Footer';
import config from '@/data/config.json';

export default function ProjectsPage() {
  const pc = config.projects.pageConfig;
  return (
    <main className="min-h-screen bg-theme-bg flex flex-col">
      {/* Construction content — grows to fill available height */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <AmbientBackground />

        {/* Fullscreen diagonal stripes */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #facc15 0px, #facc15 30px, transparent 30px, transparent 60px)',
          }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff07_1px,transparent_1px),linear-gradient(to_bottom,#ffffff07_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-2xl mx-auto py-20">

          {/* Animated crane icon */}
          <motion.div
            animate={{ rotate: [-5, 5, -5], y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-7xl md:text-9xl mb-10 select-none"
          >
            🚧
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="geist-sans text-4xl md:text-6xl font-bold text-yellow-300 mb-4 drop-shadow-[0_0_30px_rgba(253,224,71,0.5)]">
              {pc.heading}
            </h1>

            <p className="geist-mono text-gray-400 text-base md:text-lg leading-relaxed mb-3">
              {pc.subtext}
            </p>

            <p className="geist-mono text-gray-600 text-xs tracking-widest uppercase mb-10">
              {pc.eta}
            </p>

            {/* Progress bar — forever loading */}
            <div className="w-full max-w-sm mx-auto h-1.5 bg-white/5 rounded-full overflow-hidden mb-12 border border-white/10">
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full"
              />
            </div>

            {/* Blinking status */}
            <div className="flex items-center justify-center gap-2 mb-10">
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-yellow-400"
              />
              <span className="geist-mono text-xs text-yellow-400/70 tracking-widest uppercase">
                {pc.statusLabel}
              </span>
            </div>

            <Link
              href="/"
              className="geist-mono px-8 py-3 bg-white/5 border border-white/10 rounded-full font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/30 text-sm inline-flex items-center gap-2"
            >
              {pc.ctaLabel}
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
