'use client';

import FormField from '@/components/dashboard/FormField';
import ArrayField from '@/components/dashboard/ArrayField';

interface ExperienceData {
  sectionTitle: string;
  sectionSubtitle: string;
  timeline: any[];
  works: any[];
}

export default function ExperienceEditor({
  data,
  onChange,
}: {
  data: ExperienceData;
  onChange: (data: ExperienceData) => void;
}) {
  return (
    <div className="space-y-8">
      <FormField
        label="Section Title"
        value={data.sectionTitle || ''}
        onChange={(v) => onChange({ ...data, sectionTitle: v })}
      />
      <FormField
        label="Section Subtitle"
        value={data.sectionSubtitle || ''}
        onChange={(v) => onChange({ ...data, sectionSubtitle: v })}
      />

      {/* Timeline */}
      <ArrayField
        label="Timeline"
        items={data.timeline || []}
        onChange={(items) => onChange({ ...data, timeline: items })}
        createItem={() => ({ company: '', mode: '', location: '', roles: [], techStack: [] })}
        addLabel="Add Timeline Entry"
        renderItem={(item, _i, onItemChange) => (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Company" value={item.company || ''} onChange={(v) => onItemChange({ ...item, company: v })} placeholder="Company Name" />
              <FormField label="Mode" value={item.mode || ''} onChange={(v) => onItemChange({ ...item, mode: v })} placeholder="Remote / Hybrid" />
              <FormField label="Location" value={item.location || ''} onChange={(v) => onItemChange({ ...item, location: v })} placeholder="City, Country" />
            </div>
            
            <div className="pl-4 border-l border-white/10 space-y-3">
              <h4 className="text-sm font-semibold text-white/80 mb-2">Roles</h4>
              <ArrayField
                label=""
                items={item.roles || []}
                onChange={(roles) => onItemChange({ ...item, roles })}
                createItem={() => ({ title: '', current: false, startDate: '', endDate: '' })}
                addLabel="Add Role"
                renderItem={(role, _j, onRoleChange) => (
                  <div className="space-y-3 bg-white/5 p-4 rounded-xl">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Title" value={role.title || ''} onChange={(v) => onRoleChange({ ...role, title: v })} placeholder="Software Engineer" />
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Current Role?</label>
                        <button
                          type="button"
                          onClick={() => onRoleChange({ ...role, current: !role.current })}
                          className={`px-4 py-2 rounded-lg text-sm font-mono border ${role.current ? 'bg-theme-indigo/20 border-theme-indigo text-theme-indigo' : 'bg-white/5 border-white/10 text-gray-400'}`}
                        >
                          {role.current ? 'Yes' : 'No'}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Start Date" value={role.startDate || ''} onChange={(v) => onRoleChange({ ...role, startDate: v })} placeholder="Jan 2024" />
                      <FormField label="End Date" value={role.endDate || ''} onChange={(v) => onRoleChange({ ...role, endDate: v })} placeholder="Present" />
                    </div>
                  </div>
                )}
              />
            </div>

            <FormField
              label="Tech Stack (comma-separated)"
              value={(item.techStack || []).join(', ')}
              onChange={(v) => onItemChange({ ...item, techStack: v.split(',').map((s: string) => s.trim()).filter(Boolean) })}
              placeholder="React, Node.js, MongoDB"
            />
          </div>
        )}
      />

      {/* Works */}
      <ArrayField
        label="Works"
        items={data.works || []}
        onChange={(items) => onChange({ ...data, works: items })}
        createItem={() => ({ category: '', title: '', description: '', tags: [] })}
        addLabel="Add Work Entry"
        renderItem={(item, _i, onItemChange) => (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Category" value={item.category || ''} onChange={(v) => onItemChange({ ...item, category: v })} placeholder="Frontend / Backend" />
              <FormField label="Title" value={item.title || ''} onChange={(v) => onItemChange({ ...item, title: v })} placeholder="Project Name" />
            </div>
            <FormField label="Description" type="textarea" rows={3} value={item.description || ''} onChange={(v) => onItemChange({ ...item, description: v })} />
            <FormField
              label="Tags (comma-separated)"
              value={(item.tags || []).join(', ')}
              onChange={(v) => onItemChange({ ...item, tags: v.split(',').map((s: string) => s.trim()).filter(Boolean) })}
              placeholder="Next.js, Tailwind, Vercel"
            />
          </div>
        )}
      />
    </div>
  );
}
