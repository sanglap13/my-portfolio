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
import GlobalEditor from '@/components/dashboard/editors/GlobalEditor';
import FooterEditor from '@/components/dashboard/editors/FooterEditor';
import SequencesEditor from '@/components/dashboard/editors/SequencesEditor';

const editorMap: Record<string, React.ComponentType<any>> = {
  global: GlobalEditor,
  overlay: OverlayEditor,
  about: AboutEditor,
  experience: ExperienceEditor,
  projects: ProjectsEditor,
  community: CommunityEditor,
  informal: InformalEditor,
  sequences: SequencesEditor,
  footer: FooterEditor,
};

const sectionLabels: Record<string, string> = {
  global: 'Global Settings',
  overlay: 'Overlay',
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  community: 'Community',
  informal: 'Beyond the Code',
  sequences: 'Sequences',
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
      const payload: any = { [section]: sectionData };
      // Include global config if this section uses the underConstruction toggle
      if (['experience', 'projects', 'community', 'informal'].includes(section) && config?.global) {
        payload.global = config.global;
      }

      const res = await fetch('/api/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
  const supportsUnderConstruction = !['global', 'sequences', 'footer'].includes(section);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {sectionLabels[section] || section}
          </h1>
          <p className="text-xs font-mono text-gray-500 mt-1">
            Edit and save to update your portfolio
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {supportsUnderConstruction && config && (
            <button
              onClick={() => {
                const global = config.global || { underConstruction: {} };
                const uc = global.underConstruction || {};
                setConfig({
                  ...config,
                  global: {
                    ...global,
                    underConstruction: {
                      ...uc,
                      [section]: !uc[section]
                    }
                  }
                });
              }}
              className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-full px-4 py-2 hover:bg-white/[0.05] transition-colors"
            >
              <span className="text-xs font-mono text-gray-400 font-medium">Under Construction</span>
              <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${(config.global?.underConstruction?.[section]) ? 'bg-amber-500' : 'bg-white/20'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${(config.global?.underConstruction?.[section]) ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>
          )}
          <SaveButton onClick={handleSave} status={saveStatus} />
        </div>
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
