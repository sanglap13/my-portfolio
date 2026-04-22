'use client';

import React from 'react';

interface SaveButtonProps {
  onClick: () => void;
  status: 'idle' | 'saving' | 'saved' | 'error';
  className?: string;
}

export default function SaveButton({ onClick, status, className = '' }: SaveButtonProps) {
  const labels = {
    idle: 'Save Changes',
    saving: 'Saving...',
    saved: 'Saved ✓',
    error: 'Error — Retry',
  };

  const styles = {
    idle: 'bg-amber-500 hover:bg-amber-400 text-black',
    saving: 'bg-amber-500/50 text-black/50 cursor-wait',
    saved: 'bg-emerald-500/80 text-white',
    error: 'bg-red-500/80 text-white hover:bg-red-500',
  };

  return (
    <button
      onClick={onClick}
      disabled={status === 'saving'}
      className={`px-8 py-3 rounded-xl text-sm font-mono font-bold uppercase tracking-wider transition-all duration-300 ${styles[status]} ${className}`}
    >
      {labels[status]}
    </button>
  );
}
