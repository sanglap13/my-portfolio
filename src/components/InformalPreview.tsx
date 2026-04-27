'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { staggerContainer, fadeUpVariant } from '@/utils/animations';
import MagneticButton from '@/components/MagneticButton';

import { Config } from '@/utils/config';
import UnderConstruction from './UnderConstruction';

function GlowCard({ children, className, glowColor }: { children: React.ReactNode, className?: string, glowColor?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      variants={fadeUpVariant}
      onMouseMove={handleMouseMove}
      className={cn("relative overflow-hidden group transition-all duration-500", className)}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              ${glowColor || 'rgba(99,102,241,0.15)'},
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </motion.div>
  );
}

export default function InformalPreview({ data, className, globalConfig }: { data: Config['informal']; className?: string; globalConfig: Config['global'] }) {

  if (!data) return null;

  if (globalConfig?.underConstruction?.informal) {
    return (
      <section className={cn('py-32 px-8 md:px-24 bg-transparent max-w-7xl mx-auto', className)}>
        <UnderConstruction title="Beyond the Code" config={globalConfig.underConstructionConfig} variant="section" />
      </section>
    );
  }

  return (
    <section className={cn('py-20 md:py-32 px-6 md:px-24 bg-transparent', className)}>
      <div className="flex flex-col md:flex-row md:items-end justify-between max-w-7xl mx-auto mb-10 md:mb-16 drop-shadow-md">
        <h2 className="geist-sans text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 md:mb-0">
          Beyond the Code
        </h2>
        <MagneticButton>
          <Link
            href="/informal"
            className="geist-mono px-6 py-3 bg-white/5 border border-white/10 rounded-full font-semibold text-white transition-all duration-300 hover:bg-theme-indigo/10 hover:border-theme-indigo/50 hover:text-theme-indigo hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] w-fit flex items-center gap-2"
          >
            Explore More <span>&rarr;</span>
          </Link>
        </MagneticButton>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 md:h-[650px] max-w-7xl mx-auto"
      >
        {/* Main Video/Vlog Showcase */}
        <GlowCard
          glowColor="rgba(99,102,241,0.15)"
          className="md:col-span-2 md:row-span-2 min-h-[400px] md:min-h-0 rounded-[2rem] bg-black/40 backdrop-blur-md border border-white/10 p-8 md:p-10 flex flex-col justify-end hover:border-theme-indigo/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
        >
          {data.heroImage ? (
            <div className="absolute inset-0 z-[-1]">
              <Image src={data.heroImage} alt="Hero" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
          ) : (
            <div className="absolute inset-0 z-[-1] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 z-[-1]" />

          <p className="geist-mono text-sm font-bold tracking-widest text-theme-amber mb-3 uppercase relative z-10">
            Creator Spotlight
          </p>
          <h3 className="geist-sans text-3xl font-bold text-white relative z-10 mb-2">
            {data.video.title}
          </h3>
        </GlowCard>

        {/* About / Identity Card */}
        <GlowCard
          className="md:col-span-2 md:row-span-1 rounded-[2rem] bg-white/5 border border-white/10 p-8 flex flex-col justify-center hover:bg-theme-indigo/5"
        >
          <h3 className="geist-sans text-2xl font-bold text-white leading-tight mb-4">{data.title}</h3>
          <p className="geist-mono text-gray-400 leading-relaxed text-sm lg:text-base">
            {data.description}
          </p>
        </GlowCard>

        {/* Photo 1 */}
        <GlowCard
          glowColor="rgba(245,158,11,0.15)"
          className="md:col-span-1 md:row-span-1 min-h-[250px] md:min-h-0 rounded-[2rem] bg-white/5 border border-white/10 hover:border-theme-amber/50"
        >
          {data.photos && data.photos[0] ? (
            <Image src={data.photos[0]} alt="Gallery 1" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-xs font-mono text-gray-500 absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]">
              <span className="text-3xl mb-2 grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100 transition-all">
                🏍️
              </span>
              [ {data.photos[0]} ]
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-theme-amber/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </GlowCard>

        {/* Photo 2 */}
        <GlowCard
          glowColor="rgba(99,102,241,0.15)"
          className="md:col-span-1 md:row-span-1 min-h-[250px] md:min-h-0 rounded-[2rem] bg-white/5 border border-white/10 hover:border-theme-indigo/50"
        >
          {data.photos && data.photos[1] ? (
            <Image src={data.photos[1]} alt="Gallery 2" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-xs font-mono text-gray-500 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]">
              <span className="text-3xl mb-2 grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100 transition-all">
                📸
              </span>
              [ {data.photos[1]} ]
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-theme-indigo/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </GlowCard>
      </motion.div>
    </section>
  );
}
