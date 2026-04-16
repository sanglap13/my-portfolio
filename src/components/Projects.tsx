'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpVariant } from '@/utils/animations';
import { cn } from '@/utils/cn';
import { Config, getConfig } from '@/utils/config';

export default function Projects({ data, className }: { data?: Config['projects']; className?: string }) {
  const config = getConfig();
  const projects = data || config.projects;
  const uc = projects.underConstructionConfig;

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={cn('py-24 px-6 md:px-24 bg-transparent', className)}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeUpVariant} className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16">
          <h2 className="geist-sans text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 md:mb-0">
            {projects.title}
          </h2>
          <Link
            href="/projects"
            className="geist-mono px-6 py-3 bg-white/5 border border-white/10 rounded-full font-semibold text-white transition-all duration-300 hover:bg-theme-indigo/10 hover:border-theme-indigo/50 hover:text-theme-indigo hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] w-fit flex items-center gap-2"
          >
            View All <span>&rarr;</span>
          </Link>
        </motion.div>

        {projects.underConstruction ? (
          /* Under Construction Placard */
          <motion.div
            variants={fadeUpVariant}
            className="relative w-full rounded-[2rem] border border-dashed border-yellow-400/40 bg-yellow-400/[0.03] p-12 md:p-20 flex flex-col items-center justify-center text-center overflow-hidden"
          >
            {/* Diagonal stripes */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, #facc15 0px, #facc15 20px, transparent 20px, transparent 40px)',
              }}
            />

            <motion.div
              animate={{ rotate: [-3, 3, -3], y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-6xl md:text-8xl mb-8 select-none"
            >
              🚧
            </motion.div>

            <h3 className="geist-sans text-2xl md:text-4xl font-bold text-yellow-300 mb-4 drop-shadow-[0_0_20px_rgba(253,224,71,0.4)]">
              {uc.heading}
            </h3>
            <p className="geist-mono text-gray-400 text-sm md:text-base max-w-md leading-relaxed mb-2">
              {uc.subtext}
            </p>
            <p className="geist-mono text-gray-600 text-xs tracking-widest uppercase">{uc.eta}</p>

            <div className="flex items-center gap-2 mt-8">
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-yellow-400"
              />
              <span className="geist-mono text-xs text-yellow-400/70 tracking-widest uppercase">
                {uc.statusLabel}
              </span>
            </div>

            <Link
              href="/projects"
              className="mt-10 geist-mono px-8 py-3 bg-yellow-400/10 border border-yellow-400/30 rounded-full font-semibold text-yellow-300 transition-all duration-300 hover:bg-yellow-400/20 hover:border-yellow-400/60 hover:shadow-[0_0_20px_rgba(253,224,71,0.2)] text-sm"
            >
              {uc.ctaLabel} &rarr;
            </Link>
          </motion.div>
        ) : (
          /* Future: render project cards here from projects.items */
          <p className="geist-mono text-gray-500 text-center py-20">No projects yet.</p>
        )}
      </div>
    </motion.section>
  );
}
