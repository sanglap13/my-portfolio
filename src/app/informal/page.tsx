import type { Metadata } from "next";
import Informal from '@/components/Informal';
import InformalHero from '@/components/InformalHero';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { syncConfig } from '@/services/configService';
import { getServerConfig } from '@/lib/server/config';

export default async function InformalPage() {
  await syncConfig();
  const config = getServerConfig();

  return (
    <main className="bg-[#121212]">
      <Navbar />
      <InformalHero />
      <Informal data={config.informal} />
      <Footer data={{ ...config.footer, about: config.about }} />
    </main>
  );
}
