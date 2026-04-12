import ScrollyCanvas from '@/components/ScrollyCanvas';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Community from '@/components/Community';
import Informal from '@/components/Informal';
import Navbar from '@/components/Navbar';
import Contact from '@/components/Contact';
import PersonalSection from '@/components/PersonalSection';
import Footer from '@/components/Footer';
import config from '@/data/config.json';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-transparent min-h-screen relative">
      <Navbar />
      <ScrollyCanvas overlay={config.overlay} />
      
      <PersonalSection data={config.about} />

      {/* Smooth transition into other preview sections */}
      <div className="relative z-20 w-full bg-transparent">
        <Experience data={config.experience.slice(0, 2)} previewHref="/experience" />
        {/* <Projects projects={config.projects.slice(0, 2)} previewHref="/projects" /> */}
        <Community 
          data={[...config.community].sort((a, b) => (b.priority || 0) - (a.priority || 0)).slice(0, 5)} 
          previewHref="/community" 
        />
        <Projects />
        <Informal data={config.informal} previewHref="/informal" />
        
        <Contact />

        <Footer />
      </div>
    </main>
  );
}
