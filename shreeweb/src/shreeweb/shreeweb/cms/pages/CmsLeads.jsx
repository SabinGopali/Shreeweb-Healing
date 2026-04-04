import React, { useMemo, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import { getEmailCaptureEntries } from '../../lib/shreewebStorage';

export default function CmsLeads() {
  const [query, setQuery] = useState('');
  const [tick, setTick] = useState(0);
  const rows = useMemo(() => getEmailCaptureEntries(), [tick]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => String(r.email || '').toLowerCase().includes(q) || String(r.context || '').toLowerCase().includes(q));
  }, [rows, query]);

  return (
    <div className={cmsTheme.pageWrap}>
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} flex w-full flex-col gap-3 sm:flex-row sm:items-end`}>
        <div className="min-w-0 flex-1">
          <label className={cmsTheme.label}>Filter</label>
          <input
            className={cmsTheme.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by email or context"
          />
        </div>
        <button type="button" className={cmsTheme.btnGhost} onClick={() => setTick((t) => t + 1)}>
          Refresh list
        </button>
      </div>

      <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
        <div className="w-full overflow-x-auto">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-100/80 text-xs font-semibold uppercase tracking-wider text-stone-600">
              <tr>
                <th className="w-[32%] px-4 py-3">Email</th>
                <th className="px-4 py-3">Context</th>
                <th className="w-[28%] px-4 py-3">Captured</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-stone-500">
                    No captures yet. Submissions from <span className="font-medium text-stone-700">EmailCapture</span> on the public site will list here.
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={`${r.email}-${r.at}-${i}`} className="border-b border-stone-100 hover:bg-white/80">
                    <td className="px-4 py-3 align-top font-medium text-stone-900 break-all">{r.email}</td>
                    <td className="px-4 py-3 align-top text-stone-600 break-words">{r.context || '—'}</td>
                    <td className="px-4 py-3 align-top text-stone-500 whitespace-nowrap">{r.at ? new Date(r.at).toLocaleString() : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
