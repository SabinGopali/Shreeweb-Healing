import React, { useEffect, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import SingleImageUploader from '../components/ImageUploader';

function uid() {
  return `nm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function CmsNavbarMenu() {
  const [items, setItems] = useState([]);
  const [brand, setBrand] = useState({
    logoText: 'J',
    logoImageUrl: '',
    brandTitle: 'JAPANDI',
    brandSubtitle: 'Energetic Alignment',
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
        setItems(Array.isArray(data.data?.navbarItems) ? data.data.navbarItems : []);
        if (data.data?.navbarBrand && typeof data.data.navbarBrand === 'object') {
          setBrand((prev) => ({ ...prev, ...data.data.navbarBrand }));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const update = (id, key, value) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, [key]: value } : x)));
  };

  const add = () => {
    setItems((prev) => [
      ...prev,
      { id: uid(), label: '', url: '', external: false, newTab: false, order: prev.length },
    ]);
  };

  const remove = (id) => {
    setItems((prev) => prev.filter((x) => x.id !== id).map((x, i) => ({ ...x, order: i })));
  };

  const move = (id, dir) => {
    const idx = items.findIndex((x) => x.id === id);
    if (idx === -1) return;
    const next = dir === 'up' ? idx - 1 : idx + 1;
    if (next < 0 || next >= items.length) return;
    const arr = [...items];
    [arr[idx], arr[next]] = [arr[next], arr[idx]];
    setItems(arr.map((x, i) => ({ ...x, order: i })));
  };

  const save = async () => {
    try {
      setSaving(true);
      const res = await fetch('/backend/shreeweb-navigation-menus/navbar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ navbarItems: items, navbarBrand: brand }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) throw new Error(data?.message || 'Failed to save navbar menu');
      setItems(Array.isArray(data.data?.navbarItems) ? data.data.navbarItems : []);
      if (data.data?.navbarBrand && typeof data.data.navbarBrand === 'object') {
        setBrand((prev) => ({ ...prev, ...data.data.navbarBrand }));
      }
    } catch (e) {
      alert(e?.message || 'Failed to save navbar menu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={cmsTheme.pageWrap}>
        <p className="text-stone-600">Loading navbar menu...</p>
      </div>
    );
  }

  return (
    <div className={cmsTheme.pageWrap}>
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <div className="flex items-center justify-between">
          <h2 className={`${cmsTheme.title} text-lg`}>Navbar Brand</h2>
        </div>

        <SingleImageUploader
          image={brand.logoImageUrl}
          onChange={(url) => setBrand((prev) => ({ ...prev, logoImageUrl: url }))}
          label="Logo Image"
          accept="image/*"
          uploadText="Upload Logo Image"
          description="Click to browse or drag and drop your logo"
          recommendation="High-quality logo images • PNG, JPG, GIF, SVG"
          previewAlt="Navbar logo preview"
          successMessage="Logo uploaded successfully"
          successDescription="This logo will be displayed in the navbar"
        />
        <p className="text-xs text-stone-500">If no image is uploaded, the logo text below will be displayed.</p>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className={cmsTheme.label}>Logo Text (Fallback)</label>
            <input className={cmsTheme.input} value={brand.logoText} onChange={(e) => setBrand((p) => ({ ...p, logoText: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className={cmsTheme.label}>Brand Title</label>
            <input className={cmsTheme.input} value={brand.brandTitle} onChange={(e) => setBrand((p) => ({ ...p, brandTitle: e.target.value }))} />
          </div>
        </div>

        <div>
          <label className={cmsTheme.label}>Brand Subtitle</label>
          <input className={cmsTheme.input} value={brand.brandSubtitle} onChange={(e) => setBrand((p) => ({ ...p, brandSubtitle: e.target.value }))} />
        </div>

        <div className="flex items-center justify-between">
          <h2 className={`${cmsTheme.title} text-lg`}>Navbar Menu Items ({items.length})</h2>
          <button type="button" onClick={add} className={cmsTheme.btnGhost}>Add Item</button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-stone-200 bg-white/80 p-4 grid gap-3 md:grid-cols-5">
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
              </div>
              <div className="flex items-end justify-end gap-2">
                <button type="button" className={cmsTheme.btnGhost} onClick={() => move(item.id, 'up')} disabled={index === 0}>↑</button>
                <button type="button" className={cmsTheme.btnGhost} onClick={() => move(item.id, 'down')} disabled={index === items.length - 1}>↓</button>
                <button type="button" className={cmsTheme.btnGhost} onClick={() => remove(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={save} className={cmsTheme.btnPrimary} disabled={saving}>
            {saving ? 'Saving...' : 'Save Navbar Menu'}
          </button>
        </div>
      </div>
    </div>
  );
}
