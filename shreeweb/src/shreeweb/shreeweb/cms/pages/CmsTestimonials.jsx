import React, { useEffect, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import CmsRichTextEditor, { plainToHtml } from '../components/CmsRichTextEditor';
import { CmsHtmlPreview, isEditorEmpty } from '../cmsRichTextUtils';
import { SHREEWEB_CMS_TESTIMONIALS_KEY, readJsonStorage, writeJsonStorage } from '../../lib/shreewebStorage';

function uid() {
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function CmsTestimonials() {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const data = readJsonStorage(SHREEWEB_CMS_TESTIMONIALS_KEY, []);
    setRows(Array.isArray(data) ? data : []);
  }, []);

  const persist = (next) => {
    setRows(next);
    writeJsonStorage(SHREEWEB_CMS_TESTIMONIALS_KEY, next);
  };

  const add = (e) => {
    e.preventDefault();
    if (isEditorEmpty(quote)) return;
    const nameHtml = isEditorEmpty(name) ? plainToHtml('Client') : name;
    persist([
      {
        id: uid(),
        name: nameHtml,
        quote,
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      },
      ...rows,
    ]);
    setName('');
    setQuote('');
    setRating(5);
  };

  const remove = (id) => {
    persist(rows.filter((r) => r.id !== id));
  };

  return (
    <div className={cmsTheme.pageWrap}>
      <form onSubmit={add} className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Add testimonial</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <CmsRichTextEditor
            label="Name"
            value={name}
            onChange={setName}
            placeholder="Client name (optional formatting)"
            minHeight="sm"
          />
          <div>
            <label className={cmsTheme.label}>Rating (1–5)</label>
            <input
              type="number"
              min={1}
              max={5}
              className={cmsTheme.input}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>
        </div>
        <CmsRichTextEditor
          label="Quote"
          value={quote}
          onChange={setQuote}
          placeholder="Testimonial body — use toolbar for emphasis, lists, links"
          minHeight="lg"
        />
        <button type="submit" className={cmsTheme.btnPrimary}>
          Insert row
        </button>
      </form>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Saved entries ({rows.length})</h2>
        <ul className="mt-4 divide-y divide-stone-200">
          {rows.length === 0 ? <li className="py-6 text-sm text-stone-500">No testimonials yet.</li> : null}
          {rows.map((r) => (
            <li key={r.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <CmsHtmlPreview html={r.name} className="font-medium text-stone-900" />
                <CmsHtmlPreview html={r.quote} className="mt-1 text-stone-600" />
                <div className="mt-1 text-xs text-stone-500">Rating: {r.rating}</div>
              </div>
              <button type="button" className={`${cmsTheme.btnGhost} shrink-0`} onClick={() => remove(r.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
