import { cn } from '@/utils/cn';

const projects = [
  {
    title: 'E-commerce Evolution',
    description: 'A headless e-commerce store focusing on micro-interactions and seamless checkout experience.',
    tags: ['Next.js', 'Tailwind', 'Stripe'],
  },
  {
    title: 'Agency Relaunch',
    description: 'Premium Awwwards-winning studio portfolio with WebGL and advanced layout animations.',
    tags: ['Canvas', 'React', 'Framer Motion'],
  },
  {
    title: 'Fintech Dashboard',
    description: 'Data-rich user interface designed with a luxurious dark mode aesthetic and fluid layouts.',
    tags: ['TypeScript', 'D3.js', 'Tailwind'],
  },
  {
    title: 'Web3 Platform',
    description: 'Decentralized application with immersive 3D elements and interactive scrollytelling.',
    tags: ['Three.js', 'Next.js', 'Ethereum'],
  },
];

export default function Projects({ className }: { className?: string }) {
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
      </div>
    </section>
  );
}
