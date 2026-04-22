'use client';

import { useEffect, useState } from 'react';

interface Contact {
  _id: string;
  intent: string;
  senderEmail: string;
  senderName?: string;
  message?: string;
  status: string;
  starred: boolean;
  createdAt: string;
}

const intentColors: Record<string, string> = {
  resume: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  email: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  message: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchContacts = async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '15' });
    if (filter) params.set('intent', filter);
    if (statusFilter) params.set('status', statusFilter);

    try {
      const res = await fetch(`/api/contacts?${params}`);
      const data = await res.json();
      setContacts(data.data || []);
      setPagination(data.pagination || { page: 1, total: 0, totalPages: 0 });
    } catch {
      console.error('Failed to fetch contacts');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, statusFilter]);

  const handleStatusChange = async (id: string, status: string) => {
    await fetch('/api/contacts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setContacts((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
  };

  const handleStar = async (id: string, starred: boolean) => {
    await fetch('/api/contacts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, starred }),
    });
    setContacts((prev) => prev.map((c) => (c._id === id ? { ...c, starred } : c)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contact request?')) return;
    await fetch('/api/contacts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setContacts((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Contact Requests</h1>
        <p className="text-xs font-mono text-gray-500 mt-1">
          {pagination.total} total request{pagination.total !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
            !filter ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:text-white'
          }`}
        >
          All
        </button>
        {['resume', 'email', 'message'].map((intent) => (
          <button
            key={intent}
            onClick={() => setFilter(filter === intent ? '' : intent)}
            className={`px-4 py-2 rounded-xl text-xs font-mono capitalize transition-all ${
              filter === intent ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:text-white'
            }`}
          >
            {intent}
          </button>
        ))}
        <div className="w-px bg-white/10 mx-1" />
        {['unread', 'read', 'archived'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
            className={`px-4 py-2 rounded-xl text-xs font-mono capitalize transition-all ${
              statusFilter === s ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-sm font-mono text-gray-500 animate-pulse">Loading contacts...</p>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
          <p className="text-3xl mb-3">📭</p>
          <p className="text-sm font-bold text-gray-400">No contact requests</p>
          <p className="text-xs font-mono text-gray-600 mt-1">
            {filter || statusFilter ? 'Try removing filters' : 'Requests will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className={`bg-white/[0.02] border rounded-2xl transition-all ${
                contact.status === 'unread'
                  ? 'border-amber-500/20 bg-amber-500/[0.02]'
                  : 'border-white/[0.06]'
              }`}
            >
              <div
                className="flex items-center gap-4 p-4 cursor-pointer"
                onClick={() => {
                  setExpandedId(expandedId === contact._id ? null : contact._id);
                  if (contact.status === 'unread') {
                    handleStatusChange(contact._id, 'read');
                  }
                }}
              >
                {/* Star */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStar(contact._id, !contact.starred);
                  }}
                  className={`text-lg transition-colors ${
                    contact.starred ? 'text-amber-400' : 'text-gray-700 hover:text-gray-400'
                  }`}
                >
                  {contact.starred ? '★' : '☆'}
                </button>

                {/* Unread dot */}
                <div className={`w-2 h-2 rounded-full shrink-0 ${contact.status === 'unread' ? 'bg-amber-400' : 'bg-transparent'}`} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className={`text-sm font-bold truncate ${contact.status === 'unread' ? 'text-white' : 'text-gray-300'}`}>
                      {contact.senderName || contact.senderEmail}
                    </p>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${intentColors[contact.intent] || ''}`}>
                      {contact.intent}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-gray-500 truncate">
                    {contact.senderEmail}
                    {contact.message ? ` · ${contact.message.substring(0, 60)}...` : ''}
                  </p>
                </div>

                {/* Date */}
                <p className="text-[10px] font-mono text-gray-600 shrink-0">
                  {new Date(contact.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Expanded details */}
              {expandedId === contact._id && (
                <div className="border-t border-white/[0.06] px-4 py-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Name</p>
                      <p className="text-white font-mono">{contact.senderName || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Email</p>
                      <a href={`mailto:${contact.senderEmail}`} className="text-amber-400 font-mono hover:underline">
                        {contact.senderEmail}
                      </a>
                    </div>
                  </div>

                  {contact.message && (
                    <div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2">Message</p>
                      <p className="text-sm text-gray-300 font-mono bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 whitespace-pre-wrap">
                        {contact.message}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    {contact.status !== 'archived' && (
                      <button
                        onClick={() => handleStatusChange(contact._id, 'archived')}
                        className="px-4 py-2 rounded-xl text-xs font-mono bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all border border-white/[0.06]"
                      >
                        Archive
                      </button>
                    )}
                    {contact.status === 'archived' && (
                      <button
                        onClick={() => handleStatusChange(contact._id, 'read')}
                        className="px-4 py-2 rounded-xl text-xs font-mono bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all border border-white/[0.06]"
                      >
                        Unarchive
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="px-4 py-2 rounded-xl text-xs font-mono bg-red-500/10 text-red-400/60 hover:text-red-400 hover:bg-red-500/20 transition-all border border-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => fetchContacts(page)}
              className={`w-8 h-8 rounded-lg text-xs font-mono transition-all ${
                page === pagination.page
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
