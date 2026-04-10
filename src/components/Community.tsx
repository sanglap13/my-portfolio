'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/utils/cn';

type CommunityData = typeof import('@/data/config.json').community;

export default function Community({ data, previewHref, className }: { data: CommunityData; previewHref?: string; className?: string }) {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Calculate horizontal shift. -50% ensures it maps smoothly.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  if (!data || !Array.isArray(data)) return null;

  return (
    <section ref={targetRef} className={cn("relative h-[300vh] bg-[#121212]", className)}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Dynamic Typography Highlight */}
        <div className="absolute top-24 left-8 md:left-24 z-10 w-full">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                Community <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">& Speaking</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md">Highlighting the incredible places I&apos;ve been and ideas I&apos;ve shared.</p>
        </div>
        {previewHref && (
          <Link href={previewHref} className="absolute right-8 md:right-24 top-24 px-6 py-3 bg-white/5 border border-white/10 rounded-full font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] z-10 flex items-center gap-2">
            View All <span>&rarr;</span>
          </Link>
        )}

        <motion.div style={{ x }} className="flex gap-8 px-8 md:px-24 mt-32 w-[250%] md:w-[150%]">
          {data.map((item, idx) => (
             <div 
               key={idx} 
               className="group relative h-[400px] w-full md:w-[500px] shrink-0 overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 p-8 flex flex-col justify-end"
             >
                {/* Fallback pattern for images */}
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                
                {/* Image placeholder element */}
                <div className="absolute inset-0 z-[-1] bg-white/5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
                   <div className="w-full h-full flex items-center justify-center opacity-30 text-sm font-mono text-gray-500">
                     [ Image: {item.image} ]
                   </div>
                </div>

                <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                   <h3 className="text-3xl font-bold text-white mb-3">{item.title}</h3>
                   <p className="text-gray-300 text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{item.description}</p>
                </div>
             </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
