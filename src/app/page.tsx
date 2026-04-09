import ScrollyCanvas from '@/components/ScrollyCanvas';
import Projects from '@/components/Projects';

export default function Home() {
  return (
    <main className="bg-[#121212] min-h-screen">
      <ScrollyCanvas />
      
      {/* 
        This div simply serves as a spacer or seamless transition base 
        We use it to anchor the bottom of the scrolly experience smoothly into the projects grid
      */}
      <div className="relative z-20 w-full rounded-t-[3rem] bg-[#121212] -mt-10 overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.5)] border-t border-white/5">
        <Projects className="pt-32" />
        
        <footer className="py-12 text-center text-gray-500 border-t border-white/5">
          <p>© {new Date().getFullYear()} My Name. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
