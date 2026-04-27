'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';

interface MediaUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  accept?: string;
  resourceType?: 'image' | 'video';
  label?: string;
}

export default function MediaUploader({
  value,
  onChange,
  folder,
  accept = 'image/*',
  resourceType = 'image',
  label = 'Upload Media',
}: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress('Uploading...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('resourceType', resourceType);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      onChange(data.url);
      setProgress('Uploaded!');
      setTimeout(() => setProgress(''), 2000);
    } catch (error) {
      console.error('Upload error:', error);
      setProgress('Failed!');
      setTimeout(() => setProgress(''), 3000);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block">
        {label}
      </label>
      <div className="flex gap-3 items-start">
        {/* Preview */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-24 h-24 rounded-xl bg-white/[0.04] border border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-amber-500/30 hover:bg-amber-500/5 transition-all overflow-hidden shrink-0"
        >
          {value ? (
            resourceType === 'video' ? (
              <video src={value} className="w-full h-full object-cover" muted />
            ) : (
              <div className="relative w-full h-full">
                <Image src={value} alt="Preview" fill sizes="96px" className="object-cover" />
              </div>
            )
          ) : (
            <span className="text-gray-600 text-2xl">{uploading ? '⏳' : '+'}</span>
          )}
        </div>

        {/* URL input */}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="CDN URL or click to upload"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/40 transition-all font-mono"
          />
          {progress && (
            <p className={`text-[10px] font-mono ${progress === 'Failed!' ? 'text-red-400' : 'text-amber-400'}`}>
              {progress}
            </p>
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
