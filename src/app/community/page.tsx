import type { Metadata } from "next";
import CommunityFull from '@/components/Community';
import CommunityHero from '@/components/CommunityHero';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { syncConfig } from '@/services/configService';
import { getServerConfig } from '@/lib/server/config';

export default async function CommunityPage() {
  await syncConfig();
  const config = getServerConfig();

  return (
    <main className="bg-[#121212]">
      <Navbar />
      <CommunityHero sequence={config.sequences?.community || { baseUrl: '', frameCount: 181, framePattern: '' }} />
      <CommunityFull data={config.community} />
      <Footer data={{ ...config.footer, about: config.about }} />
    </main>
  );
}
