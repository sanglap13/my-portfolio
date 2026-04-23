import type { Metadata } from "next";
import Informal from '@/components/Informal';
import InformalHero from '@/components/InformalHero';
import UnderConstruction from '@/components/UnderConstruction';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { syncConfig } from '@/services/configService';
import { getServerConfig } from '@/lib/server/config';

export default async function InformalPage() {
  await syncConfig();
  const config = await getServerConfig();

  if (config.global?.underConstruction?.informal) {
    return (
      <main className="bg-[#121212] min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 px-6">
          <UnderConstruction 
            title={config.informal.title || "Beyond the Code"} 
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
      <InformalHero sequence={config.sequences?.informal || { baseUrl: '', frameCount: 171, framePattern: '' }} />
      <Informal data={config.informal} globalConfig={config.global} />
      <Footer data={{ ...config.footer, about: config.about }} />
    </main>
  );
}
