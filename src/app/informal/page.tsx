import type { Metadata } from "next";
import Informal from '@/components/Informal';
import InformalHero from '@/components/InformalHero';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import config from '@/data/config.json';

export const metadata: Metadata = {
  title: "Beyond Code | Sanglap Mridha",
  description: "Informal interests including music, books, photography and other hobbies beyond software development.",
};

export default function InformalPage() {
  return (
    <main className="bg-[#121212]">
      <Navbar />
      <InformalHero />
      <Informal data={config.informal} />
      <Footer />
    </main>
  );
}
