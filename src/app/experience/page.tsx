import type { Metadata } from "next";
import Experience from '@/components/Experience';
import ExperienceHero from '@/components/ExperienceHero';
import UnderConstruction from '@/components/UnderConstruction';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { syncConfig } from '@/services/configService';
import { getServerConfig } from '@/lib/server/config';

export default async function ExperiencePage() {
  await syncConfig();
  const config = await getServerConfig();

  if (config.global?.underConstruction?.experience) {
    return (
      <main className="bg-[#121212] min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 px-6">
          <UnderConstruction 
            title={config.experience.sectionTitle || 'Experience'} 
            config={config.global.underConstructionConfig} 
            variant="page"
          />
        </div>
        <Footer data={{ ...config.footer, about: config.about }} />
      </main>
    );
  }

  return (
    <main className="bg-[#121212]">
      <Navbar />
      <ExperienceHero 
        title={config.experience.sectionTitle} 
        subtitle={config.experience.sectionSubtitle} 
        sequence={config.sequences?.experience || { baseUrl: '', frameCount: 192, framePattern: '' }}
      />
      <Experience data={config.experience} globalConfig={config.global} />
      <Footer data={{ ...config.footer, about: config.about }} />
    </main>
  );
}
