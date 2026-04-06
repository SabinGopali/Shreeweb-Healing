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

      {/* Shopify Redirect Script */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className={`${cmsTheme.title} text-lg`}>Shopify Order Status Redirect Script</h2>
            <p className="mt-1 text-sm text-stone-600">
              Copy this script and paste it into: <strong>Shopify Admin → Settings → Checkout → Order status page → Additional scripts</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const script = document.getElementById('shopify-redirect-script').textContent;
              navigator.clipboard.writeText(script);
              alert('Script copied to clipboard! Now paste it in Shopify Admin.');
            }}
            className={cmsTheme.btnGhost}
          >
            📋 Copy Script
          </button>
        </div>

        <div className="bg-stone-900 rounded-lg p-4 overflow-x-auto">
          <pre id="shopify-redirect-script" className="text-xs text-green-400 font-mono whitespace-pre-wrap">
{`{% if first_time_accessed %}
  <div id="redirect-banner" style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-left: 4px solid #f59e0b; border-radius: 8px; text-align: center;">
    <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 20px;">🎉 Payment Successful!</h3>
    <p style="margin: 0 0 15px 0; color: #78716c; font-size: 16px;">
      Now let's schedule your session...
    </p>
    <p style="margin: 0 0 15px 0; color: #57534e; font-size: 14px;">
      You'll be redirected automatically in <span id="countdown">3</span> seconds
    </p>
    <a href="https://omshreeguidance.com/shreeweb/booking-confirmation?order_id={{ order.id }}&order_number={{ order.order_number }}&email={{ order.email }}" 
       style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      Schedule Now →
    </a>
  </div>

  <script>
  (function() {
    console.log('🚀 Redirect script loaded');
    console.log('Order ID: {{ order.id }}');
    console.log('Order Number: {{ order.order_number }}');
    console.log('Email: {{ order.email }}');
    
    var countdown = 3;
    var countdownElement = document.getElementById('countdown');
    var redirectUrl = 'https://omshreeguidance.com/shreeweb/booking-confirmation?order_id={{ order.id }}&order_number={{ order.order_number }}&email={{ order.email }}';
    
    console.log('Redirect URL:', redirectUrl);
    console.log('Starting countdown...');
    
    var timer = setInterval(function() {
      countdown--;
      console.log('Countdown:', countdown);
      
      if (countdownElement) {
        countdownElement.textContent = countdown;
      }
      
      if (countdown <= 0) {
        clearInterval(timer);
        console.log('⏰ Countdown complete, redirecting now...');
        window.location.href = redirectUrl;
      }
    }, 1000);
    
    // Fallback safety redirect
    setTimeout(function() {
      console.log('⚠️ Fallback redirect triggered');
      window.location.href = redirectUrl;
    }, 5000);
  })();
  </script>
{% endif %}`}
          </pre>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded mb-4">
          <h3 className="font-semibold text-blue-900 mb-2">🐛 Debug Version (Use This First)</h3>
          <p className="text-sm text-blue-800 mb-2">
            This version includes console.log statements to help debug. After pasting in Shopify:
          </p>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Make a test purchase</li>
            <li>On the thank you page, press F12 to open browser console</li>
            <li>Look for messages starting with 🚀, ⏰, or ⚠️</li>
            <li>Share what you see in the console</li>
          </ol>
        </div>

        <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
          <h3 className="font-semibold text-amber-900 mb-2">📝 Setup Instructions:</h3>
          <ol className="text-sm text-amber-800 space-y-2 list-decimal list-inside">
            <li>Click "Copy Script" button above</li>
            <li>Go to Shopify Admin → Settings → Checkout</li>
            <li>Scroll to "Order status page" section</li>
            <li>Find "Additional scripts" text area</li>
            <li>Paste the script (replace any existing script)</li>
            <li>Click "Save" at the bottom</li>
            <li>Make a NEW test purchase (old orders won't work)</li>
            <li>Open browser console (F12) on thank you page</li>
          </ol>
          <p className="text-xs text-amber-700 mt-3 font-semibold">
            ⚠️ CRITICAL: You MUST make a NEW purchase after saving the script. Old thank you pages are cached.
          </p>
        </div>
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
