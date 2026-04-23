import { syncConfig } from '@/services/configService';
import ProjectsContent from '@/components/ProjectsContent';
import UnderConstruction from '@/components/UnderConstruction';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getServerConfig } from '@/lib/server/config';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Sanglap Mridha",
  description: "A showcase of my recent software development projects and contributions.",
};

export default async function ProjectsPage() {
  // Sync config from MongoDB to codebase
  await syncConfig();
  const config = await getServerConfig();
  
  const pc = config.projects.pageConfig;

  if (config.global?.underConstruction?.projects) {
    return (
      <main className="bg-theme-bg min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 px-6">
          <UnderConstruction 
            title={config.projects.title || 'Projects'} 
            config={config.global.underConstructionConfig} 
            variant="page"
          />
        </div>
        <Footer data={{ ...config.footer, about: config.about }} />
      </main>
    );
  }
  
  return (
    <>
      <Navbar />
      <ProjectsContent pc={pc} />
      <Footer data={{ ...config.footer, about: config.about }} />
    </>
  );
}
