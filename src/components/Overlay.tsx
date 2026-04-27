'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';

import { Config } from '@/utils/config';

export default function Overlay({ 
  scrollYProgress, 
  content 
}: { 
  scrollYProgress: MotionValue<number>;
  content: Config['overlay'];
}) {
  // Section 1: 0% to 10% 
  const opacity1 = useTransform(scrollYProgress, [0, 0.04, 0.09, 0.10, 1], [1, 1, 0, 0, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.04, 0.09], [0, 0, -50]);

  // Section 2: 11% to 23% 
  const opacity2 = useTransform(scrollYProgress, [0, 0.10, 0.11, 0.17, 0.22, 0.23, 1], [0, 0, 0, 1, 0, 0, 0]);
  const y2 = useTransform(scrollYProgress, [0, 0.11, 0.17, 0.22], [50, 50, 0, -50]);

  // Section 3: 24% to 35% 
  const opacity3 = useTransform(scrollYProgress, [0, 0.23, 0.24, 0.29, 0.34, 0.35, 1], [0, 0, 0, 1, 0, 0, 0]);
  const y3 = useTransform(scrollYProgress, [0, 0.24, 0.29, 0.34], [50, 50, 0, -50]);

  if (!content) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {/* Section 1 - Center */}
      <motion.div 
        style={{ opacity: opacity1, y: y1 }}
        className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-24 text-center"
      >
        <motion.h1 
          initial={{ scale: 1.1, opacity: 0, filter: "blur(10px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="geist-sans text-4xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-white/80 mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] font-extrabold leading-[1.2]"
        >
          {content.section1.title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="geist-mono text-lg md:text-3xl text-white/60 font-medium tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
        >
          {content.section1.subtitle}
        </motion.p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity: opacity1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="geist-mono text-[10px] uppercase tracking-[0.3em] text-white/60 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          Scroll
        </span>
        <div className="w-[22px] h-[36px] border border-white/40 rounded-full flex justify-center p-1 relative drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          <motion.div 
            animate={{ y: [0, 12, 0], opacity: [0.8, 0, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1 h-1.5 bg-white/80 rounded-full absolute top-2"
          />
        </div>
      </motion.div>

      {/* Section 2 - Left Quote 1 */}
      <motion.div 
        style={{ opacity: opacity2, y: y2 }}
        className="absolute inset-0 flex flex-col items-start justify-end pb-32 md:justify-center p-8 md:p-24 text-left"
      >
        <h2 className="geist-sans text-3xl md:text-6xl font-bold tracking-tight text-white/80 max-w-3xl text-balance drop-shadow-[0_0_25px_rgba(255,255,255,0.5)] leading-tight py-2">
          {content.section2.line1}
          <span className="geist-mono opacity-80 block bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent pb-3 pt-2 mt-1 leading-normal drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]">
            {content.section2.line2}
          </span>
        </h2>
      </motion.div>

      {/* Section 3 - Right Quote 2 */}
      <motion.div 
        style={{ opacity: opacity3, y: y3 }}
        className="absolute inset-0 flex flex-col items-end justify-end pb-8 md:justify-center p-8 md:p-24 text-right"
      >
        <h2 className="geist-sans text-3xl md:text-6xl font-bold tracking-tight text-white/80 max-w-3xl text-balance drop-shadow-[0_0_25px_rgba(255,255,255,0.5)] leading-tight py-2">
          {content.section3.line1}
          <span className="geist-mono opacity-80 block bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent pb-3 pt-2 mt-1 leading-normal drop-shadow-[0_0_25px_rgba(52,211,153,0.5)]">
            {content.section3.line2}
          </span>
        </h2>
      </motion.div>
    </div>
  );
}
