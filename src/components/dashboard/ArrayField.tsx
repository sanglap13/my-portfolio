'use client';

import React from 'react';

interface ArrayFieldProps<T> {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, onChange: (updated: T) => void) => React.ReactNode;
  createItem: () => T;
  addLabel?: string;
}

export default function ArrayField<T>({
  label,
  items,
  onChange,
  renderItem,
  createItem,
  addLabel = 'Add Item',
}: ArrayFieldProps<T>) {
  const handleItemChange = (index: number, updated: T) => {
    const newItems = [...items];
    newItems[index] = updated;
    onChange(newItems);
  };

  const handleAdd = () => {
    onChange([...items, createItem()]);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    onChange(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    onChange(newItems);
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block">
        {label} ({items.length})
      </label>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 relative group"
          >
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                className="w-6 h-6 rounded-md bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all text-xs disabled:opacity-20"
                title="Move up"
              >
                ↑
              </button>
              <button
                onClick={() => handleMoveDown(index)}
                disabled={index === items.length - 1}
                className="w-6 h-6 rounded-md bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all text-xs disabled:opacity-20"
                title="Move down"
              >
                ↓
              </button>
              <button
                onClick={() => handleRemove(index)}
                className="w-6 h-6 rounded-md bg-red-500/10 text-red-400/60 hover:text-red-400 hover:bg-red-500/20 transition-all text-xs"
                title="Remove"
              >
                ×
              </button>
            </div>
            <div className="pr-20">
              {renderItem(item, index, (updated) => handleItemChange(index, updated))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleAdd}
        className="w-full py-3 rounded-xl border border-dashed border-white/10 text-sm font-mono text-gray-500 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all"
      >
        + {addLabel}
      </button>
    </div>
  );
}
