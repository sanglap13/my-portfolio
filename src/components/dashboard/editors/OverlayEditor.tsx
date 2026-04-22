'use client';

import FormField from '@/components/dashboard/FormField';

interface OverlayData {
  section1: { title: string; subtitle: string };
  section2: { line1: string; line2: string };
  section3: { line1: string; line2: string };
}

export default function OverlayEditor({
  data,
  onChange,
}: {
  data: OverlayData;
  onChange: (data: OverlayData) => void;
}) {
  const update = (section: keyof OverlayData, field: string, value: string) => {
    onChange({
      ...data,
      [section]: { ...data[section], [field]: value },
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-2">Section 1 — Name Card</h3>
        <FormField label="Title" value={data.section1?.title || ''} onChange={(v) => update('section1', 'title', v)} placeholder="Your Name" />
        <FormField label="Subtitle" value={data.section1?.subtitle || ''} onChange={(v) => update('section1', 'subtitle', v)} placeholder="Your Title" />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-2">Section 2 — Tagline</h3>
        <FormField label="Line 1" value={data.section2?.line1 || ''} onChange={(v) => update('section2', 'line1', v)} />
        <FormField label="Line 2" value={data.section2?.line2 || ''} onChange={(v) => update('section2', 'line2', v)} />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-2">Section 3 — Statement</h3>
        <FormField label="Line 1" value={data.section3?.line1 || ''} onChange={(v) => update('section3', 'line1', v)} />
        <FormField label="Line 2" value={data.section3?.line2 || ''} onChange={(v) => update('section3', 'line2', v)} />
      </div>
    </div>
  );
}
