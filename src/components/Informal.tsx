import { cn } from '@/utils/cn';

import Link from 'next/link';

type InformalData = typeof import('@/data/config.json').informal;

export default function Informal({ data, previewHref, className }: { data: InformalData; previewHref?: string; className?: string }) {
  if (!data) return null;

  return (
    <section className={cn("py-32 px-8 md:px-24 bg-[#121212]", className)}>
        <div className="flex flex-col md:flex-row md:items-end justify-between max-w-7xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 md:mb-0">Beyond the Code</h2>
          {previewHref && (
            <Link href={previewHref} className="px-6 py-3 bg-white/5 border border-white/10 rounded-full font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] w-fit flex items-center gap-2">
              Explore More <span>&rarr;</span>
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[repeat(auto-fit,minmax(200px,1fr))] md:grid-rows-2 gap-6 md:h-[650px] max-w-7xl mx-auto">
            
            {/* Music Card */}
            <div className="md:col-span-2 md:row-span-1 rounded-[2rem] bg-white/5 border border-white/10 p-10 flex flex-col justify-end relative overflow-hidden group hover:border-purple-500/50 transition-colors duration-500">
               <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <p className="text-sm font-bold tracking-widest text-purple-400 mb-3 uppercase relative z-10">{data.music.title}</p>
               <h3 className="text-4xl font-bold text-white relative z-10 mb-1">{data.music.artist}</h3>
               <p className="text-gray-400 text-lg relative z-10">Listening to • {data.music.album}</p>
               
               {/* Decorative Element */}
               <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-purple-500/30 flex items-center justify-center animate-spin-slow">
                 <div className="w-4 h-4 rounded-full bg-purple-500/50" />
               </div>
            </div>

            {/* Photo 1 Placeholder */}
            <div className="md:col-span-1 md:row-span-2 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden group">
               <div className="w-full h-full flex items-center justify-center text-xs font-mono text-gray-500 absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]">
                 [ {data.photos[0]} ]
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Books Card */}
            <div className="md:col-span-1 md:row-span-1 rounded-[2rem] bg-white/5 border border-white/10 p-8 flex flex-col justify-end group transition-colors hover:bg-white/10 hover:border-blue-500/30">
               <p className="text-xs font-bold tracking-widest text-blue-400 mb-3 uppercase">{data.books.title}</p>
               <h3 className="text-2xl font-bold text-white leading-tight">{data.books.current}</h3>
            </div>

            {/* Location Card */}
            <div className="md:col-span-1 md:row-span-1 rounded-[2rem] bg-white/5 border border-white/10 p-8 flex flex-col justify-end group transition-colors hover:bg-white/10">
               <span className="text-4xl mb-4 block filter grayscale group-hover:grayscale-0 transition-all duration-500">🌍</span>
               <h3 className="text-xl font-bold text-white">{data.location.city}</h3>
               <p className="text-sm text-gray-500 font-mono mt-2">{data.location.coordinates}</p>
            </div>

            {/* Photo 2 Placeholder */}
            <div className="md:col-span-1 md:row-span-1 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden group">
               <div className="w-full h-full flex items-center justify-center text-xs font-mono text-gray-500 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]">
                 [ {data.photos[1]} ]
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

        </div>
    </section>
  );
}
