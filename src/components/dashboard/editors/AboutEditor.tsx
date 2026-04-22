'use client';

import FormField from '@/components/dashboard/FormField';
import ArrayField from '@/components/dashboard/ArrayField';

interface AboutData {
  title: string;
  description: string;
  skills: string[];
  qualifications: { title: string; subtitle: string; year: string }[];
  socials: { name: string; url: string }[];
}

export default function AboutEditor({
  data,
  onChange,
}: {
  data: AboutData;
  onChange: (data: AboutData) => void;
}) {
  return (
    <div className="space-y-8">
      <FormField
        label="Title"
        value={data.title || ''}
        onChange={(v) => onChange({ ...data, title: v })}
        placeholder="Your headline"
      />

      <FormField
        label="Description"
        type="textarea"
        rows={5}
        value={data.description || ''}
        onChange={(v) => onChange({ ...data, description: v })}
        placeholder="Your bio..."
      />

      {/* Skills */}
      <div className="space-y-3">
        <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block">
          Skills ({data.skills?.length || 0})
        </label>
        <div className="flex flex-wrap gap-2">
          {(data.skills || []).map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono px-3 py-1.5 rounded-full"
            >
              {skill}
              <button
                onClick={() =>
                  onChange({ ...data, skills: data.skills.filter((_, idx) => idx !== i) })
                }
                className="text-amber-400/50 hover:text-red-400 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a skill..."
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/40 transition-all font-mono"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                const val = (e.target as HTMLInputElement).value.trim();
                onChange({ ...data, skills: [...(data.skills || []), val] });
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
        </div>
      </div>

      {/* Qualifications */}
      <ArrayField
        label="Qualifications"
        items={data.qualifications || []}
        onChange={(items) => onChange({ ...data, qualifications: items })}
        createItem={() => ({ title: '', subtitle: '', year: '' })}
        addLabel="Add Qualification"
        renderItem={(item, _i, onItemChange) => (
          <div className="space-y-3">
            <FormField label="Title" value={item.title} onChange={(v) => onItemChange({ ...item, title: v })} placeholder="Degree / Certification" />
            <FormField label="Subtitle" value={item.subtitle} onChange={(v) => onItemChange({ ...item, subtitle: v })} placeholder="Institution" />
            <FormField label="Year" value={item.year} onChange={(v) => onItemChange({ ...item, year: v })} placeholder="2020 - 2024" />
          </div>
        )}
      />

      {/* Socials */}
      <ArrayField
        label="Socials"
        items={data.socials || []}
        onChange={(items) => onChange({ ...data, socials: items })}
        createItem={() => ({ name: '', url: '' })}
        addLabel="Add Social"
        renderItem={(item, _i, onItemChange) => (
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Name" value={item.name} onChange={(v) => onItemChange({ ...item, name: v })} placeholder="GitHub" />
            <FormField label="URL" type="url" value={item.url} onChange={(v) => onItemChange({ ...item, url: v })} placeholder="https://..." />
          </div>
        )}
      />
    </div>
  );
}
