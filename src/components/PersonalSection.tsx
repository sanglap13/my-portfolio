import Link from 'next/link';

type AboutData = typeof import('@/data/config.json').about;

export default function PersonalSection({ data }: { data: AboutData }) {
  if (!data) return null;

  return (
    <section className="relative z-20 w-full bg-[#121212] pt-32 pb-24 px-8 md:px-24 border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] rounded-t-[3rem] -mt-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">
        
        {/* Left Column: Bio & Qualifications */}
        <div className="flex-1">
          <h2 className="text-sm font-bold tracking-widest text-purple-400 mb-4 uppercase">About Me</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-8 leading-snug">
            {data.title}
          </h3>
          <p className="text-xl text-gray-400 leading-relaxed mb-10">
            {data.description}
          </p>

          <div className="flex flex-wrap gap-4">
            {data.socials?.map((social, idx) => (
              <a 
                key={idx} 
                href={social.url} 
                target="_blank" 
                rel="noreferrer"
                className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>

        {/* Right Column: Skills */}
        <div className="md:w-1/3 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-white mb-6">Technical Arsenal</h3>
          <div className="flex flex-wrap gap-3">
            {data.skills?.map((skill, idx) => (
              <span 
                key={idx} 
                className="px-4 py-2 bg-[#1a1a1a] border border-white/10 shadow-inner shadow-white/5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:border-blue-500/50 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
