import React, { useEffect, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import CmsRichTextEditor from '../components/CmsRichTextEditor';
import { CmsHtmlPreview, isEditorEmpty } from '../cmsRichTextUtils';
import { SHREEWEB_CMS_SITE_KEY, readJsonStorage, writeJsonStorage } from '../../lib/shreewebStorage';

const SITE_PREVIEW_ROWS = [
  { key: 'heroTitle', label: 'Hero title' },
  { key: 'heroSubtitle', label: 'Hero subtitle' },
  { key: 'offeringsEyebrow', label: 'Offerings eyebrow' },
  { key: 'offeringsLead', label: 'Offerings lead' },
  { key: 'ctaDiscovery', label: 'Discovery CTA' },
  { key: 'ctaRestoreTitle', label: 'Gradient line 1' },
  { key: 'ctaExpandTitle', label: 'Gradient line 2' },
  { key: 'metaNote', label: 'Editor notes' },
];

const defaultSite = {
  heroTitle: 'JAPANDI',
  heroSubtitle: 'Energetic Alignment',
  offeringsEyebrow: 'Curated Offerings',
  offeringsLead: 'Select the container that aligns with your current capacity and desired expansion.',
  ctaDiscovery: 'Book a Discovery Call',
  ctaRestoreTitle: 'Restore clarity.',
  ctaExpandTitle: 'Expand naturally.',
  metaNote: 'Internal notes for editors (not shown on site until wired).',
};

export default function CmsSiteContent() {
  const [form, setForm] = useState(defaultSite);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = readJsonStorage(SHREEWEB_CMS_SITE_KEY, null);
    if (existing && typeof existing === 'object') {
      setForm((f) => ({ ...f, ...existing }));
    }
  }, []);

  const updateRich = (key) => (html) => {
    setForm((prev) => ({ ...prev, [key]: html }));
    setSaved(false);
  };

  const save = (e) => {
    e.preventDefault();
    writeJsonStorage(SHREEWEB_CMS_SITE_KEY, form);
    setSaved(true);
  };

  return (
    <form onSubmit={save} className={cmsTheme.pageWrap}>
      <div className="grid w-full min-w-0 gap-6 lg:grid-cols-2">
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} min-w-0 space-y-4`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Hero & brand</h2>
        <CmsRichTextEditor
          label="Hero title"
          value={form.heroTitle}
          onChange={updateRich('heroTitle')}
          placeholder="Main headline"
          minHeight="sm"
        />
        <CmsRichTextEditor
          label="Hero subtitle"
          value={form.heroSubtitle}
          onChange={updateRich('heroSubtitle')}
          placeholder="Tagline under headline"
          minHeight="sm"
        />
      </div>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} min-w-0 space-y-4 lg:min-h-[min(100%,320px)]`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Offerings section</h2>
        <CmsRichTextEditor
          label="Eyebrow"
          value={form.offeringsEyebrow}
          onChange={updateRich('offeringsEyebrow')}
          placeholder="Section label above offerings"
          minHeight="sm"
        />
        <CmsRichTextEditor
          label="Lead paragraph"
          value={form.offeringsLead}
          onChange={updateRich('offeringsLead')}
          placeholder="Intro copy for offerings"
          minHeight="md"
        />
      </div>
      </div>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Calls to action</h2>
        <CmsRichTextEditor
          label="Discovery button label"
          value={form.ctaDiscovery}
          onChange={updateRich('ctaDiscovery')}
          placeholder="Button text"
          minHeight="sm"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <CmsRichTextEditor
            label="Gradient block — line 1"
            value={form.ctaRestoreTitle}
            onChange={updateRich('ctaRestoreTitle')}
            placeholder="e.g. Restore clarity."
            minHeight="sm"
          />
          <CmsRichTextEditor
            label="Gradient block — line 2"
            value={form.ctaExpandTitle}
            onChange={updateRich('ctaExpandTitle')}
            placeholder="e.g. Expand naturally."
            minHeight="sm"
          />
        </div>
        <CmsRichTextEditor
          label="Editor notes"
          value={form.metaNote}
          onChange={updateRich('metaNote')}
          placeholder="Internal notes for your team"
          minHeight="md"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={cmsTheme.btnPrimary}>
          Save site content
        </button>
        {saved ? <span className="text-sm text-amber-800">Saved locally.</span> : null}
      </div>

      <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
        <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Saved content preview</h2>
          <p className="mt-1 text-sm text-stone-600">Table view of what will be stored locally after you save (same fields as above).</p>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-100/80 text-xs font-semibold uppercase tracking-wider text-stone-600">
              <tr>
                <th className="w-[28%] px-4 py-3">Field</th>
                <th className="px-4 py-3">Preview</th>
              </tr>
            </thead>
            <tbody>
              {SITE_PREVIEW_ROWS.map(({ key, label }) => {
                const val = form[key];
                const empty = val == null || isEditorEmpty(val);
                return (
                  <tr key={key} className="border-b border-stone-100 align-top hover:bg-white/80">
                    <td className="px-4 py-3 font-medium text-stone-800">{label}</td>
                    <td className="max-w-0 px-4 py-3">
                      {empty ? (
                        <span className="text-stone-400">—</span>
                      ) : (
                        <div className="max-h-40 overflow-y-auto rounded-lg border border-stone-100 bg-stone-50/80 px-3 py-2">
                          <CmsHtmlPreview html={val} className="text-sm" />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </form>
  );
}
