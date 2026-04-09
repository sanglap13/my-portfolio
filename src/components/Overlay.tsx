'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';

export default function Overlay({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Section 1: 0% to 20%
  const opacity1 = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.25], [0, -100]);
  const display1 = useTransform(scrollYProgress, (pos) => (pos > 0.25 ? "none" : "flex"));

  // Section 2: 20% to 50%
  const opacity2 = useTransform(scrollYProgress, [0.15, 0.3, 0.45], [0, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.15, 0.3, 0.45], [100, 0, -100]);
  const display2 = useTransform(scrollYProgress, (pos) => (pos < 0.15 || pos > 0.45 ? "none" : "flex"));

  // Section 3: 45% to 80%
  const opacity3 = useTransform(scrollYProgress, [0.4, 0.6, 0.8], [0, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.4, 0.6, 0.8], [100, 0, -100]);
  const display3 = useTransform(scrollYProgress, (pos) => (pos < 0.4 || pos > 0.8 ? "none" : "flex"));

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Section 1 - Center */}
      <motion.div 
        style={{ opacity: opacity1, y: y1, display: display1 }}
        className="absolute inset-0 flex-col items-center justify-center p-8 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4">
          Sanglap Mridha
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-medium">
          Software Engineer
        </p>
      </motion.div>

      {/* Section 2 - Left */}
      <motion.div 
        style={{ opacity: opacity2, y: y2, display: display2 }}
        className="absolute inset-0 flex-col items-start justify-center p-8 md:p-24"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white max-w-2xl text-balance">
          I build digital<br />experiences.
        </h2>
      </motion.div>

      {/* Section 3 - Right */}
      <motion.div 
        style={{ opacity: opacity3, y: y3, display: display3 }}
        className="absolute inset-0 flex-col items-end justify-center p-8 md:p-24 text-right"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white max-w-2xl text-balance">
          Bridging design<br />and engineering.
        </h2>
      </motion.div>
    </div>
  );
}
