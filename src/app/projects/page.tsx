import type { Metadata } from "next";
import Projects from '@/components/Projects';
import Navbar from '@/components/Navbar';
import config from '@/data/config.json';

export const metadata: Metadata = {
  title: "Projects | Sanglap Mridha",
  description: "Explore my latest programming projects, web applications, and technical innovations.",
};

export default function ProjectsPage() {
  return (
    <main className="bg-[#121212] min-h-screen relative flex flex-col pt-8 pb-32">
      <Navbar />
      <div className="flex-grow">
        <Projects projects={config.projects} className="pt-12" />
      </div>
      <footer className="py-12 text-center text-gray-500 border-t border-white/5 mt-auto relative z-20">
        <p>© {new Date().getFullYear()} {config.footer.text}</p>
      </footer>
    </main>
  );
}
