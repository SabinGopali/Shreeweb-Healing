import React, { useEffect, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import CmsRichTextEditor from '../components/CmsRichTextEditor';
import { CmsHtmlPreview, isEditorEmpty } from '../cmsRichTextUtils';
import {
  SHREEWEB_CMS_FAQ_KEY,
  SHREEWEB_CMS_SOCIAL_KEY,
  readJsonStorage,
  writeJsonStorage,
} from '../../lib/shreewebStorage';

function uid() {
  return `faq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const defaultSocial = {
  facebookLabel: 'Facebook',
  facebookUrl: '',
  instagramLabel: 'Instagram',
  instagramUrl: '',
  tiktokLabel: 'TikTok',
  tiktokUrl: '',
};

export default function CmsFaqSocial() {
  const [faq, setFaq] = useState([]);
  const [social, setSocial] = useState(defaultSocial);
  const [q, setQ] = useState('');
  const [a, setA] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const f = readJsonStorage(SHREEWEB_CMS_FAQ_KEY, []);
    setFaq(Array.isArray(f) ? f : []);
    const s = readJsonStorage(SHREEWEB_CMS_SOCIAL_KEY, null);
    if (s && typeof s === 'object') setSocial((prev) => ({ ...prev, ...s }));
  }, []);

  const saveSocial = (e) => {
    e.preventDefault();
    writeJsonStorage(SHREEWEB_CMS_SOCIAL_KEY, social);
    setSaved(true);
  };

  const addFaq = (e) => {
    e.preventDefault();
    if (isEditorEmpty(q)) return;
    const next = [{ id: uid(), q, a }, ...faq];
    setFaq(next);
    writeJsonStorage(SHREEWEB_CMS_FAQ_KEY, next);
    setQ('');
    setA('');
  };

  const removeFaq = (id) => {
    const next = faq.filter((x) => x.id !== id);
    setFaq(next);
    writeJsonStorage(SHREEWEB_CMS_FAQ_KEY, next);
  };

  return (
    <div className={cmsTheme.pageWrap}>
      <form onSubmit={saveSocial} className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Social links</h2>
        <p className="text-sm text-stone-600">Matches the Socials page intent — wire these URLs to your public components when ready.</p>
        <div className="grid w-full min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {['facebook', 'instagram', 'tiktok'].map((key) => (
            <div key={key} className="space-y-3">
              <CmsRichTextEditor
                label={`${key} label`}
                value={social[`${key}Label`]}
                onChange={(html) => setSocial((s) => ({ ...s, [`${key}Label`]: html }))}
                placeholder="Display name"
                minHeight="sm"
              />
              <div>
                <label className={cmsTheme.label}>URL</label>
                <input
                  type="url"
                  className={cmsTheme.input}
                  value={social[`${key}Url`]}
                  onChange={(e) => setSocial((s) => ({ ...s, [`${key}Url`]: e.target.value }))}
                  placeholder="https://"
                />
              </div>
            </div>
          ))}
        </div>
        <button type="submit" className={cmsTheme.btnPrimary}>
          Save socials
        </button>
        {saved ? <span className="text-sm text-amber-800"> Saved.</span> : null}
      </form>

      <form onSubmit={addFaq} className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <h2 className={`${cmsTheme.title} text-lg`}>FAQ entries</h2>
        <CmsRichTextEditor label="Question" value={q} onChange={setQ} placeholder="FAQ question" minHeight="sm" />
        <CmsRichTextEditor label="Answer" value={a} onChange={setA} placeholder="Rich answer — lists, links, quotes" minHeight="lg" />
        <button type="submit" className={cmsTheme.btnPrimary}>
          Add FAQ
        </button>
      </form>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Saved FAQ ({faq.length})</h2>
        <ul className="mt-4 divide-y divide-stone-200">
          {faq.length === 0 ? <li className="py-4 text-sm text-stone-500">No FAQ items yet.</li> : null}
          {faq.map((item) => (
            <li key={item.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:justify-between">
              <div className="min-w-0 flex-1">
                <CmsHtmlPreview html={item.q} className="font-medium text-stone-900" />
                <CmsHtmlPreview html={item.a} className="mt-1 text-sm text-stone-600" />
              </div>
              <button type="button" className={cmsTheme.btnGhost} onClick={() => removeFaq(item.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
