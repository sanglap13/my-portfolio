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
        createItem={() => ({ year: '', title: '', company: '', description: '', techStack: [] })}
        addLabel="Add Timeline Entry"
        renderItem={(item, _i, onItemChange) => (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Year" value={item.year || ''} onChange={(v) => onItemChange({ ...item, year: v })} placeholder="2024" />
              <FormField label="Title" value={item.title || ''} onChange={(v) => onItemChange({ ...item, title: v })} placeholder="Role" />
              <FormField label="Company" value={item.company || ''} onChange={(v) => onItemChange({ ...item, company: v })} placeholder="Company" />
            </div>
            <FormField label="Description" type="textarea" rows={2} value={item.description || ''} onChange={(v) => onItemChange({ ...item, description: v })} />
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
        createItem={() => ({ title: '', company: '', period: '', description: '', highlights: [] })}
        addLabel="Add Work Entry"
        renderItem={(item, _i, onItemChange) => (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Title" value={item.title || ''} onChange={(v) => onItemChange({ ...item, title: v })} placeholder="Software Engineer" />
              <FormField label="Company" value={item.company || ''} onChange={(v) => onItemChange({ ...item, company: v })} placeholder="Company Name" />
            </div>
            <FormField label="Period" value={item.period || ''} onChange={(v) => onItemChange({ ...item, period: v })} placeholder="Jan 2024 - Present" />
            <FormField label="Description" type="textarea" rows={3} value={item.description || ''} onChange={(v) => onItemChange({ ...item, description: v })} />
            <FormField
              label="Highlights (comma-separated)"
              type="textarea"
              rows={2}
              value={(item.highlights || []).join('\n')}
              onChange={(v) => onItemChange({ ...item, highlights: v.split('\n').filter(Boolean) })}
              hint="One highlight per line"
            />
          </div>
        )}
      />
    </div>
  );
}
