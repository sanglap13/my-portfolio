'use client';
import { motion } from 'framer-motion';

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-theme-bg">
      {/* Film grain noise overlay */}
      <div className="bg-noise absolute inset-0 mix-blend-overlay"></div>

      {/* Massive blurred orbs reflecting the video's lighting */}
      
      {/* Light 1: Amber/Rust (Left Side) */}
      <motion.div
        animate={{
          x: ['-20%', '-10%', '-25%', '-20%'],
          y: ['-10%', '5%', '-15%', '-10%'],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 left-0 w-[40vw] h-[60vh] bg-theme-amber/15 rounded-full blur-[80px] mix-blend-screen will-change-transform"
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Light 2: Deep Indigo/Cyan (Right Side) */}
      <motion.div
        animate={{
          x: ['20%', '30%', '15%', '20%'],
          y: ['10%', '-5%', '15%', '10%'],
          scale: [0.9, 1, 1.1, 0.9],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-0 right-0 w-[50vw] h-[70vh] bg-theme-indigo/15 rounded-full blur-[90px] mix-blend-screen will-change-transform"
        style={{ transform: 'translateZ(0)' }}
      />
    </div>
  );
}
