'use client';


import { useRef, useState, useEffect, useCallback } from 'react';
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
  const [selectedWork, setSelectedWork] = useState<WorkEntry | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedWork) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedWork]);

  const handleClose = useCallback(() => setSelectedWork(null), []);

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
      className={cn('py-32 px-4 md:px-12 bg-transparent max-w-7xl mx-auto relative', className)}
    >
      {/* ─── AMBIENT BACKGROUND (full screen) ─── */}
      <div className="fixed-bg pointer-events-none absolute -inset-x-[50vw] inset-y-0 overflow-hidden">
        {/* Floating gradient orbs */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full bg-theme-indigo/[0.12] blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[60%] right-[10%] w-[400px] h-[400px] rounded-full bg-theme-amber/[0.10] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-purple-500/[0.08] blur-[80px]"
        />

        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.10),transparent_70%)]" />

        {/* Top/bottom fade */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#121212] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#121212] to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

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
          <div
            className="relative"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
            }}
          >
            {/* Cursor spotlight on the entire works area */}
            <div
              className="pointer-events-none absolute -inset-4 rounded-3xl opacity-0 hover-parent-glow transition-opacity duration-500"
              style={{
                background: 'radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(99,102,241,0.06), transparent 60%)',
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-12"
            >
              <div>
                <h3 className="geist-mono text-sm font-bold tracking-widest text-theme-amber uppercase mb-3 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                  Selected Works
                </h3>
                <p className="geist-mono text-gray-500 text-sm max-w-lg leading-relaxed">
                  A curated showcase of systems, tools, and features — designed and shipped.
                </p>
              </div>
              <div className="geist-mono text-6xl md:text-8xl font-black text-white/[0.03] select-none leading-none mt-4 md:mt-0">
                {String(filteredWorks.length).padStart(2, '0')}
              </div>
            </motion.div>

            {/* Category Filter — horizontal scroll with active glow */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex gap-2 mb-10 overflow-x-auto scrollbar-none pb-2"
            >
              {categories.map((cat) => {
                const count = cat === 'All' ? works.length : works.filter(w => w.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'geist-mono text-xs px-5 py-2.5 rounded-full border transition-all duration-300 font-medium whitespace-nowrap flex items-center gap-2',
                      activeCategory === cat
                        ? 'bg-theme-indigo/15 border-theme-indigo/50 text-theme-indigo shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                        : 'bg-white/[0.03] border-white/10 text-gray-500 hover:bg-white/[0.06] hover:text-gray-300 hover:border-white/20'
                    )}
                  >
                    {cat}
                    <span className={cn(
                      'text-[9px] px-1.5 py-0.5 rounded-full font-bold',
                      activeCategory === cat 
                        ? 'bg-theme-indigo/25 text-theme-indigo' 
                        : 'bg-white/5 text-gray-600'
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </motion.div>

            {/* Works Grid — premium cards */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filteredWorks.map((work: WorkEntry, idx: number) => (
                  <motion.div
                    key={work.title}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    onClick={() => setSelectedWork(work)}
                    className="group relative rounded-2xl bg-[#1a1a1f] border border-white/[0.07] p-7 flex flex-col gap-4 overflow-hidden hover:bg-[#1e1e24] hover:border-white/15 transition-all duration-500 cursor-pointer"
                  >
                    {/* Ghost index number */}
                    <span className="absolute -right-2 -top-4 geist-sans text-7xl font-black text-white/[0.03] select-none leading-none group-hover:text-white/[0.06] transition-all duration-500">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-theme-indigo/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Category + Arrow */}
                    <div className="flex items-center justify-between relative z-10">
                      <span className="geist-mono text-[10px] px-3 py-1.5 bg-theme-indigo/[0.08] border border-theme-indigo/15 rounded-full text-theme-indigo/60 uppercase tracking-wider font-bold group-hover:bg-theme-indigo/15 group-hover:text-theme-indigo/90 group-hover:border-theme-indigo/30 transition-all duration-300">
                        {work.category}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-white/50">
                          <path d="M1 5H9M9 5L5 1M9 5L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="geist-sans text-lg font-bold text-white/90 group-hover:text-white transition-colors relative z-10 leading-snug">
                      {work.title}
                    </h4>

                    {/* Description */}
                    <p className="geist-mono text-[13px] text-gray-500 leading-relaxed relative z-10 group-hover:text-gray-400 transition-colors line-clamp-3">
                      {work.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-3 relative z-10">
                      {work.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="geist-mono text-[10px] px-2.5 py-1 bg-white/[0.03] border border-white/[0.07] rounded-full text-gray-600 group-hover:text-gray-400 group-hover:border-white/10 transition-all duration-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>

      {/* ─── WORK DETAIL MODAL ─── */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-8"
            onClick={handleClose}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl bg-[#131316] border border-white/10 p-8 md:p-12 overflow-hidden"
            >
              {/* Ghost number */}
              <span className="absolute -right-4 -top-6 geist-sans text-[120px] font-black text-white/[0.03] select-none leading-none">
                {String(works.indexOf(selectedWork) + 1).padStart(2, '0')}
              </span>

              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-theme-indigo/50 to-transparent" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 z-10"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>

              {/* Category */}
              <span className="geist-mono text-[10px] px-3 py-1.5 bg-theme-indigo/10 border border-theme-indigo/20 rounded-full text-theme-indigo/80 uppercase tracking-wider font-bold inline-block mb-6">
                {selectedWork.category}
              </span>

              {/* Title */}
              <h3 className="geist-sans text-2xl md:text-3xl font-bold text-white mb-5 leading-snug pr-12">
                {selectedWork.title}
              </h3>

              {/* Divider */}
              <div className="w-full h-[1px] bg-white/[0.06] mb-6" />

              {/* Full description */}
              <p className="geist-mono text-sm md:text-base text-gray-400 leading-relaxed mb-8">
                {selectedWork.description}
              </p>

              {/* Tags */}
              <div className="mb-2">
                <span className="geist-mono text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-3 block">Technologies</span>
                <div className="flex flex-wrap gap-2">
                  {selectedWork.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="geist-mono text-xs px-3.5 py-1.5 bg-white/[0.04] border border-white/10 rounded-full text-gray-400 hover:text-theme-indigo hover:border-theme-indigo/30 transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
