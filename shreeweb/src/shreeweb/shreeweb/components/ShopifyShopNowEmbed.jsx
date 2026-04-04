import React, { useEffect, useState } from 'react';
import { SHREEWEB_CMS_EMBEDS_KEY, readJsonStorage } from '../lib/shreewebStorage';

// Fallback until CMS / env provides HTML
const SHOPIFY_EMBED_DEFAULT = `
<!-- Paste Shopify embed code here (or save in CMS → Shopify & calendar) -->
`;

export default function ShopifyShopNowEmbed() {
  const [html, setHtml] = useState(SHOPIFY_EMBED_DEFAULT);

  useEffect(() => {
    const e = readJsonStorage(SHREEWEB_CMS_EMBEDS_KEY, null);
    if (e && typeof e.shopifyHtml === 'string' && e.shopifyHtml.trim()) {
      setHtml(e.shopifyHtml);
    }
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/60 p-5 shadow-sm backdrop-blur">
      <h3 className="text-sm font-bold text-slate-900">Complete payment to unlock booking</h3>
      <p className="mt-1 text-sm text-slate-600">
        After payment, you’ll be redirected to the confirmation page to submit the intake form.
      </p>
      <div className="mt-4">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <p className="mt-4 text-xs text-slate-500">
        If you don’t have the embed code yet, keep this box here and paste it when available.
      </p>
    </div>
  );
}

