'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUpVariant } from '@/utils/animations';
import { Config } from '@/utils/config';
import AmbientBackground from './AmbientBackground';

interface UnderConstructionProps {
  title: string;
  config: Config['global']['underConstructionConfig'];
  variant?: 'section' | 'page';
}

export default function UnderConstruction({ title, config, variant = 'section' }: UnderConstructionProps) {
  if (!config) return null;

  const isPage = variant === 'page';

  return (
    <div className={isPage ? "relative w-full h-full flex flex-col items-center justify-center min-h-[60vh]" : "max-w-7xl mx-auto w-full"}>
      {isPage && <AmbientBackground />}
      
      {!isPage && (
        <motion.div variants={fadeUpVariant} className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16">
          <h2 className="geist-sans text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 md:mb-0">
            {title}
          </h2>
          <Link
            href="/"
            className="geist-mono px-6 py-3 bg-white/5 border border-white/10 rounded-full font-semibold text-white transition-all duration-300 hover:bg-theme-indigo/10 hover:border-theme-indigo/50 hover:text-theme-indigo hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] w-fit flex items-center gap-2"
          >
            Return Home <span>&rarr;</span>
          </Link>
        </motion.div>
      )}

      <motion.div
        variants={fadeUpVariant}
        className={`relative w-full rounded-[2rem] border border-dashed border-yellow-400/40 bg-yellow-400/[0.03] flex flex-col items-center justify-center text-center overflow-hidden ${
          isPage ? 'p-12 md:p-24 border-none bg-transparent' : 'p-12 md:p-20'
        }`}
      >
        {/* Fullscreen diagonal stripes */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #facc15 0px, #facc15 30px, transparent 30px, transparent 60px)',
          }}
        />

        {/* Animated crane/construction icon */}
        <motion.div
          animate={{ rotate: [-5, 5, -5], y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className={`${isPage ? 'text-7xl md:text-9xl' : 'text-6xl md:text-8xl'} mb-8 md:mb-10 select-none relative z-10`}
        >
          🚧
        </motion.div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <h3 className={`geist-sans font-bold text-yellow-300 mb-4 drop-shadow-[0_0_30px_rgba(253,224,71,0.5)] ${
            isPage ? 'text-4xl md:text-6xl' : 'text-2xl md:text-4xl'
          }`}>
            {config.heading}
          </h3>
          
          <p className={`geist-mono text-gray-400 leading-relaxed mb-3 ${
            isPage ? 'text-base md:text-lg' : 'text-sm md:text-base'
          }`}>
            {config.subtext}
          </p>
          
          <p className="geist-mono text-gray-600 text-xs tracking-widest uppercase mb-10">
            {config.eta}
          </p>

          {/* Progress bar — forever loading */}
          <div className="w-full max-w-sm mx-auto h-1.5 bg-white/5 rounded-full overflow-hidden mb-12 border border-white/10">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full"
            />
          </div>

          <div className="flex items-center justify-center gap-2 mb-10">
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-yellow-400"
            />
            <span className="geist-mono text-xs text-yellow-400/70 tracking-widest uppercase">
              {config.statusLabel}
            </span>
          </div>

          <Link
            href="/"
            className="geist-mono px-8 py-3 bg-white/5 border border-white/10 rounded-full font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/30 text-sm inline-flex items-center gap-2"
          >
            {config.ctaLabel}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
