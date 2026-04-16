'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const TYPING_TEXT = "Good things take time!";

export default function LoadingScreen() {
  const [displayText, setDisplayText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= TYPING_TEXT.length) {
        setDisplayText(TYPING_TEXT.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#121212] flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-theme-indigo/10 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full bg-theme-amber/5 blur-[120px]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-16 h-16 flex items-center justify-center"
        >
          <div className="absolute inset-0 rounded-xl bg-white/[0.03] border border-white/10" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-full border-t-2 border-r-2 border-white/40 border-l-2 border-l-transparent border-b-2 border-b-transparent"
          />
        </motion.div>

        {/* Typing Text */}
        <div className="flex flex-col items-center gap-2">
          <p className="geist-mono text-sm md:text-base text-gray-400 font-medium tracking-tight text-center max-w-[300px] md:max-w-none">
            <span className="text-gray-600 mr-2">$</span>
            {displayText}
            <span className={cursorVisible ? 'opacity-100' : 'opacity-0'}>_</span>
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="geist-sans text-[10px] text-gray-600 uppercase tracking-[0.3em] font-bold"
          >
            Fetching Config from Source...
          </motion.p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
          <motion.div
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
