'use client';

import FormField from '@/components/dashboard/FormField';

interface SequenceItem {
  baseUrl: string;
  frameCount: number;
  framePattern: string;
}

interface SequencesData {
  hero: SequenceItem;
  experience: SequenceItem;
  community: SequenceItem;
  informal: SequenceItem;
}

const SEQUENCE_LABELS: Record<string, { title: string; description: string }> = {
  hero: {
    title: 'Hero (Home Page)',
    description: 'The scroll-driven animation on the landing page.',
  },
  experience: {
    title: 'Experience Page',
    description: 'Auto-playing background animation on the experience hero.',
  },
  community: {
    title: 'Community Page',
    description: 'Auto-playing background animation on the community hero.',
  },
  informal: {
    title: 'Beyond the Code Page',
    description: 'Auto-playing background animation on the informal hero.',
  },
};

const DEFAULT_SEQUENCE: SequenceItem = {
  baseUrl: '',
  frameCount: 0,
  framePattern: 'frame_{index}_delay-0.041s.webp',
};

export default function SequencesEditor({
  data,
  onChange,
}: {
  data: SequencesData;
  onChange: (data: SequencesData) => void;
}) {
  const updateSequence = (key: string, field: keyof SequenceItem, value: string | number) => {
    const current = data[key as keyof SequencesData] || { ...DEFAULT_SEQUENCE };
    onChange({
      ...data,
      [key]: {
        ...current,
        [field]: field === 'frameCount' ? Number(value) || 0 : value,
      },
    });
  };

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <p className="text-xs font-mono text-gray-500">
          Configure the Cloudinary-hosted image sequences used for canvas animations across your portfolio pages.
        </p>
      </div>

      {Object.entries(SEQUENCE_LABELS).map(([key, meta]) => {
        const seq = data[key as keyof SequencesData] || { ...DEFAULT_SEQUENCE };

        return (
          <div key={key} className="space-y-5">
            {/* Section header */}
            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <span className="text-amber-400 text-xs font-bold">
                  {key.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{meta.title}</h3>
                <p className="text-[10px] font-mono text-gray-600">{meta.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FormField
                  label="Base URL"
                  value={seq.baseUrl || ''}
                  onChange={(v) => updateSequence(key, 'baseUrl', v)}
                  type="url"
                  placeholder="https://res.cloudinary.com/.../sequence/"
                  hint="The Cloudinary folder URL where frames are stored. Must end with /"
                />
              </div>

              <FormField
                label="Frame Count"
                value={seq.frameCount || 0}
                onChange={(v) => updateSequence(key, 'frameCount', v)}
                type="number"
                placeholder="110"
                hint="Total number of frames (0-indexed)"
              />

              <FormField
                label="Frame Pattern"
                value={seq.framePattern || ''}
                onChange={(v) => updateSequence(key, 'framePattern', v)}
                placeholder="frame_{index}_delay-0.066s.webp"
                hint="Use {index} as the 3-digit padded frame number"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
