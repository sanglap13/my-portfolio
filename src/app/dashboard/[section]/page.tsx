'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SaveButton from '@/components/dashboard/SaveButton';
import OverlayEditor from '@/components/dashboard/editors/OverlayEditor';
import AboutEditor from '@/components/dashboard/editors/AboutEditor';
import ExperienceEditor from '@/components/dashboard/editors/ExperienceEditor';
import ProjectsEditor from '@/components/dashboard/editors/ProjectsEditor';
import CommunityEditor from '@/components/dashboard/editors/CommunityEditor';
import InformalEditor from '@/components/dashboard/editors/InformalEditor';
import FooterEditor from '@/components/dashboard/editors/FooterEditor';

const editorMap: Record<string, React.ComponentType<any>> = {
  overlay: OverlayEditor,
  about: AboutEditor,
  experience: ExperienceEditor,
  projects: ProjectsEditor,
  community: CommunityEditor,
  informal: InformalEditor,
  footer: FooterEditor,
};

const sectionLabels: Record<string, string> = {
  overlay: 'Overlay',
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  community: 'Community',
  informal: 'Beyond the Code',
  footer: 'Footer',
};

export default function SectionEditorPage() {
  const params = useParams();
  const section = params.section as string;

  const [config, setConfig] = useState<any>(null);
  const [sectionData, setSectionData] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((data) => {
        setConfig(data);
        setSectionData(data[section] || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [section]);

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [section]: sectionData }),
      });

      if (!res.ok) throw new Error('Save failed');

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const EditorComponent = editorMap[section];

  if (!EditorComponent) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-4xl mb-4">🚧</p>
        <h1 className="text-xl font-bold text-white mb-2">Section Not Found</h1>
        <p className="text-sm font-mono text-gray-500">
          &quot;{section}&quot; is not a valid editor section.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-sm font-mono text-gray-500 animate-pulse">Loading config...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {sectionLabels[section] || section}
          </h1>
          <p className="text-xs font-mono text-gray-500 mt-1">
            Edit and save to update your portfolio
          </p>
        </div>
        <SaveButton onClick={handleSave} status={saveStatus} />
      </div>

      {/* Editor */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8">
        <EditorComponent data={sectionData} onChange={setSectionData} />
      </div>

      {/* Bottom save */}
      <div className="flex justify-end">
        <SaveButton onClick={handleSave} status={saveStatus} />
      </div>
    </div>
  );
}
