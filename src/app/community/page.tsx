import type { Metadata } from "next";
import Community from '@/components/Community';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import config from '@/data/config.json';

export const metadata: Metadata = {
  title: "Community & Speaking | Sanglap Mridha",
  description: "A summary of my community activities, tech talks, and open-source engagements.",
};

export default function CommunityPage() {
  return (
    <main className="bg-[#121212] min-h-screen relative flex flex-col">
      <Navbar />
      <div className="flex-grow">
        {/* Community component takes up full viewport height explicitly because of sticky scroll */}
        <Community data={config.community} className="min-h-screen" />
      </div>
      <Footer />
    </main>
  );
}
