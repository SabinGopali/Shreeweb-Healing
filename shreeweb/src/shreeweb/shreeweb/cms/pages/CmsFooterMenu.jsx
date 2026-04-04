import React, { useEffect, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';

function uid() {
  return `fm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function MenuGroup({ title, items, setItems }) {
  const update = (id, key, value) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, [key]: value } : x)));
  const add = () => setItems((prev) => [...prev, { id: uid(), label: '', url: '', external: false, newTab: false, order: prev.length }]);
  const remove = (id) => setItems((prev) => prev.filter((x) => x.id !== id).map((x, i) => ({ ...x, order: i })));

  return (
    <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
      <div className="flex items-center justify-between">
        <h2 className={`${cmsTheme.title} text-lg`}>{title} ({items.length})</h2>
        <button type="button" onClick={add} className={cmsTheme.btnGhost}>Add Item</button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-stone-200 bg-white/80 p-4 grid gap-3 md:grid-cols-4">
            <div>
              <label className={cmsTheme.label}>Label</label>
              <input className={cmsTheme.input} value={item.label} onChange={(e) => update(item.id, 'label', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className={cmsTheme.label}>URL</label>
              <input className={cmsTheme.input} value={item.url} onChange={(e) => update(item.id, 'url', e.target.value)} />
            </div>
            <div className="flex items-end gap-3">
              <label className="text-sm flex items-center gap-2">
                <input type="checkbox" checked={!!item.external} onChange={(e) => update(item.id, 'external', e.target.checked)} />
                External
              </label>
              <label className="text-sm flex items-center gap-2">
                <input type="checkbox" checked={!!item.newTab} onChange={(e) => update(item.id, 'newTab', e.target.checked)} />
                New Tab
              </label>
              <button type="button" className={cmsTheme.btnGhost} onClick={() => remove(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CmsFooterMenu() {
  const [quickLinks, setQuickLinks] = useState([]);
  const [connectLinks, setConnectLinks] = useState([]);
  const [footerBrand, setFooterBrand] = useState({
    logoText: 'J',
    brandTitle: 'JAPANDI',
    brandSubtitle: 'Energetic Alignment',
    description:
      'Energetic Alignment for Sustainable Expansion. A calm, structured approach to help you restore clarity and expand naturally through Pranic Healing sessions.',
    newsletterTitle: 'Stay Aligned',
    newsletterSubtitle: 'Get updates on new sessions and insights',
    newsletterPlaceholder: 'Your email',
    newsletterButtonText: 'Join',
    bottomText1: 'Made with intention',
    bottomText2: 'Designed for clarity',
    cmsLinkLabel: 'Content studio',
    copyrightSuffix: 'All rights reserved.',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/backend/shreeweb-navigation-menus', { credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        setQuickLinks(Array.isArray(data.data?.footerQuickLinks) ? data.data.footerQuickLinks : []);
        setConnectLinks(Array.isArray(data.data?.footerConnectLinks) ? data.data.footerConnectLinks : []);
        if (data.data?.footerBrand && typeof data.data.footerBrand === 'object') {
          setFooterBrand((prev) => ({ ...prev, ...data.data.footerBrand }));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      setSaving(true);
      const res = await fetch('/backend/shreeweb-navigation-menus/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          footerQuickLinks: quickLinks,
          footerConnectLinks: connectLinks,
          footerBrand: footerBrand,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) throw new Error(data?.message || 'Failed to save footer menu');
      setQuickLinks(Array.isArray(data.data?.footerQuickLinks) ? data.data.footerQuickLinks : []);
      setConnectLinks(Array.isArray(data.data?.footerConnectLinks) ? data.data.footerConnectLinks : []);
      if (data.data?.footerBrand && typeof data.data.footerBrand === 'object') {
        setFooterBrand((prev) => ({ ...prev, ...data.data.footerBrand }));
      }
    } catch (e) {
      alert(e?.message || 'Failed to save footer menu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={cmsTheme.pageWrap}>
        <p className="text-stone-600">Loading footer menu...</p>
      </div>
    );
  }

  return (
    <div className={cmsTheme.pageWrap}>
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4 mb-6`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Footer Content</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className={cmsTheme.label}>Logo Text</label>
            <input className={cmsTheme.input} value={footerBrand.logoText} onChange={(e) => setFooterBrand((p) => ({ ...p, logoText: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className={cmsTheme.label}>Brand Title</label>
            <input className={cmsTheme.input} value={footerBrand.brandTitle} onChange={(e) => setFooterBrand((p) => ({ ...p, brandTitle: e.target.value }))} />
          </div>
        </div>

        <div>
          <label className={cmsTheme.label}>Brand Subtitle</label>
          <input className={cmsTheme.input} value={footerBrand.brandSubtitle} onChange={(e) => setFooterBrand((p) => ({ ...p, brandSubtitle: e.target.value }))} />
        </div>

        <div>
          <label className={cmsTheme.label}>Description</label>
          <textarea className={`${cmsTheme.input} h-24 resize-none`} value={footerBrand.description} onChange={(e) => setFooterBrand((p) => ({ ...p, description: e.target.value }))} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={cmsTheme.label}>Newsletter Title</label>
            <input className={cmsTheme.input} value={footerBrand.newsletterTitle} onChange={(e) => setFooterBrand((p) => ({ ...p, newsletterTitle: e.target.value }))} />
          </div>
          <div>
            <label className={cmsTheme.label}>Newsletter Subtitle</label>
            <input className={cmsTheme.input} value={footerBrand.newsletterSubtitle} onChange={(e) => setFooterBrand((p) => ({ ...p, newsletterSubtitle: e.target.value }))} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={cmsTheme.label}>Email Placeholder</label>
            <input className={cmsTheme.input} value={footerBrand.newsletterPlaceholder} onChange={(e) => setFooterBrand((p) => ({ ...p, newsletterPlaceholder: e.target.value }))} />
          </div>
          <div>
            <label className={cmsTheme.label}>Join Button Text</label>
            <input className={cmsTheme.input} value={footerBrand.newsletterButtonText} onChange={(e) => setFooterBrand((p) => ({ ...p, newsletterButtonText: e.target.value }))} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={cmsTheme.label}>Bottom Text 1</label>
            <input className={cmsTheme.input} value={footerBrand.bottomText1} onChange={(e) => setFooterBrand((p) => ({ ...p, bottomText1: e.target.value }))} />
          </div>
          <div>
            <label className={cmsTheme.label}>Bottom Text 2</label>
            <input className={cmsTheme.input} value={footerBrand.bottomText2} onChange={(e) => setFooterBrand((p) => ({ ...p, bottomText2: e.target.value }))} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={cmsTheme.label}>CMS Link Label</label>
            <input className={cmsTheme.input} value={footerBrand.cmsLinkLabel} onChange={(e) => setFooterBrand((p) => ({ ...p, cmsLinkLabel: e.target.value }))} />
          </div>
          <div>
            <label className={cmsTheme.label}>Copyright Suffix</label>
            <input className={cmsTheme.input} value={footerBrand.copyrightSuffix} onChange={(e) => setFooterBrand((p) => ({ ...p, copyrightSuffix: e.target.value }))} />
          </div>
        </div>
      </div>

      <MenuGroup title="Footer Quick Links" items={quickLinks} setItems={setQuickLinks} />
      <MenuGroup title="Footer Connect Links" items={connectLinks} setItems={setConnectLinks} />
      <div className="flex items-center gap-3">
        <button type="button" onClick={save} className={cmsTheme.btnPrimary} disabled={saving}>
          {saving ? 'Saving...' : 'Save Footer Menu'}
        </button>
      </div>
    </div>
  );
}

