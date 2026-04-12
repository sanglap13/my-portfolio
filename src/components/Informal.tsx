import { cn } from '@/utils/cn';

import Link from 'next/link';

type InformalData = typeof import('@/data/config.json').informal;

export default function Informal({ data, previewHref, className }: { data: InformalData; previewHref?: string; className?: string }) {
  if (!data) return null;

  return (
    <section className={cn("py-20 md:py-32 px-6 md:px-24 bg-transparent", className)}>
        <div className="flex flex-col md:flex-row md:items-end justify-between max-w-7xl mx-auto mb-10 md:mb-16 drop-shadow-md">
          <h2 className="geist-sans text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 md:mb-0">Beyond the Code</h2>
          {previewHref && (
            <Link href={previewHref} className="geist-mono px-6 py-3 bg-white/5 border border-white/10 rounded-full font-semibold text-white transition-all duration-300 hover:bg-theme-indigo/10 hover:border-theme-indigo/50 hover:text-theme-indigo hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] w-fit flex items-center gap-2">
              Explore More <span>&rarr;</span>
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 md:h-[650px] max-w-7xl mx-auto">
            
            {/* Main Video/Vlog Showcase */}
            <div className="md:col-span-2 md:row-span-2 min-h-[400px] md:min-h-0 rounded-[2rem] bg-black/40 backdrop-blur-md border border-white/10 p-8 md:p-10 flex flex-col justify-end relative overflow-hidden group hover:border-theme-indigo/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-500">
               {/* Video Placeholder Background */}
               <div className="absolute inset-0 z-[-1] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-theme-indigo/20 flex items-center justify-center backdrop-blur-md border border-theme-indigo/50 group-hover:bg-theme-indigo/40 group-hover:scale-110 transition-all duration-500">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-2" />
                  </div>
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
               
               <p className="geist-mono text-sm font-bold tracking-widest text-theme-amber mb-3 uppercase relative z-10">Creator Spotlight</p>
               <h3 className="geist-sans text-3xl font-bold text-white relative z-10 mb-2">{data.video.title}</h3>
               <p className="geist-mono text-gray-300 relative z-10">[ {data.video.placeholder} ]</p>
            </div>

            {/* About / Identity Card */}
            <div className="md:col-span-2 md:row-span-1 rounded-[2rem] bg-white/5 border border-white/10 p-8 flex flex-col justify-center group transition-colors hover:bg-theme-indigo/5">
               <h3 className="geist-sans text-2xl font-bold text-white leading-tight mb-4">{data.title}</h3>
               <p className="geist-mono text-gray-400 leading-relaxed text-sm lg:text-base">{data.description}</p>
            </div>

            {/* Photo 1 Placeholder */}
            <div className="md:col-span-1 md:row-span-1 min-h-[250px] md:min-h-0 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden group hover:border-theme-amber/50 transition-colors">
               <div className="w-full h-full flex flex-col items-center justify-center text-xs font-mono text-gray-500 absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]">
                 <span className="text-3xl mb-2 grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100 transition-all">🏍️</span>
                 [ {data.photos[0]} ]
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-theme-amber/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>

            {/* Photo 2 Placeholder */}
            <div className="md:col-span-1 md:row-span-1 min-h-[250px] md:min-h-0 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden group hover:border-theme-indigo/50 transition-colors">
               <div className="w-full h-full flex flex-col items-center justify-center text-xs font-mono text-gray-500 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]">
                  <span className="text-3xl mb-2 grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100 transition-all">📸</span>
                 [ {data.photos[1]} ]
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-theme-indigo/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>

        </div>
    </section>
  );
}
