import type { Metadata } from "next";
import CommunityFull from '@/components/Community';
import CommunityHero from '@/components/CommunityHero';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import config from '@/data/config.json';

export const metadata: Metadata = {
  title: "Community & Speaking | Sanglap Mridha",
  description: "A summary of my community activities, tech talks, hackathon judging, and mentoring engagements.",
};

export default function CommunityPage() {
  return (
    <main className="bg-[#121212]">
      <Navbar />
      <CommunityHero />
      <CommunityFull data={config.community} />
      <Footer />
    </main>
  );
}
