import React, { useEffect, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import CmsRichTextEditor from '../components/CmsRichTextEditor';
import { CmsHtmlPreview, isEditorEmpty } from '../cmsRichTextUtils';
import { readJsonStorage, writeJsonStorage } from '../../lib/shreewebStorage';

const BOOKINGS_KEY = 'shreeweb_cms_bookings_placeholder_v1';

export default function CmsBookings() {
  const [rows, setRows] = useState([]);
  const [label, setLabel] = useState('');
  const [plan, setPlan] = useState('discovery');

  useEffect(() => {
    const data = readJsonStorage(BOOKINGS_KEY, []);
    setRows(Array.isArray(data) ? data : []);
  }, []);

  const persist = (next) => {
    setRows(next);
    writeJsonStorage(BOOKINGS_KEY, next);
  };

  const add = (e) => {
    e.preventDefault();
    if (isEditorEmpty(label)) return;
    persist([
      {
        id: `b-${Date.now().toString(36)}`,
        label,
        plan,
        at: new Date().toISOString(),
        status: 'placeholder',
      },
      ...rows,
    ]);
    setLabel('');
  };

  return (
    <div className={cmsTheme.pageWrap}>
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <p className="text-sm text-stone-600">
          Production bookings should sync from your calendar provider or payment webhooks. Below is a <strong>local-only</strong> queue for demos and QA.
        </p>
      </div>

      <form onSubmit={add} className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Record manual entry</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <CmsRichTextEditor
            label="Label / client"
            value={label}
            onChange={setLabel}
            placeholder="Initials, internal note, or short client-facing label"
            minHeight="sm"
          />
          <div>
            <label className={cmsTheme.label}>Plan</label>
            <select className={cmsTheme.input} value={plan} onChange={(e) => setPlan(e.target.value)}>
              <option value="discovery">Discovery</option>
              <option value="alignment">Alignment</option>
              <option value="realignment">Realignment</option>
              <option value="transformation">Transformation</option>
            </select>
          </div>
        </div>
        <button type="submit" className={cmsTheme.btnPrimary}>
          Add placeholder row
        </button>
      </form>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Queue ({rows.length})</h2>
        <ul className="mt-4">
          {rows.length === 0 ? <li className="py-4 text-sm text-stone-500">Empty.</li> : null}
          {rows.map((r) => (
            <li key={r.id} className="grid gap-2 border-b border-stone-100 py-3 text-sm last:border-0 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-4">
              <div className="min-w-0 font-medium text-stone-900">
                <CmsHtmlPreview html={r.label} />
              </div>
              <span className="w-fit rounded-full bg-stone-200/80 px-2 py-0.5 text-xs text-stone-700">{r.plan}</span>
              <span className="text-stone-500 whitespace-nowrap">{r.at ? new Date(r.at).toLocaleString() : ''}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
