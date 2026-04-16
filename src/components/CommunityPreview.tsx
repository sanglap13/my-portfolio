'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/utils/cn';
import { staggerContainer, fadeUpVariant } from '@/utils/animations';

import { Config } from '@/utils/config';

export default function CommunityPreview({ data, className }: { data: Config['community']; className?: string }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  useEffect(() => {
    const updateRange = () => {
      if (containerRef.current) {
        setScrollRange(Math.max(0, containerRef.current.scrollWidth - window.innerWidth));
      }
    };
    updateRange();
    window.addEventListener('resize', updateRange);
    return () => window.removeEventListener('resize', updateRange);
  }, [data]);

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  if (!data || !Array.isArray(data)) return null;

  return (
    <section ref={targetRef} className={cn('relative h-[200vh] bg-[#050505]', className)}>
      <div className="sticky top-0 z-10 flex h-screen items-center overflow-hidden w-full">
        {/* Dotted Background */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Edge Vignette */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_bottom,var(--theme-bg)_0%,transparent_10%,transparent_90%,var(--theme-bg)_100%)] pointer-events-none" />

        {/* Header */}
        <div className="absolute top-12 md:top-24 left-6 md:left-24 z-10 w-full drop-shadow-lg pr-6">
          <h2 className="geist-sans text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
            Community <span className="bg-gradient-to-r from-theme-amber to-theme-indigo bg-clip-text text-transparent">&amp; Speaking</span>
          </h2>
          <p className="geist-mono text-gray-400 text-sm md:text-lg max-w-xs md:max-w-md">
            Highlighting the incredible places I&apos;ve been and ideas I&apos;ve shared.
          </p>
        </div>

        <Link
          href="/community"
          className="geist-mono absolute right-6 md:right-24 bottom-12 md:bottom-auto md:top-24 px-5 py-2.5 md:px-6 md:py-3 bg-white/5 border border-white/10 rounded-full font-semibold text-white transition-all duration-300 hover:bg-theme-indigo/10 hover:border-theme-indigo/50 hover:text-theme-indigo hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] z-10 flex items-center gap-2 text-sm md:text-base"
        >
          View All <span>&rarr;</span>
        </Link>

        <motion.div
          ref={containerRef}
          style={{ x }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="flex gap-4 md:gap-8 px-6 md:pl-24 md:pr-24 mt-20 md:mt-32 w-max items-center"
        >
          {data.map((item, idx) => (
            <motion.div
              variants={fadeUpVariant}
              key={idx}
              className="group relative h-[320px] md:h-[400px] w-[85vw] md:w-[500px] shrink-0 overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-white/5 border border-white/10 p-6 md:p-8 flex flex-col justify-end"
            >
              <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-0 z-[-1] bg-white/5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
                <div className="w-full h-full flex items-center justify-center opacity-30 text-sm font-mono text-gray-500">
                  [ Image: {item.image} ]
                </div>
              </div>

              <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="geist-sans text-3xl font-bold text-white mb-3 drop-shadow-md">
                  {item.title}
                </h3>
                <p className="geist-mono text-gray-300 text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 drop-shadow-sm">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
