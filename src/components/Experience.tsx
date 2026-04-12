'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/utils/cn';

type ExperienceData = typeof import('@/data/config.json').experience;

export default function Experience({ data, previewHref, className }: { data: ExperienceData; previewHref?: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (!data || !Array.isArray(data)) return null;

  return (
    <section ref={containerRef} className={cn("py-32 px-8 md:px-24 bg-transparent max-w-7xl mx-auto", className)}>
      <div className="max-w-4xl mx-auto">
        <h2 className="geist-sans text-4xl md:text-5xl font-bold tracking-tight text-white mb-24 drop-shadow-lg">Work & Experience</h2>

        <div className="relative pl-8 md:pl-0">
          {/* Vertical Line track */}
          <div className="absolute left-[7px] md:left-[3px] top-0 bottom-0 w-[2px] bg-white/10" />
          
          {/* Neon Glow Line */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-[7px] md:left-[3px] top-0 w-[2px] bg-gradient-to-b from-theme-amber to-theme-indigo shadow-[0_0_15px_rgba(99,102,241,0.6)] origin-top z-10"
          />

          <div className="flex flex-col gap-20">
            {data.map((exp, index) => (
               <div key={index} className="relative pl-8 md:pl-16 group">
                 {/* Dot Track Indicator */}
                 <div className="absolute left-[-21px] md:left-[-25px] top-1.5 w-4 h-4 rounded-full bg-theme-bg border-[3px] border-white/20 z-20 transition-all duration-500 group-hover:border-theme-indigo group-hover:bg-theme-indigo/80 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.8)]" />

                 <div className="flex flex-col gap-2">
                   <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full w-fit">
                     <span className="geist-mono text-sm font-semibold tracking-wider bg-gradient-to-r from-theme-amber to-theme-indigo bg-clip-text text-transparent">{exp.date}</span>
                   </div>
                   <h3 className="geist-sans text-3xl font-bold text-white mt-4 transition-colors duration-300 group-hover:text-theme-indigo">{exp.role}</h3>
                   <h4 className="geist-mono text-xl text-gray-400 font-medium">{exp.company}</h4>
                   <p className="geist-mono text-gray-400 mt-3 leading-relaxed max-w-xl">{exp.description}</p>
                 </div>
               </div>
            ))}
          </div>
          {previewHref && (
            <div className="mt-16 flex justify-center">
              <Link href={previewHref} className="geist-mono px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold text-white transition-all duration-300 hover:bg-theme-indigo/10 hover:border-theme-indigo/50 hover:text-theme-indigo hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                View All Experience
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
