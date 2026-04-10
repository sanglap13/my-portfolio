import type { Metadata } from "next";
import Community from '@/components/Community';
import Navbar from '@/components/Navbar';
import config from '@/data/config.json';

export const metadata: Metadata = {
  title: "Community & Speaking | Sanglap Mridha",
  description: "A summary of my community activities, tech talks, and open-source engagements.",
};

export default function CommunityPage() {
  return (
    <main className="bg-[#121212] min-h-screen relative flex flex-col pb-32">
      <Navbar />
      <div className="flex-grow">
        {/* Community component takes up full viewport height explicitly because of sticky scroll */}
        <Community data={config.community} className="min-h-screen" />
      </div>
      <footer className="py-12 text-center text-gray-500 border-t border-white/5 mt-auto relative z-20 bg-[#121212]">
        <p>© {new Date().getFullYear()} {config.footer.text}</p>
      </footer>
    </main>
  );
}
