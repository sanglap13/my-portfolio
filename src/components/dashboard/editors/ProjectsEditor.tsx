'use client';

import FormField from '@/components/dashboard/FormField';
import ArrayField from '@/components/dashboard/ArrayField';
import MediaUploader from '@/components/dashboard/MediaUploader';

interface ProjectsData {
  underConstruction: boolean;
  title: string;
  underConstructionConfig: any;
  pageConfig: any;
  items: any[];
}

export default function ProjectsEditor({
  data,
  onChange,
}: {
  data: ProjectsData;
  onChange: (data: ProjectsData) => void;
}) {
  return (
    <div className="space-y-8">
      <FormField
        label="Section Title"
        value={data.title || ''}
        onChange={(v) => onChange({ ...data, title: v })}
      />

      {/* Under Construction Toggle */}
      <div className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
        <div>
          <p className="text-sm font-bold text-white">Under Construction</p>
          <p className="text-[10px] font-mono text-gray-500">Show construction placard instead of projects</p>
        </div>
        <button
          onClick={() => onChange({ ...data, underConstruction: !data.underConstruction })}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            data.underConstruction ? 'bg-amber-500' : 'bg-white/10'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
              data.underConstruction ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Projects */}
      <ArrayField
        label="Project Items"
        items={data.items || []}
        onChange={(items) => onChange({ ...data, items: items })}
        createItem={() => ({
          title: '',
          description: '',
          image: '',
          tags: [],
          github: '',
          live: '',
        })}
        addLabel="Add Project"
        renderItem={(item, _i, onItemChange) => (
          <div className="space-y-3">
            <FormField label="Title" value={item.title || ''} onChange={(v) => onItemChange({ ...item, title: v })} />
            <FormField label="Description" type="textarea" rows={2} value={item.description || ''} onChange={(v) => onItemChange({ ...item, description: v })} />
            <MediaUploader
              label="Project Image"
              value={item.image || ''}
              onChange={(v) => onItemChange({ ...item, image: v })}
              folder="projects"
            />
            <FormField
              label="Tags (comma-separated)"
              value={(item.tags || []).join(', ')}
              onChange={(v) => onItemChange({ ...item, tags: v.split(',').map((s: string) => s.trim()).filter(Boolean) })}
              placeholder="React, Next.js, TypeScript"
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField label="GitHub URL" type="url" value={item.github || ''} onChange={(v) => onItemChange({ ...item, github: v })} />
              <FormField label="Live URL" type="url" value={item.live || ''} onChange={(v) => onItemChange({ ...item, live: v })} />
            </div>
          </div>
        )}
      />
    </div>
  );
}
