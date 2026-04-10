import type { Metadata } from "next";
import Informal from '@/components/Informal';
import Navbar from '@/components/Navbar';
import config from '@/data/config.json';

export const metadata: Metadata = {
  title: "Beyond Code | Sanglap Mridha",
  description: "Informal interests including music, books, photography and other hobbies beyond software development.",
};

export default function InformalPage() {
  return (
    <main className="bg-[#121212] min-h-screen relative flex flex-col pt-8 pb-32">
      <Navbar />
      <div className="flex-grow">
        <Informal data={config.informal} className="pt-24 min-h-screen flex flex-col justify-center" />
      </div>
      <footer className="py-12 text-center text-gray-500 border-t border-white/5 mt-auto relative z-20">
        <p>© {new Date().getFullYear()} {config.footer.text}</p>
      </footer>
    </main>
  );
}
