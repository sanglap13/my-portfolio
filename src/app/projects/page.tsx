import { syncConfig } from '@/services/configService';
import ProjectsContent from '@/components/ProjectsContent';
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
  
  return (
    <>
      <ProjectsContent pc={pc} />
      <Footer data={{ ...config.footer, about: config.about }} />
    </>
  );
}
