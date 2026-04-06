import React, { useEffect, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import { SHREEWEB_CMS_EMBEDS_KEY, readJsonStorage, writeJsonStorage } from '../../lib/shreewebStorage';

const defaultEmbeds = {
  shopifyHtml: `<div id='product-component-1774716533863'></div><script type="text/javascript">/*<![CDATA[*/(function () {var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';if (window.ShopifyBuy) {if (window.ShopifyBuy.UI) {ShopifyBuyInit();} else {loadScript();}} else {loadScript();}function loadScript() {var script = document.createElement('script');script.async = true;script.src = scriptURL;(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);script.onload = ShopifyBuyInit;}function ShopifyBuyInit() {var client = ShopifyBuy.buildClient({domain: 'yxpnpq-d0.myshopify.com',storefrontAccessToken: '4af1e40438135ba379f6f66ab171c799',});ShopifyBuy.UI.onReady(client).then(function (ui) {ui.createComponent('product', {id: '7675570454624',node: document.getElementById('product-component-1774716533863'),moneyFormat: '%24%7B%7Bamount%7D%7D',options: {"product": {"styles": {"product": {"@media (min-width: 601px)": {"max-width": "calc(25% - 20px)","margin-left": "20px","margin-bottom": "50px"}}},"text": {"button": "Add to cart"}},"productSet": {"styles": {"products": {"@media (min-width: 601px)": {"margin-left": "-20px"}}}},"modalProduct": {"contents": {"img": false,"imgWithCarousel": true,"button": false,"buttonWithQuantity": true},"styles": {"product": {"@media (min-width: 601px)": {"max-width": "100%","margin-left": "0px","margin-bottom": "0px"}}},"text": {"button": "Add to cart"}},"option": {},"cart": {"text": {"total": "Subtotal","button": "Checkout"}},"toggle": {}},});});}})();/*]]>*/</script>`,
  calendarHtml: '',
};

export default function CmsEmbeds() {
  const [form, setForm] = useState(defaultEmbeds);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const e = readJsonStorage(SHREEWEB_CMS_EMBEDS_KEY, null);
    if (e && typeof e === 'object') {
      setForm((f) => ({ ...f, ...e }));
    } else {
      // Initialize with default Shopify embed if nothing saved
      setForm(defaultEmbeds);
      writeJsonStorage(SHREEWEB_CMS_EMBEDS_KEY, defaultEmbeds);
    }
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
