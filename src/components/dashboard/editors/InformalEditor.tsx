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
  stats: Array<{ value: string; label: string }>;
  heroText: { overline: string; title: string; subtitle: string };
  badge: { top: string; middle: string; bottom: string };
  gallery: { overline: string; title: string; description: string; items: Array<{ overline: string; title: string }> };
  followSection: { title: string; subtitle: string };
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
    <div className="space-y-12">
      {/* Identity */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-2 uppercase tracking-widest">Creator Identity</h3>
        <FormField label="Page Title" value={data.title || ''} onChange={(v) => onChange({ ...data, title: v })} placeholder="Rider. Creator. Explorer." />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Creator Name" value={data.creatorName || ''} onChange={(v) => onChange({ ...data, creatorName: v })} />
          <FormField label="Creator ID" value={data.creatorId || ''} onChange={(v) => onChange({ ...data, creatorId: v })} placeholder="@handle" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="YouTube URL" type="url" value={data.youtubeUrl || ''} onChange={(v) => onChange({ ...data, youtubeUrl: v })} />
          <FormField label="Instagram URL" type="url" value={data.instagramUrl || ''} onChange={(v) => onChange({ ...data, instagramUrl: v })} />
        </div>
        <FormField label="Main Description" type="textarea" rows={4} value={data.description || ''} onChange={(v) => onChange({ ...data, description: v })} />
      </div>

      {/* Philosophy & Stats */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-2 uppercase tracking-widest">Philosophy & Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField label="Philosophy Overline" value={data.heroText?.overline || ''} onChange={(v) => onChange({ ...data, heroText: { ...data.heroText, overline: v } })} />
            <FormField label="Philosophy Title" type="textarea" rows={2} value={data.heroText?.title || ''} onChange={(v) => onChange({ ...data, heroText: { ...data.heroText, title: v } })} />
            <FormField label="Philosophy Subtitle" value={data.heroText?.subtitle || ''} onChange={(v) => onChange({ ...data, heroText: { ...data.heroText, subtitle: v } })} />
          </div>
          <ArrayField
            label="Key Stats"
            items={data.stats || []}
            onChange={(items) => onChange({ ...data, stats: items })}
            createItem={() => ({ value: '', label: '' })}
            addLabel="Add Stat"
            renderItem={(item, _i, onItemChange) => (
              <div className="grid grid-cols-2 gap-2">
                <FormField label="Value" value={item.value} onChange={(v) => onItemChange({ ...item, value: v })} placeholder="20K+" />
                <FormField label="Label" value={item.label} onChange={(v) => onItemChange({ ...item, label: v })} placeholder="Video Views" />
              </div>
            )}
          />
        </div>
      </div>

      {/* Floating Badge & Hero Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-2 uppercase tracking-widest">Floating Badge</h3>
          <FormField label="Badge Top (Role)" value={data.badge?.top || ''} onChange={(v) => onChange({ ...data, badge: { ...data.badge, top: v } })} />
          <FormField label="Badge Middle (Stat)" value={data.badge?.middle || ''} onChange={(v) => onChange({ ...data, badge: { ...data.badge, middle: v } })} />
          <FormField label="Badge Bottom (Caption)" value={data.badge?.bottom || ''} onChange={(v) => onChange({ ...data, badge: { ...data.badge, bottom: v } })} />
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-2 uppercase tracking-widest">Hero Image</h3>
          <MediaUploader
            label="Hero Photo"
            value={data.heroImage || ''}
            onChange={(v) => onChange({ ...data, heroImage: v })}
            folder="beyondCode/hero"
          />
          <FormField label="Hero Caption" value={data.video?.title || ''} onChange={(v) => onChange({ ...data, video: { ...data.video, title: v } })} />
        </div>
      </div>

      {/* Reels */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-2 uppercase tracking-widest">Shorts & Reels</h3>
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
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-2 uppercase tracking-widest">Gallery & Mosaic</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Gallery Overline" value={data.gallery?.overline || ''} onChange={(v) => onChange({ ...data, gallery: { ...data.gallery, overline: v } })} />
          <FormField label="Gallery Title" value={data.gallery?.title || ''} onChange={(v) => onChange({ ...data, gallery: { ...data.gallery, title: v } })} />
        </div>
        <FormField label="Gallery Description" type="textarea" rows={2} value={data.gallery?.description || ''} onChange={(v) => onChange({ ...data, gallery: { ...data.gallery, description: v } })} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(data.photos || []).slice(0, 4).map((photo, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
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
              <div className="space-y-2">
                <FormField 
                  label="Item Overline" 
                  value={data.gallery?.items?.[i]?.overline || ''} 
                  onChange={(v) => {
                    const newItems = [...(data.gallery?.items || [])];
                    if (!newItems[i]) newItems[i] = { overline: '', title: '' };
                    newItems[i].overline = v;
                    onChange({ ...data, gallery: { ...data.gallery, items: newItems } });
                  }} 
                />
                <FormField 
                  label="Item Title" 
                  value={data.gallery?.items?.[i]?.title || ''} 
                  onChange={(v) => {
                    const newItems = [...(data.gallery?.items || [])];
                    if (!newItems[i]) newItems[i] = { overline: '', title: '' };
                    newItems[i].title = v;
                    onChange({ ...data, gallery: { ...data.gallery, items: newItems } });
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connect Card */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-2 uppercase tracking-widest">Connect Card</h3>
        <FormField label="CTA Title" value={data.followSection?.title || ''} onChange={(v) => onChange({ ...data, followSection: { ...data.followSection, title: v } })} />
        <FormField label="CTA Subtitle" type="textarea" value={data.followSection?.subtitle || ''} onChange={(v) => onChange({ ...data, followSection: { ...data.followSection, subtitle: v } })} />
      </div>
    </div>
  );
}
