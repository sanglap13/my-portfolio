'use client';

import React from 'react';

interface FormFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'textarea' | 'number' | 'url';
  placeholder?: string;
  rows?: number;
  required?: boolean;
  hint?: string;
}

export default function FormField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  rows = 3,
  required = false,
  hint,
}: FormFieldProps) {
  const baseClasses =
    'w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all font-mono';

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-wider">
        {label}
        {required && <span className="text-amber-500">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${baseClasses} resize-y`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
      {hint && (
        <p className="text-[10px] font-mono text-gray-600">{hint}</p>
      )}
    </div>
  );
}
