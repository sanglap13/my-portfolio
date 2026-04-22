'use client';

import FormField from '@/components/dashboard/FormField';
import ArrayField from '@/components/dashboard/ArrayField';
import MediaUploader from '@/components/dashboard/MediaUploader';

export default function CommunityEditor({
  data,
  onChange,
}: {
  data: any[];
  onChange: (data: any[]) => void;
}) {
  return (
    <div className="space-y-6">
      <ArrayField
        label="Community Events"
        items={data || []}
        onChange={onChange}
        createItem={() => ({
          title: '',
          description: '',
          image: [],
          priority: 1,
          city: '',
        })}
        addLabel="Add Event"
        renderItem={(item, _i, onItemChange) => (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Title" value={item.title || ''} onChange={(v) => onItemChange({ ...item, title: v })} placeholder="Event Name" />
              <FormField label="City" value={item.city || ''} onChange={(v) => onItemChange({ ...item, city: v })} placeholder="City" />
            </div>
            <FormField label="Description" type="textarea" rows={2} value={item.description || ''} onChange={(v) => onItemChange({ ...item, description: v })} />
            <FormField label="Priority" type="number" value={item.priority || 1} onChange={(v) => onItemChange({ ...item, priority: parseInt(v) || 1 })} hint="Higher = shown first" />

            {/* Images */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block">
                Images ({(item.image || []).length})
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(item.image || []).map((img: string, imgIdx: number) => (
                  <div key={imgIdx} className="relative group">
                    <MediaUploader
                      label={`Image ${imgIdx + 1}`}
                      value={img}
                      onChange={(v) => {
                        const newImages = [...(item.image || [])];
                        newImages[imgIdx] = v;
                        onItemChange({ ...item, image: newImages });
                      }}
                      folder="community"
                    />
                    <button
                      onClick={() => {
                        const newImages = (item.image || []).filter((_: any, idx: number) => idx !== imgIdx);
                        onItemChange({ ...item, image: newImages });
                      }}
                      className="absolute top-0 right-0 w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-xs flex items-center justify-center hover:bg-red-500/40 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onItemChange({ ...item, image: [...(item.image || []), ''] })}
                className="text-xs font-mono text-gray-500 hover:text-amber-400 transition-colors"
              >
                + Add Image
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
}
