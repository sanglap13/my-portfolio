'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/utils/cn';
import { staggerContainer, fadeUpVariant, fadeLeftVariant } from '@/utils/animations';

import { Config } from '@/utils/config';

export default function ExperiencePreview({
  data,
  className,
}: {
  data: Config['experience'];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  if (!data) return null;

  const previewTimeline = data.timeline.slice(0, 1);

  return (
    <motion.section
      ref={containerRef}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={cn('py-32 px-8 md:px-24 bg-transparent max-w-7xl mx-auto', className)}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          variants={fadeUpVariant}
          className="geist-sans text-4xl md:text-5xl font-bold tracking-tight text-white mb-24 drop-shadow-lg"
        >
          {data.sectionTitle}
        </motion.h2>

        <div className="relative pl-8 md:pl-0">
          {/* Vertical Line track */}
          <div className="absolute left-[7px] md:left-[3px] top-0 bottom-0 w-[2px] bg-white/10" />

          {/* Neon Glow Line */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-[7px] md:left-[3px] top-0 w-[2px] bg-gradient-to-b from-theme-amber to-theme-indigo shadow-[0_0_15px_rgba(99,102,241,0.6)] origin-top z-10"
          />

          <div className="flex flex-col gap-16">
            {previewTimeline.map((entry: any, idx: number) => (
              <motion.div variants={fadeLeftVariant} key={idx} className="relative pl-8 md:pl-16 group">
                {/* Dot */}
                <div className="absolute left-[-21px] md:left-[-25px] top-1.5 w-4 h-4 rounded-full bg-theme-bg border-[3px] border-white/20 z-20 transition-all duration-500 group-hover:border-theme-indigo group-hover:bg-theme-indigo/80 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.8)]" />

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <h3 className="geist-sans text-3xl md:text-4xl font-bold text-white transition-colors duration-300 group-hover:text-theme-indigo">
                      {entry.roles[0].title}
                    </h3>
                    <span className="geist-mono text-[10px] px-3 py-1 bg-theme-indigo/15 border border-theme-indigo/30 rounded-full text-theme-indigo font-bold uppercase tracking-widest">
                      Present
                    </span>
                  </div>
                  <h4 className="geist-mono text-sm text-gray-400">
                    {entry.company} · {entry.location}
                  </h4>
                  {entry.roles[0].description && (
                    <p className="geist-mono text-gray-400/80 leading-relaxed max-w-xl mt-1 text-sm">
                      {entry.roles[0].description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <Link
              href="/experience"
              className="geist-mono px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold text-white transition-all duration-300 hover:bg-theme-indigo/10 hover:border-theme-indigo/50 hover:text-theme-indigo hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
              View Full Experience
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
