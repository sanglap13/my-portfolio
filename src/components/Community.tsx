'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

type CommunityEntry = {
  title: string;
  description: string;
  image: string;
  priority: number;
};

// Derive role from title
function getRole(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('lead')) return 'Lead';
  if (lower.includes('speaker')) return 'Speaker';
  if (lower.includes('mentor/judge')) return 'Mentor & Judge';
  if (lower.includes('mentor')) return 'Mentor';
  if (lower.includes('judge')) return 'Judge';
  return 'Other';
}

// Color mapping per role
const roleColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  'All':            { bg: 'bg-white/10',          border: 'border-white/20',          text: 'text-white',           glow: '' },
  'Lead':           { bg: 'bg-yellow-500/10',     border: 'border-yellow-500/20',     text: 'text-yellow-400',      glow: 'shadow-[0_0_20px_rgba(234,179,8,0.2)]' },
  'Speaker':        { bg: 'bg-theme-indigo/10',   border: 'border-theme-indigo/20',   text: 'text-theme-indigo',    glow: 'shadow-[0_0_20px_rgba(99,102,241,0.2)]' },
  'Mentor':         { bg: 'bg-emerald-500/10',    border: 'border-emerald-500/20',    text: 'text-emerald-400',     glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]' },
  'Judge':          { bg: 'bg-rose-500/10',       border: 'border-rose-500/20',       text: 'text-rose-400',        glow: 'shadow-[0_0_20px_rgba(244,63,94,0.2)]' },
  'Mentor & Judge': { bg: 'bg-cyan-500/10',       border: 'border-cyan-500/20',       text: 'text-cyan-400',        glow: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]' },
  'Other':          { bg: 'bg-gray-500/10',       border: 'border-gray-500/20',       text: 'text-gray-400',        glow: '' },
};

export default function CommunityFull({ data, className }: { data: CommunityEntry[]; className?: string }) {
  const [activeRole, setActiveRole] = useState('All');

  const sorted = useMemo(() =>
    [...data].sort((a, b) => (b.priority || 0) - (a.priority || 0)),
    [data]
  );

  const roles = useMemo(() => {
    const r = new Set(sorted.map((e) => getRole(e.title)));
    return ['All', ...Array.from(r)];
  }, [sorted]);

  const filtered = activeRole === 'All' ? sorted : sorted.filter((e) => getRole(e.title) === activeRole);

  // Compute stats
  const stats = useMemo(() => {
    const speakers = data.filter(d => getRole(d.title) === 'Speaker').length;
    const hackathons = data.filter(d => ['Judge', 'Mentor', 'Mentor & Judge'].includes(getRole(d.title))).length;
    return [
      { label: 'Events', value: data.length + '+' },
      { label: 'Talks & Workshops', value: String(speakers) },
      { label: 'Hackathons', value: hackathons + '+' },
      { label: 'Cities', value: '8+' },
    ];
  }, [data]);

  if (!data || data.length === 0) return null;

  return (
    <section className={cn('py-24 px-4 md:px-12 max-w-7xl mx-auto relative', className)}>
      {/* Ambient background */}
      <div className="pointer-events-none absolute -inset-x-[50vw] inset-y-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] left-[15%] w-[400px] h-[400px] rounded-full bg-theme-amber/[0.10] blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[55%] right-[15%] w-[350px] h-[350px] rounded-full bg-theme-indigo/[0.08] blur-[100px]"
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#121212] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#121212] to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ─── STATS BAR ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20"
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#1a1a1f] border border-white/[0.07] p-6 text-center"
            >
              <p className="geist-sans text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
              <p className="geist-mono text-xs text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ─── ROLE FILTER ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex gap-2 mb-12 overflow-x-auto scrollbar-none pb-2"
        >
          {roles.map((role) => {
            const count = role === 'All' ? data.length : sorted.filter(e => getRole(e.title) === role).length;
            const colors = roleColors[role] || roleColors['Other'];
            return (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={cn(
                  'geist-mono text-xs px-5 py-2.5 rounded-full border transition-all duration-300 font-medium whitespace-nowrap flex items-center gap-2',
                  activeRole === role
                    ? `${colors.bg} ${colors.border} ${colors.text} ${colors.glow}`
                    : 'bg-white/[0.03] border-white/10 text-gray-500 hover:bg-white/[0.06] hover:text-gray-300 hover:border-white/20'
                )}
              >
                {role}
                <span className={cn(
                  'text-[9px] px-1.5 py-0.5 rounded-full font-bold',
                  activeRole === role ? `${colors.bg} ${colors.text}` : 'bg-white/5 text-gray-600'
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* ─── EVENT GRID ─── */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => {
              const role = getRole(item.title);
              const colors = roleColors[role] || roleColors['Other'];

              return (
                <motion.div
                  key={item.title}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.03 }}
                  className="group relative rounded-2xl bg-[#1a1a1f] border border-white/[0.07] overflow-hidden hover:border-white/15 transition-all duration-500"
                >
                  {/* Image placeholder area */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#15151a]">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px] flex items-center justify-center">
                      <span className="geist-mono text-xs text-gray-600 opacity-50">[ {item.image} ]</span>
                    </div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1f] via-transparent to-transparent" />

                    {/* Role badge */}
                    <div className="absolute top-4 left-4">
                      <span className={cn(
                        'geist-mono text-[10px] px-3 py-1.5 rounded-full uppercase tracking-wider font-bold border',
                        colors.bg, colors.border, colors.text
                      )}>
                        {role}
                      </span>
                    </div>

                    {/* Priority indicator */}
                    <div className="absolute top-4 right-4 flex gap-1">
                      {Array.from({ length: Math.min(item.priority, 5) }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            i < Math.ceil(item.priority / 2) ? 'bg-theme-amber/60' : 'bg-white/10'
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col gap-3">
                    {/* Ghost index */}
                    <span className="absolute right-3 bottom-2 geist-sans text-6xl font-black text-white/[0.03] select-none leading-none group-hover:text-white/[0.06] transition-all duration-500">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <h3 className="geist-sans text-lg font-bold text-white/90 group-hover:text-white transition-colors leading-snug relative z-10">
                      {item.title}
                    </h3>
                    <p className="geist-mono text-[13px] text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors relative z-10">
                      {item.description}
                    </p>
                  </div>

                  {/* Top accent line on hover */}
                  <div className={cn(
                    'absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                    role === 'Speaker' ? 'via-theme-indigo/50' :
                    role === 'Judge' ? 'via-rose-500/50' :
                    role === 'Mentor' ? 'via-emerald-500/50' :
                    role === 'Mentor & Judge' ? 'via-cyan-500/50' :
                    role === 'Lead' ? 'via-yellow-500/50' :
                    'via-white/30'
                  )} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
