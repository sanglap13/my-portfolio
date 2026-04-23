'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpVariant } from '@/utils/animations';
import { cn } from '@/utils/cn';
import { Config, getConfig } from '@/utils/config';
import UnderConstruction from './UnderConstruction';

export default function Projects({ data, className, globalConfig }: { data?: Config['projects']; className?: string; globalConfig: Config['global'] }) {
  const projects = data || ({} as Config['projects']);
  const uc = projects.pageConfig;

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={cn('py-24 px-6 md:px-24 bg-transparent', className)}
    >
      <div className="max-w-7xl mx-auto">
        {globalConfig?.underConstruction?.projects ? (
          <UnderConstruction 
            title={projects.title} 
            config={globalConfig.underConstructionConfig} 
          />
        ) : (
          /* Future: render project cards here from projects.items */
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16">
            <h2 className="geist-sans text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 md:mb-0">
              {projects.title}
            </h2>
            <Link
              href="/projects"
              className="geist-mono px-6 py-3 bg-white/5 border border-white/10 rounded-full font-semibold text-white transition-all duration-300 hover:bg-theme-indigo/10 hover:border-theme-indigo/50 hover:text-theme-indigo hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] w-fit flex items-center gap-2"
            >
              View All <span>&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </motion.section>
  );
}
