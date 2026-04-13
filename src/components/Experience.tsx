'use client';


import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { staggerContainer, fadeUpVariant, fadeLeftVariant } from '@/utils/animations';

type ExperienceConfig = typeof import('@/data/config.json').experience;
type TimelineEntry = ExperienceConfig['timeline'][number];
type WorkEntry = ExperienceConfig['works'][number];

export default function Experience({ 
  data, 
  className,
}: { 
  data: ExperienceConfig; 
  className?: string;
}) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end center'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  if (!data) return null;

  const timeline = data.timeline || [];
  const works = data.works || [];



  // Derive unique categories for the works filter
  const categories = ['All', ...Array.from(new Set(works.map((w) => w.category)))];
  const filteredWorks = activeCategory === 'All' ? works : works.filter((w) => w.category === activeCategory);

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={cn('py-32 px-8 md:px-24 bg-transparent max-w-7xl mx-auto', className)}
    >
      <div className="max-w-5xl mx-auto">

        {/* ─── CAREER TIMELINE ─── */}
        <motion.div variants={fadeUpVariant} className="mb-6">
          <h3 className="geist-mono text-sm font-bold tracking-widest text-theme-amber uppercase drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
            Career Timeline
          </h3>
        </motion.div>

        <div ref={timelineRef} className="relative pl-8 md:pl-0 mb-24">
          {/* Vertical Line track */}
          <div className="absolute left-[7px] md:left-[3px] top-0 bottom-0 w-[2px] bg-white/10" />

          {/* Neon Glow Line */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-[7px] md:left-[3px] top-0 w-[2px] bg-gradient-to-b from-theme-amber to-theme-indigo shadow-[0_0_15px_rgba(99,102,241,0.6)] origin-top z-10"
          />

          <div className="flex flex-col gap-16">
            {timeline.map((entry: TimelineEntry, companyIdx: number) => (
              <motion.div variants={fadeLeftVariant} key={companyIdx} className="relative pl-8 md:pl-16 group">
                {/* Dot Track Indicator */}
                <div className="absolute left-[-21px] md:left-[-25px] top-1.5 w-4 h-4 rounded-full bg-theme-bg border-[3px] border-white/20 z-20 transition-all duration-500 group-hover:border-theme-indigo group-hover:bg-theme-indigo/80 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.8)]" />

                <div className="flex flex-col gap-3">
                  {/* Company header */}
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <h3 className="geist-sans text-2xl md:text-3xl font-bold text-white transition-colors duration-300 group-hover:text-theme-indigo">
                      {entry.company}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="geist-mono text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-400">
                        {entry.mode}
                      </span>
                      <span className="geist-mono text-xs text-gray-500">{entry.location}</span>
                    </div>
                  </div>

                  {/* Roles within the company */}
                  <div className="flex flex-col gap-4 mt-2">
                    {entry.roles.map((role, roleIdx) => (
                      <div
                        key={roleIdx}
                        className={cn(
                          'relative pl-6 border-l-2 transition-all duration-300',
                          role.current
                            ? 'border-theme-indigo/60'
                            : 'border-white/10 hover:border-white/20'
                        )}
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                          <h4 className="geist-sans text-lg md:text-xl font-semibold text-white">
                            {role.title}
                          </h4>
                          {role.current && (
                            <span className="geist-mono text-[10px] px-2.5 py-0.5 bg-theme-indigo/15 border border-theme-indigo/30 rounded-full text-theme-indigo font-bold uppercase tracking-widest w-fit">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="geist-mono text-sm text-gray-400 mt-1">
                          {role.startDate} — {role.endDate}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack */}
                  {entry.techStack && entry.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {entry.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="geist-mono text-[10px] px-3 py-1 bg-black/40 border border-white/10 rounded-full text-gray-400 hover:text-theme-indigo hover:border-theme-indigo/30 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>


        </div>

        {/* ─── SELECTED WORKS ─── */}
        {works.length > 0 && (
          <>
            <motion.div
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="mb-10"
            >
              <h3 className="geist-mono text-sm font-bold tracking-widest text-theme-amber uppercase mb-6 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                Selected Works
              </h3>
              <p className="geist-mono text-gray-400 text-sm max-w-xl leading-relaxed mb-8">
                A curated list of systems, tools, and features I&apos;ve designed and shipped.
              </p>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'geist-mono text-xs px-4 py-2 rounded-full border transition-all duration-300 font-medium',
                      activeCategory === cat
                        ? 'bg-theme-indigo/15 border-theme-indigo/50 text-theme-indigo shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Works Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredWorks.map((work: WorkEntry) => (
                  <motion.div
                    key={work.title}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 md:p-8 flex flex-col gap-3 hover:bg-white/[0.06] hover:border-theme-indigo/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="geist-sans text-lg font-bold text-white group-hover:text-theme-indigo transition-colors">
                        {work.title}
                      </h4>
                      <span className="geist-mono text-[10px] px-2.5 py-1 bg-theme-indigo/10 border border-theme-indigo/20 rounded-full text-theme-indigo/70 whitespace-nowrap shrink-0 uppercase tracking-wider font-bold">
                        {work.category}
                      </span>
                    </div>
                    <p className="geist-mono text-sm text-gray-400 leading-relaxed">
                      {work.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto pt-2">
                      {work.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="geist-mono text-[10px] px-2.5 py-1 bg-black/40 border border-white/10 rounded-full text-gray-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </motion.section>
  );
}
