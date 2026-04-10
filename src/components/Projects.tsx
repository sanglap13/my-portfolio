import { cn } from '@/utils/cn';
import Link from 'next/link';

type Project = typeof import('@/data/config.json').projects[number];

export default function Projects({ className, projects, previewHref }: { className?: string; projects: Project[]; previewHref?: string }) {
  if (!projects || !Array.isArray(projects)) return null;
  
  return (
    <section className={cn("min-h-screen bg-[#121212] py-24 px-8 md:px-24", className)}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-16">Selected Work</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index}
              className={cn(
                "group relative p-8 md:p-12 rounded-3xl overflow-hidden cursor-pointer",
                "bg-white/[0.03] border border-white/10 backdrop-blur-xl transition-all duration-700 ease-out",
                "hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-1",
                "flex flex-col justify-between min-h-[350px]"
              )}
            >
              {/* Subtle background gradient / glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative z-10 flex-col flex-grow">
                <h3 className="text-3xl font-semibold text-white mb-4 tracking-tight">{project.title}</h3>
                <p className="text-gray-400 text-lg mb-8 max-w-md leading-relaxed pr-8">
                  {project.description}
                </p>
              </div>

              <div className="relative z-10 flex flex-wrap gap-3 mt-auto">
                {project.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-4 py-1.5 text-sm font-medium text-gray-300 bg-white/5 shadow-inner shadow-white/5 rounded-full border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {previewHref && (
          <div className="mt-16 flex justify-center">
            <Link href={previewHref} className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              View All Projects
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
