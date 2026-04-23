'use client';

import FormField from '@/components/dashboard/FormField';

export default function GlobalEditor({
  data,
  onChange,
}: {
  data: any;
  onChange: (data: any) => void;
}) {
  const ucConfig = data?.underConstructionConfig || {};

  const handleUcChange = (key: string, value: string) => {
    onChange({
      ...data,
      underConstructionConfig: {
        ...ucConfig,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Under Construction Placard</h3>
        <p className="text-sm font-mono text-gray-500 mb-6">Configure the placeholder UI shown when a section is set to Under Construction.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Heading"
            value={ucConfig.heading || ''}
            onChange={(v) => handleUcChange('heading', v)}
            placeholder="We're currently building this page"
          />
          <FormField
            label="ETA Text"
            value={ucConfig.eta || ''}
            onChange={(v) => handleUcChange('eta', v)}
            placeholder="ETA: SOON"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Status Label"
            value={ucConfig.statusLabel || ''}
            onChange={(v) => handleUcChange('statusLabel', v)}
            placeholder="IN PROGRESS"
          />
          <FormField
            label="CTA Button Label"
            value={ucConfig.ctaLabel || ''}
            onChange={(v) => handleUcChange('ctaLabel', v)}
            placeholder="Return Home"
          />
        </div>

        <div className="mt-4">
          <FormField
            label="Subtext"
            type="textarea"
            rows={2}
            value={ucConfig.subtext || ''}
            onChange={(v) => handleUcChange('subtext', v)}
            placeholder="Awesome things take time. Check back soon for updates."
          />
        </div>
      </div>
    </div>
  );
}
