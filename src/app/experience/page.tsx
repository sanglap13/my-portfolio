import type { Metadata } from "next";
import Experience from '@/components/Experience';
import ExperienceHero from '@/components/ExperienceHero';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { syncConfig } from '@/services/configService';
import { getServerConfig } from '@/lib/server/config';

export default async function ExperiencePage() {
  await syncConfig();
  const config = getServerConfig();

  return (
    <main className="bg-[#121212]">
      <Navbar />
      <ExperienceHero 
        title={config.experience.sectionTitle} 
        subtitle={config.experience.sectionSubtitle} 
        sequence={config.sequences?.experience || { baseUrl: '', frameCount: 192, framePattern: '' }}
      />
      <Experience data={config.experience} />
      <Footer data={{ ...config.footer, about: config.about }} />
    </main>
  );
}
