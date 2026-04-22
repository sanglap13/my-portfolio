'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

import { Config } from '@/utils/config';

export default function InformalFull({ data, className }: { data: Config['informal']; className?: string }) {
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
              Life isn&apos;t meant to be lived <span className="text-theme-amber underline decoration-theme-amber/30 underline-offset-8 italic">only</span> behind a screen.
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
                <span className="geist-sans text-3xl font-bold text-white">{data.countriesCount}</span>
                <span className="geist-mono text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">Countries</span>
              </div>
              <div className="flex flex-col">
                <span className="geist-sans text-3xl font-bold text-white">{data.statesCount}+</span>
                <span className="geist-mono text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">States Explored</span>
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
                {data.heroImage ? (
                  <img src={data.heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-9xl grayscale group-hover:grayscale-0 transition-all duration-700 opacity-20 group-hover:opacity-40">🏍️</span>
                    </div>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
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
             {data.reels?.map((reel, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="aspect-[9/16] rounded-[2rem] bg-[#1a1a1f] border border-white/[0.08] relative overflow-hidden group hover:border-theme-amber/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all duration-500 cursor-pointer"
                >
                  {/* Action Overlay */}
                  <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-row items-center justify-center gap-6">
                    <a
                      href={reel.youtubeUrl || '#'}
                      target={reel.youtubeUrl ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center w-14 h-14 rounded-full transition-all ${
                        reel.youtubeUrl 
                          ? 'bg-red-600 text-white hover:bg-red-500 hover:scale-110 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]' 
                          : 'bg-white/10 text-white/30 cursor-not-allowed'
                      }`}
                      onClick={(e) => !reel.youtubeUrl && e.preventDefault()}
                      title={reel.youtubeUrl ? "Watch on YouTube" : "Link Not Given"}
                    >
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" /></svg>
                    </a>
                    
                    <a
                      href={reel.instaUrl || '#'}
                      target={reel.instaUrl ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center w-14 h-14 rounded-full transition-all ${
                        reel.instaUrl 
                          ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white hover:scale-110 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]' 
                          : 'bg-white/10 text-white/30 cursor-not-allowed'
                      }`}
                      onClick={(e) => !reel.instaUrl && e.preventDefault()}
                      title={reel.instaUrl ? "View on Instagram" : "Link Not Given"}
                    >
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7"><path d="M12,2.163c3.204,0,3.584,0.012,4.85,0.07l0.203,0.009c1.077,0.046,1.66,0.218,2.05,0.368 c0.418,0.163,0.718,0.354,1.033,0.669s0.505,0.615,0.668,1.032c0.151,0.389,0.323,0.973,0.369,2.05h0.01 C21.988,8.416,22,8.796,22,12s-0.012,3.584-0.07,4.85l-0.009,0.203c-0.046,1.077-0.218,1.66-0.368,2.05 c-0.163,0.418-0.354,0.718-0.669,1.033s-0.615,0.505-1.032,0.668c-0.389,0.151-0.973,0.323-2.05,0.369v0.01 c-1.266,0.058-1.646,0.07-4.85,0.07s-3.584-0.012-4.85-0.07l-0.203-0.009c-1.077-0.046-1.66-0.218-2.05-0.368 c-0.418-0.163-0.718-0.354-1.033-0.669S2.71,19.64,2.548,19.223c-0.151-0.389-0.323-0.973-0.368-2.05H2.17 C2.112,15.584,2,15.204,2,12s0.012-3.584,0.07-4.85l0.009-0.203c0.046-1.077,0.218-1.66,0.368-2.05 c0.163-0.418,0.354-0.718,0.669-1.033S3.722,3.359,4.139,3.196c0.389-0.151,0.973-0.323,2.05-0.368v-0.01 C7.456,2.175,7.836,2.163,12,2.163 M12,0.5C8.741,0.5,8.333,0.514,7.053,0.572C5.776,0.631,4.903,0.835,4.143,1.13 c-0.785,0.305-1.45,0.709-2.115,1.374C1.363,3.169,0.96,3.834,0.655,4.619C0.359,5.378,0.156,6.252,0.098,7.528 C0.039,8.81,0.025,9.219,0.025,12c0,2.781,0.014,3.19,0.073,4.472c0.059,1.276,0.261,2.15,0.557,2.909 c0.305,0.785,0.708,1.45,1.373,2.115s1.33,1.068,2.115,1.373c0.76,0.296,1.633,0.499,2.91,0.557C8.333,23.486,8.741,23.5,12,23.5 c3.259,0,3.667-0.014,4.947-0.072c1.277-0.059,2.15-0.262,2.91-0.557c0.785-0.305,1.45-0.708,2.115-1.373 c0.665-0.665,1.068-1.33,1.373-2.115c0.296-0.76,0.499-1.633,0.557-2.909c0.058-1.282,0.072-1.691,0.072-4.472 c0-2.781-0.014-3.19-0.072-4.472c-0.058-1.276-0.261-2.15-0.557-2.908c-0.305-0.785-0.708-1.45-1.373-2.115S20.617,1.435,19.832,1.13 c-0.76-0.296-1.633-0.499-2.91-0.557C15.641,0.514,15.232,0.5,12,0.5L12,0.5z M12,5.838c-3.403,0-6.162,2.759-6.162,6.162 s2.759,6.162,6.162,6.162s6.162-2.759,6.162-6.162S15.403,5.838,12,5.838z M12,16.5c-2.485,0-4.5-2.015-4.5-4.5s2.015-4.5,4.5-4.5 s4.5,2.015,4.5,4.5S14.485,16.5,12,16.5z M18.406,6.694c0,0.615-0.5,1.115-1.115,1.115s-1.115-0.5-1.115-1.115S16.676,5.58,17.291,5.58 S18.406,6.079,18.406,6.694z"/></svg>
                    </a>
                  </div>
                  {reel.src ? (
                    <video src={reel.src} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px] z-0" />
                      <div className="absolute inset-0 flex items-center justify-center z-0">
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:scale-110 group-hover:bg-theme-amber/20 group-hover:border-theme-amber/40 transition-all duration-500">
                          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Info overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none">
                    <p className="geist-sans text-sm font-bold text-white group-hover:text-theme-amber transition-colors mb-1">
                      {reel.title}
                    </p>
                    <div className="flex items-center gap-3 drop-shadow-md">
                      <span className="geist-mono text-[9px] uppercase tracking-widest text-gray-400 font-bold">{reel.views}</span>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="geist-mono text-[9px] uppercase tracking-widest text-gray-400 font-bold">{reel.likes}</span>
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
                Moments frozen in time, captured across diverse landscapes and cultures as I explorer the world on two wheels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:h-[800px]">
              {/* Large Feature Photo */}
              <motion.div
                whileHover={{ scale: 0.98 }}
                className="aspect-square md:aspect-auto lg:col-span-2 lg:row-span-2 rounded-[2.5rem] bg-[#1a1a1f] border border-white/[0.08] overflow-hidden relative group"
              >
                  {data.photos && data.photos[0] ? (
                    <img src={data.photos[0]} alt="Gallery 1" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px]" />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-gray-700">[ {data.photos[0]} ]</div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-10 left-10">
                      <span className="geist-mono text-[10px] text-theme-amber uppercase tracking-widest font-bold mb-2 block">Mountain Expedition · 2024</span>
                      <h4 className="geist-sans text-3xl font-bold text-white underline decoration-white/20 underline-offset-8">Hidden Trails & Overlooks</h4>
                  </div>
              </motion.div>

              {/* Vertical Side Photo */}
              <motion.div
                whileHover={{ scale: 0.98 }}
                className="aspect-square md:aspect-auto lg:col-span-1 lg:row-span-2 rounded-[2.5rem] bg-[#1a1a1f] border border-white/[0.08] overflow-hidden relative group"
              >
                  {data.photos && data.photos[1] ? (
                    <img src={data.photos[1]} alt="Gallery 2" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px]" />
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-gray-700 px-6 text-center">[ {data.photos[1]} ]</div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-40 group-hover:opacity-70 transition-opacity" />
                  <div className="absolute bottom-8 left-8">
                     <h4 className="geist-sans text-xl font-bold text-white">Midnight Rider</h4>
                  </div>
              </motion.div>

              {/* Top Right Photo */}
              <motion.div
                whileHover={{ scale: 0.98 }}
                className="aspect-square md:aspect-auto lg:col-span-1 lg:row-span-1 rounded-[2.5rem] bg-[#1a1a1f] border border-white/[0.08] overflow-hidden relative group"
              >
                  {data.photos && data.photos[2] ? (
                    <img src={data.photos[2]} alt="Gallery 3" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px]" />
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-gray-700 px-6 text-center">[ {data.photos[2]} ]</div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-40 group-hover:opacity-70 transition-opacity" />
                  <div className="absolute bottom-8 left-8">
                     <h4 className="geist-sans text-lg font-bold text-white">The Gear</h4>
                  </div>
              </motion.div>

              {/* Bottom Right Photo */}
              <motion.div
                whileHover={{ scale: 0.98 }}
                className="aspect-square md:aspect-auto lg:col-span-1 lg:row-span-1 rounded-[2.5rem] bg-[#1a1a1f] border border-white/[0.08] overflow-hidden relative group"
              >
                  {data.photos && data.photos[3] ? (
                    <img src={data.photos[3]} alt="Gallery 4" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px]" />
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-gray-700 px-6 text-center">[ {data.photos[3]} ]</div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-40 group-hover:opacity-70 transition-opacity" />
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
               I share my adventures and gear reviews as <span className="text-white font-bold">{data.creatorName}</span> across all social platforms. Let&apos;s explore together.
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
