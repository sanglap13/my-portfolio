'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

type InformalData = {
  creatorName: string;
  creatorId: string;
  youtubeUrl: string;
  instagramUrl: string;
  description: string;
  video: {
    title: string;
    placeholder: string;
  };
  photos: string[];
};

export default function InformalFull({ data, className }: { data: InformalData; className?: string }) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  if (!data) return null;

  return (
    <section className={cn('py-24 px-4 md:px-12 relative overflow-hidden', className)}>
      {/* Ambient backgrounds */}
      <div className="pointer-events-none absolute -inset-x-[50vw] inset-y-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full bg-theme-amber/[0.08] blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-orange-500/[0.06] blur-[100px]"
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#121212] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#121212] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-32">
        
        {/* ─── STORY / PHILOSOPHY SECTION ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="geist-mono text-xs uppercase tracking-[0.4em] text-theme-amber/60 mb-6 font-bold">The Philosophy</p>
            <h2 className="geist-sans text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Life isn't meant to be lived <span className="text-theme-amber underline decoration-theme-amber/30 underline-offset-8 italic">only</span> behind a screen.
            </h2>
            <p className="geist-mono text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl">
              {data.description}
            </p>
            <div className="mt-12 flex gap-8">
              <div className="flex flex-col">
                <span className="geist-sans text-3xl font-bold text-white">20K+</span>
                <span className="geist-mono text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">Video Views</span>
              </div>
              <div className="flex flex-col">
                <span className="geist-sans text-3xl font-bold text-white">10+</span>
                <span className="geist-mono text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">States Explored</span>
              </div>
              <div className="flex flex-col">
                <span className="geist-sans text-3xl font-bold text-white">500+</span>
                <span className="geist-mono text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">Hours Riding</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
             <div className="aspect-[4/5] rounded-[2.5rem] bg-gradient-to-br from-theme-amber/20 to-orange-500/10 border border-white/10 overflow-hidden relative group">
                {/* Minimalist Rider Icon / Placeholder for a cinematic photo */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-9xl grayscale group-hover:grayscale-0 transition-all duration-700 opacity-20 group-hover:opacity-40">🏍️</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-10 left-10">
                   <p className="geist-mono text-xs uppercase tracking-widest text-white/40 mb-2">Adventure Awaits</p>
                   <p className="geist-sans text-2xl font-bold text-white leading-tight">Rolling the throttle <br /> since 2018.</p>
                </div>
             </div>
             {/* Floating badge */}
             <motion.div
               animate={{ y: [0, -15, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
               className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-theme-amber border border-amber-400/50 flex flex-col items-center justify-center rotate-12 shadow-[0_0_30px_rgba(245,158,11,0.3)] z-20"
             >
                <span className="geist-mono text-[10px] font-black text-black uppercase tracking-tight">Traveler</span>
                <span className="geist-sans text-xl font-black text-black">9.6K km</span>
                <span className="geist-mono text-[8px] font-bold text-black/60 uppercase">Last trip</span>
             </motion.div>
          </motion.div>
        </div>

        {/* ─── VERTICAL FEED (SHORTS / REELS) ─── */}
        <div className="flex flex-col gap-12">
           <div className="text-center">
             <p className="geist-mono text-[10px] uppercase tracking-[0.5em] text-theme-amber/70 font-black mb-4">{data.creatorId}</p>
             <h2 className="geist-sans text-3xl md:text-5xl font-bold text-white tracking-tight">Shorts & Reels</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-0">
             {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="aspect-[9/16] rounded-[2rem] bg-[#1a1a1f] border border-white/[0.08] relative overflow-hidden group hover:border-theme-amber/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all duration-500 cursor-pointer"
                >
                  {/* Grid / Placeholder */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:scale-110 group-hover:bg-theme-amber/20 group-hover:border-theme-amber/40 transition-all duration-500">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                    </div>
                  </div>
                  
                  {/* Info overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="geist-sans text-sm font-bold text-white group-hover:text-theme-amber transition-colors mb-1">
                      {i === 1 ? data.video.title : `Adventure Sequence #${i}`}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="geist-mono text-[9px] uppercase tracking-widest text-gray-500 font-bold">128.4K Views</span>
                      <div className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="geist-mono text-[9px] uppercase tracking-widest text-gray-500 font-bold">12.5K Likes</span>
                    </div>
                  </div>
                </motion.div>
             ))}
           </div>
        </div>

        {/* ─── MOSAIC GALLERY ─── */}
        <div className="flex flex-col gap-12">
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
              <div>
                <p className="geist-mono text-[10px] uppercase tracking-[0.5em] text-theme-amber/70 font-bold mb-4">Perspective</p>
                <h2 className="geist-sans text-3xl md:text-5xl font-bold text-white tracking-tight">The Gallery</h2>
              </div>
              <p className="geist-mono text-xs text-gray-500 max-w-[200px] text-right hidden md:block uppercase tracking-wider leading-relaxed">
                Moments frozen in time, captured across the diverse landscapes of India.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:h-[800px]">
              {/* Large Feature Photo */}
              <motion.div
                whileHover={{ scale: 0.98 }}
                className="lg:col-span-2 lg:row-span-2 rounded-[2.5rem] bg-[#1a1a1f] border border-white/[0.08] overflow-hidden relative group"
              >
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px]" />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-gray-700">[ {data.photos[0]} ]</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-10 left-10">
                     <span className="geist-mono text-[10px] text-theme-amber uppercase tracking-widest font-bold mb-2 block">Road Trip · 2024</span>
                     <h4 className="geist-sans text-3xl font-bold text-white underline decoration-white/20 underline-offset-8">Across the Valley</h4>
                  </div>
              </motion.div>

              {/* Vertical Side Photo */}
              <motion.div
                whileHover={{ scale: 0.98 }}
                className="lg:col-span-1 lg:row-span-2 rounded-[2.5rem] bg-[#1a1a1f] border border-white/[0.08] overflow-hidden relative group"
              >
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px]" />
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-gray-700 px-6 text-center">[ {data.photos[1]} ]</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40 group-hover:opacity-70 transition-opacity" />
                  <div className="absolute bottom-8 left-8">
                     <h4 className="geist-sans text-xl font-bold text-white">Midnight Rider</h4>
                  </div>
              </motion.div>

              {/* Top Right Photo */}
              <motion.div
                whileHover={{ scale: 0.98 }}
                className="lg:col-span-1 lg:row-span-1 rounded-[2.5rem] bg-[#1a1a1f] border border-white/[0.08] overflow-hidden relative group"
              >
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px]" />
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-gray-700 px-6 text-center">[ {data.photos[2]} ]</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40 group-hover:opacity-70 transition-opacity" />
                  <div className="absolute bottom-8 left-8">
                     <h4 className="geist-sans text-lg font-bold text-white">The Gear</h4>
                  </div>
              </motion.div>

              {/* Bottom Right Photo */}
              <motion.div
                whileHover={{ scale: 0.98 }}
                className="lg:col-span-1 lg:row-span-1 rounded-[2.5rem] bg-[#1a1a1f] border border-white/[0.08] overflow-hidden relative group"
              >
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px]" />
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-gray-700 px-6 text-center">[ Exploring New Trails ]</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40 group-hover:opacity-70 transition-opacity" />
                  <div className="absolute bottom-8 left-8">
                     <h4 className="geist-sans text-lg font-bold text-white">Golden Hour</h4>
                  </div>
              </motion.div>
            </div>
        </div>

        {/* ─── CONNECT CARD ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[3rem] bg-gradient-to-br from-[#1a1a1f] to-[#121212] border border-white/5 p-12 md:p-24 text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(245,158,11,0.1),transparent_70%)]" />
          <div className="relative z-10 max-w-2xl mx-auto">
             <h2 className="geist-sans text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Follow the Ride.</h2>
             <p className="geist-mono text-gray-400 text-lg mb-12">
               I share my adventures and gear reviews as <span className="text-white font-bold">{data.creatorName}</span> across all social platforms. Let's explore together.
             </p>
             <div className="flex flex-wrap justify-center gap-6">
                <a href={data.youtubeUrl} target="_blank" rel="noopener noreferrer" className="geist-mono px-8 py-4 bg-white text-black rounded-full font-black hover:bg-theme-amber hover:scale-105 transition-all duration-300">YouTube</a>
                <a href={data.instagramUrl} target="_blank" rel="noopener noreferrer" className="geist-mono px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-black hover:bg-white/10 hover:scale-105 transition-all duration-300">Instagram</a>
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
