import type { Metadata } from "next";
import Experience from '@/components/Experience';
import ExperienceHero from '@/components/ExperienceHero';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import config from '@/data/config.json';

export const metadata: Metadata = {
  title: "Work Experience | Sanglap Mridha",
  description: "Detailed information about my work experience and professional journey.",
};

export default function ExperiencePage() {
  return (
    <main className="bg-[#121212]">
      <Navbar />
      <ExperienceHero 
        title={config.experience.sectionTitle} 
        subtitle={config.experience.sectionSubtitle} 
      />
      <Experience data={config.experience} />
      <Footer />
    </main>
  );
}
