'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const FRAME_COUNT = 181;
const FPS = 24;

export default function CommunityHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Preload all frames
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, '0');
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) {
          // Draw first frame immediately
          drawFrame(img);
        }
        if (loadedCount === FRAME_COUNT) {
          setImagesLoaded(true);
        }
      };
      img.src = `/sequence_com/frame_${paddedIndex}_delay-0.041s.webp`;
      imgs.push(img);
    }

    imagesRef.current = imgs;
  }, []);

  const drawFrame = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img.complete) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };

  // Auto-play loop at ~24fps
  useEffect(() => {
    if (!imagesLoaded) return;

    let frameIndex = 0;
    let animId: number;
    let lastTime = 0;
    const interval = 1000 / FPS;

    const loop = (time: number) => {
      animId = requestAnimationFrame(loop);
      const delta = time - lastTime;
      if (delta < interval) return;

      lastTime = time - (delta % interval);
      const img = imagesRef.current[frameIndex];
      if (img && img.complete) {
        drawFrame(img);
      }
      frameIndex = (frameIndex + 1) % FRAME_COUNT;
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [imagesLoaded]);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background video canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/60 via-[#121212]/40 to-[#121212] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent,rgba(18,18,18,0.8))] pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Small label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="geist-mono text-sm tracking-[0.3em] uppercase text-theme-amber/70 mb-8"
        >
          Community & Speaking
        </motion.p>

        {/* Main title */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="geist-sans text-5xl md:text-8xl font-bold tracking-tight text-white leading-[1.1]"
          >
            Building{' '}
            <span className="bg-gradient-to-r from-theme-amber to-theme-indigo bg-clip-text text-transparent">
              Together
            </span>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="geist-mono text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed"
        >
          Talks, hackathons, mentoring, and the incredible communities that shaped my journey.
        </motion.p>

        {/* Horizontal rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-24 h-[2px] bg-gradient-to-r from-theme-amber to-theme-indigo mx-auto mt-10 origin-center"
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="geist-mono text-[10px] uppercase tracking-[0.3em] text-white/60 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          Scroll
        </span>
        <div className="w-[22px] h-[36px] border border-white/40 rounded-full flex justify-center p-1 relative drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [0.8, 0, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-1 h-1.5 bg-white/80 rounded-full absolute top-2"
          />
        </div>
      </motion.div>
    </section>
  );
}
