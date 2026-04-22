'use client';

import FormField from '@/components/dashboard/FormField';

interface FooterData {
  text: string;
}

export default function FooterEditor({
  data,
  onChange,
}: {
  data: FooterData;
  onChange: (data: FooterData) => void;
}) {
  return (
    <div className="space-y-6">
      <FormField
        label="Footer Text"
        value={data.text || ''}
        onChange={(v) => onChange({ ...data, text: v })}
        placeholder="Your Name. All rights reserved."
      />
    </div>
  );
}
