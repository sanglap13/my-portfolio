import type { Metadata } from "next";
import CommunityFull from '@/components/Community';
import CommunityHero from '@/components/CommunityHero';
import UnderConstruction from '@/components/UnderConstruction';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { syncConfig } from '@/services/configService';
import { getServerConfig } from '@/lib/server/config';

export default async function CommunityPage() {
  await syncConfig();
  const config = await getServerConfig();

  if (config.global?.underConstruction?.community) {
    return (
      <main className="bg-[#121212] min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 px-6">
          <UnderConstruction 
            title="Community & Events" 
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
      <CommunityHero sequence={config.sequences?.community || { baseUrl: '', frameCount: 181, framePattern: '' }} />
      <CommunityFull data={config.community} globalConfig={config.global} />
      <Footer data={{ ...config.footer, about: config.about }} />
    </main>
  );
}
