'use client';

import FormField from '@/components/dashboard/FormField';
import ArrayField from '@/components/dashboard/ArrayField';
import MediaUploader from '@/components/dashboard/MediaUploader';

interface InformalData {
  title: string;
  creatorName: string;
  creatorId: string;
  youtubeUrl: string;
  instagramUrl: string;
  countriesCount: number;
  statesCount: number;
  description: string;
  video: { title: string; placeholder: string };
  heroImage: string;
  reels: Array<{ src: string; youtubeUrl: string; instaUrl: string; views: string; likes: string; title: string }>;
  photos: string[];
}

export default function InformalEditor({
  data,
  onChange,
}: {
  data: InformalData;
  onChange: (data: InformalData) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Identity */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-2">Creator Identity</h3>
        <FormField label="Title" value={data.title || ''} onChange={(v) => onChange({ ...data, title: v })} placeholder="Rider. Creator. Explorer." />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Creator Name" value={data.creatorName || ''} onChange={(v) => onChange({ ...data, creatorName: v })} />
          <FormField label="Creator ID" value={data.creatorId || ''} onChange={(v) => onChange({ ...data, creatorId: v })} placeholder="@handle" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="YouTube URL" type="url" value={data.youtubeUrl || ''} onChange={(v) => onChange({ ...data, youtubeUrl: v })} />
          <FormField label="Instagram URL" type="url" value={data.instagramUrl || ''} onChange={(v) => onChange({ ...data, instagramUrl: v })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Countries Count" type="number" value={data.countriesCount || 0} onChange={(v) => onChange({ ...data, countriesCount: parseInt(v) || 0 })} />
          <FormField label="States Count" type="number" value={data.statesCount || 0} onChange={(v) => onChange({ ...data, statesCount: parseInt(v) || 0 })} />
        </div>
        <FormField label="Description" type="textarea" rows={4} value={data.description || ''} onChange={(v) => onChange({ ...data, description: v })} />
      </div>

      {/* Hero Image */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-2">Hero Image</h3>
        <MediaUploader
          label="Hero Photo"
          value={data.heroImage || ''}
          onChange={(v) => onChange({ ...data, heroImage: v })}
          folder="beyondCode/hero"
        />
      </div>

      {/* Vlog */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-2">Featured Vlog</h3>
        <FormField label="Vlog Title" value={data.video?.title || ''} onChange={(v) => onChange({ ...data, video: { ...data.video, title: v } })} />
      </div>

      {/* Reels */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-2">Reels / Shorts</h3>
        <ArrayField
          label="Reels"
          items={data.reels || []}
          onChange={(items) => onChange({ ...data, reels: items })}
          createItem={() => ({ src: '', youtubeUrl: '', instaUrl: '', views: '', likes: '', title: '' })}
          addLabel="Add Reel"
          renderItem={(item, _i, onItemChange) => (
            <div className="space-y-3">
              <FormField label="Title" value={item.title || ''} onChange={(v) => onItemChange({ ...item, title: v })} placeholder="Reel Title" />
              <MediaUploader
                label="Video File"
                value={item.src || ''}
                onChange={(v) => onItemChange({ ...item, src: v })}
                folder="beyondCode/reels"
                accept="video/*"
                resourceType="video"
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField label="YouTube URL" type="url" value={item.youtubeUrl || ''} onChange={(v) => onItemChange({ ...item, youtubeUrl: v })} />
                <FormField label="Instagram URL" type="url" value={item.instaUrl || ''} onChange={(v) => onItemChange({ ...item, instaUrl: v })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Views" value={item.views || ''} onChange={(v) => onItemChange({ ...item, views: v })} placeholder="145.2K Views" />
                <FormField label="Likes" value={item.likes || ''} onChange={(v) => onItemChange({ ...item, likes: v })} placeholder="13.4K Likes" />
              </div>
            </div>
          )}
        />
      </div>

      {/* Gallery */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-2">Gallery Photos</h3>
        <div className="grid grid-cols-2 gap-4">
          {(data.photos || []).map((photo, i) => (
            <div key={i} className="relative group">
              <MediaUploader
                label={`Photo ${i + 1}`}
                value={photo}
                onChange={(v) => {
                  const newPhotos = [...(data.photos || [])];
                  newPhotos[i] = v;
                  onChange({ ...data, photos: newPhotos });
                }}
                folder="beyondCode/gallery"
              />
              <button
                onClick={() => {
                  onChange({ ...data, photos: data.photos.filter((_, idx) => idx !== i) });
                }}
                className="absolute top-0 right-0 w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-xs flex items-center justify-center hover:bg-red-500/40 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => onChange({ ...data, photos: [...(data.photos || []), ''] })}
          className="w-full py-3 rounded-xl border border-dashed border-white/10 text-sm font-mono text-gray-500 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all"
        >
          + Add Photo
        </button>
      </div>
    </div>
  );
}
