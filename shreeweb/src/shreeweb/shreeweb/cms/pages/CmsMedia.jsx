import React, { useEffect, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import CmsRichTextEditor from '../components/CmsRichTextEditor';
import { CmsHtmlPreview } from '../cmsRichTextUtils';
import { readJsonStorage, writeJsonStorage } from '../../lib/shreewebStorage';

const MEDIA_NOTES_KEY = 'shreeweb_cms_media_notes_v1';

export default function CmsMedia() {
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const n = readJsonStorage(MEDIA_NOTES_KEY, '');
    setNotes(typeof n === 'string' ? n : '');
  }, []);

  const save = (e) => {
    e.preventDefault();
    writeJsonStorage(MEDIA_NOTES_KEY, notes);
    setSaved(true);
  };

  return (
    <form onSubmit={save} className={cmsTheme.pageWrap}>
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Asset notes</h2>
        <p className="mt-2 text-sm text-stone-600">
          Track paths for <code className="rounded bg-stone-100 px-1">/public</code> images, hero backgrounds, and future CDN URLs. Full upload UI can connect to S3 or your API later.
        </p>
        <div className="mt-4">
          <CmsRichTextEditor
            label="Notes"
            value={notes}
            onChange={(html) => {
              setNotes(html);
              setSaved(false);
            }}
            placeholder="Asset paths, CDN URLs, shot lists — use lists and bold for structure"
            minHeight="lg"
          />
        </div>
        {notes ? (
          <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50/80 p-4">
            <p className={cmsTheme.label}>Preview</p>
            <CmsHtmlPreview html={notes} className="mt-2 text-sm" />
          </div>
        ) : null}
        <div className="mt-4 flex items-center gap-3">
          <button type="submit" className={cmsTheme.btnPrimary}>
            Save notes
          </button>
          {saved ? <span className="text-sm text-amber-800">Saved locally.</span> : null}
        </div>
      </div>
    </form>
  );
}
