import ScrollyCanvas from '@/components/ScrollyCanvas';
import Projects from '@/components/Projects';
import ExperiencePreview from '@/components/ExperiencePreview';
import CommunityPreview from '@/components/CommunityPreview';
import InformalPreview from '@/components/InformalPreview';
import Navbar from '@/components/Navbar';
import Contact from '@/components/Contact';
import PersonalSection from '@/components/PersonalSection';
import Footer from '@/components/Footer';
import { syncConfig } from '@/services/configService';
import { getServerConfig } from '@/lib/server/config';

export default async function Home() {
  await syncConfig();
  const config = await getServerConfig();
  
  return (
    <main className="bg-transparent min-h-screen relative">
      <Navbar />
      <ScrollyCanvas overlay={config.overlay} sequence={config.sequences?.hero || { baseUrl: '', frameCount: 110, framePattern: '' }} />
      
      <PersonalSection data={config.about} />

      {/* Smooth transition into other preview sections */}
      <div className="relative z-20 w-full bg-transparent">
        <ExperiencePreview data={config.experience} />
        <CommunityPreview 
          data={[...config.community].sort((a, b) => (b.priority || 0) - (a.priority || 0)).slice(0, 5)} 
        />
        <Projects data={config.projects} />
        <InformalPreview data={config.informal} />
        
        <Contact />

        <Footer data={{ ...config.footer, about: config.about }} />
      </div>
    </main>
  );
}
