import type { Metadata } from "next";
import Experience from '@/components/Experience';
import Navbar from '@/components/Navbar';
import config from '@/data/config.json';

export const metadata: Metadata = {
  title: "Work Experience | Sanglap Mridha",
  description: "Detailed information about my work experience and professional journey.",
};

export default function ExperiencePage() {
  return (
    <main className="bg-[#121212] min-h-screen relative flex flex-col pt-8 pb-32">
      <Navbar />
      <div className="flex-grow">
        <Experience data={config.experience} className="pt-12" />
      </div>
      <footer className="py-12 text-center text-gray-500 border-t border-white/5 mt-auto relative z-20">
        <p>© {new Date().getFullYear()} {config.footer.text}</p>
      </footer>
    </main>
  );
}
