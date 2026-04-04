import React, { useEffect, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import { SHREEWEB_CMS_EMBEDS_KEY, readJsonStorage, writeJsonStorage } from '../../lib/shreewebStorage';

const defaultEmbeds = {
  shopifyHtml: '',
  calendarHtml: '',
};

export default function CmsEmbeds() {
  const [form, setForm] = useState(defaultEmbeds);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const e = readJsonStorage(SHREEWEB_CMS_EMBEDS_KEY, null);
    if (e && typeof e === 'object') setForm((f) => ({ ...f, ...e }));
  }, []);

  const save = (ev) => {
    ev.preventDefault();
    writeJsonStorage(SHREEWEB_CMS_EMBEDS_KEY, form);
    setSaved(true);
  };

  return (
    <form onSubmit={save} className={cmsTheme.pageWrap}>
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full text-sm text-stone-600`}>
        <strong className="text-stone-800">Raw HTML / scripts</strong> — Shopify and calendar fields stay as monospace text areas so pasted embed code is not altered by the rich editor. All other CMS pages use the advanced editor.
      </div>
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Shopify “Shop now”</h2>
        <p className="mt-1 text-sm text-stone-600">Pasted HTML is rendered on the booking flow when payment is required (see `ShopifyShopNowEmbed`).</p>
        <label className={`${cmsTheme.label} mt-4`}>Embed HTML</label>
        <textarea
          className={`${cmsTheme.input} min-h-[160px] font-mono text-xs`}
          value={form.shopifyHtml}
          onChange={(e) => {
            setForm((f) => ({ ...f, shopifyHtml: e.target.value }));
            setSaved(false);
          }}
          placeholder="<!-- Shopify embed -->"
        />
      </div>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Booking calendar</h2>
        <p className="mt-1 text-sm text-stone-600">Used after payment in `BookingCalendar`.</p>
        <label className={`${cmsTheme.label} mt-4`}>Iframe / script</label>
        <textarea
          className={`${cmsTheme.input} min-h-[160px] font-mono text-xs`}
          value={form.calendarHtml}
          onChange={(e) => {
            setForm((f) => ({ ...f, calendarHtml: e.target.value }));
            setSaved(false);
          }}
          placeholder="<!-- Calendly / Google Calendar embed -->"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={cmsTheme.btnPrimary}>
          Save embeds
        </button>
        {saved ? <span className="text-sm text-amber-800">Saved — refresh booking page to pick up changes.</span> : null}
      </div>
    </form>
  );
}
