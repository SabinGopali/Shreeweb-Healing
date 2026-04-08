import React, { useEffect, useState } from 'react';
import { SHREEWEB_CMS_EMBEDS_KEY, readJsonStorage } from '../lib/shreewebStorage';
import {
  fetchCheckoutInfoForOffering,
  createCheckoutUrlForVariant,
} from '../utils/shopifyStorefront';
import { formatUsd } from '../utils/currency';

// Default Shopify embed code (domain, token, product id only — checkout uses Storefront Cart API)
const DEFAULT_SHOPIFY_HTML = `<div id='product-component-1774716533863'></div><script type="text/javascript">/*<![CDATA[*/(function () {var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';if (window.ShopifyBuy) {if (window.ShopifyBuy.UI) {ShopifyBuyInit();} else {loadScript();}} else {loadScript();}function loadScript() {var script = document.createElement('script');script.async = true;script.src = scriptURL;(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);script.onload = ShopifyBuyInit;}function ShopifyBuyInit() {var client = ShopifyBuy.buildClient({domain: 'yxpnpq-d0.myshopify.com',storefrontAccessToken: '4af1e40438135ba379f6f66ab171c799',});ShopifyBuy.UI.onReady(client).then(function (ui) {ui.createComponent('product', {id: '7675570454624',node: document.getElementById('product-component-1774716533863'),moneyFormat: '%24%7B%7Bamount%7D%7D',options: {"product": {"styles": {"product": {"@media (min-width: 601px)": {"max-width": "calc(25% - 20px)","margin-left": "20px","margin-bottom": "50px"}}},"text": {"button": "Add to cart"}},"productSet": {"styles": {"products": {"@media (min-width: 601px)": {"margin-left": "-20px"}}}},"modalProduct": {"contents": {"img": false,"imgWithCarousel": true,"button": false,"buttonWithQuantity": true},"styles": {"product": {"@media (min-width: 601px)": {"max-width": "100%","margin-left": "0px","margin-bottom": "0px"}}},"text": {"button": "Add to cart"}},"option": {},"cart": {"text": {"total": "Subtotal","button": "Checkout"}},"toggle": {}},});});}})();/*]]>*/</script>`;

function extractShopifyConfig(html) {
  try {
    const domainMatch = html.match(/domain:\s*['"]([^'"]+)['"]/);
    const tokenMatch = html.match(/storefrontAccessToken:\s*['"]([^'"]+)['"]/);
    const productMatch =
      html.match(/createComponent\s*\(\s*['"]product['"]\s*,\s*\{\s*id:\s*['"]?(\d{6,})['"]?/i) ||
      html.match(/\bid:\s*['"](\d{6,})['"]/);

    if (domainMatch && tokenMatch && productMatch) {
      return {
        domain: domainMatch[1],
        storefrontAccessToken: tokenMatch[1],
        productId: productMatch[1],
      };
    }
    console.error('Failed to extract Shopify config from HTML');
    return null;
  } catch (err) {
    console.error('Error extracting Shopify config:', err);
    return null;
  }
}

/**
 * Price shown on “Proceed to checkout” — same string as CMS offerings (Service Offerings).
 * Falls back to Shopify variant amount formatted as USD when CMS has no price text.
 */
function displayPriceLabelForBooking(checkoutInfo, offering) {
  const cms = offering?.price != null ? String(offering.price).trim() : '';
  if (cms) return cms;

  if (!checkoutInfo) return '';
  const amt = Number(checkoutInfo.priceAmount);
  if (!Number.isNaN(amt)) {
    return formatUsd(amt);
  }
  return '';
}

export default function ShopifyCheckout({ offering }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [shopifyConfig, setShopifyConfig] = useState(null);
  const [checkoutInfo, setCheckoutInfo] = useState(null);

  useEffect(() => {
    const embedsData = readJsonStorage(SHREEWEB_CMS_EMBEDS_KEY, null);
    const shopifyHtml = embedsData?.shopifyHtml || DEFAULT_SHOPIFY_HTML;

    if (shopifyHtml && shopifyHtml.trim()) {
      const config = extractShopifyConfig(shopifyHtml);
      if (config) {
        setShopifyConfig(config);
      } else {
        setError('Invalid Shopify configuration');
        setLoading(false);
      }
    } else {
      setError('Shopify not configured');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!shopifyConfig) return undefined;

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      setCheckoutInfo(null);

      const preferredVariant =
        offering && (offering.shopifyVariantId || offering.shopify_variant_id);

      try {
        const info = await fetchCheckoutInfoForOffering(
          shopifyConfig.domain,
          shopifyConfig.storefrontAccessToken,
          {
            offering,
            embedProductId: shopifyConfig.productId,
            preferredVariantGidOrNumeric: preferredVariant || undefined,
          }
        );
        if (!cancelled) {
          setCheckoutInfo(info);
        }
      } catch (e) {
        console.error('Shopify product fetch:', e);
        if (!cancelled) {
          setError(e?.message || 'Could not load product from Shopify.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [shopifyConfig, offering]);

  const handleProceed = async () => {
    if (!shopifyConfig || !checkoutInfo?.variantId) return;
    setSubmitting(true);
    setError(null);
    try {
      const url = await createCheckoutUrlForVariant(
        shopifyConfig.domain,
        shopifyConfig.storefrontAccessToken,
        checkoutInfo.variantId,
        1,
        { offering }
      );
      window.location.assign(url);
    } catch (e) {
      console.error('Shopify checkout:', e);
      setError(e?.message || 'Could not start checkout.');
      setSubmitting(false);
    }
  };

  const priceLabel = displayPriceLabelForBooking(checkoutInfo, offering);

  // Check if offering has discount pricing
  const hasDiscount = offering?.hasDiscount && offering?.originalPrice && offering?.discountedPrice;

  if (error && !checkoutInfo) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-sm text-red-800 mb-4">{error}</p>
        <p className="text-xs text-red-600">
          Please configure Shopify in CMS → Third-party Integrations (domain, Storefront token, product id in the embed).
        </p>
      </div>
    );
  }

  return (
    <div className="shopify-checkout-wrapper relative space-y-3">
      {loading ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white/60 p-8 text-center min-h-[72px]"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-stone-300 border-t-amber-600 mb-3" />
          <p className="text-sm text-stone-600">Loading product from Shopify…</p>
        </div>
      ) : null}

      {checkoutInfo && !loading ? (
        <p className="text-sm text-stone-600 text-center sm:text-left">
          <span className="font-medium text-stone-800">
            {offering?.title || checkoutInfo.productTitle}
          </span>
          {checkoutInfo.variantTitle && checkoutInfo.variantTitle !== 'Default Title' ? (
            <span className="text-stone-500"> — {checkoutInfo.variantTitle}</span>
          ) : null}
        </p>
      ) : null}

      {error && checkoutInfo ? (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">{error}</p>
      ) : null}

      {!loading && checkoutInfo ? (
        <button
          type="button"
          disabled={submitting || !checkoutInfo.availableForSale}
          onClick={handleProceed}
          className="w-full min-h-[56px] inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 px-10 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-amber-700 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {submitting ? (
            <>
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Opening secure checkout…
            </>
          ) : !checkoutInfo.availableForSale ? (
            'Currently unavailable'
          ) : (
            <>
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="flex items-center gap-2">
                Proceed to Checkout —
                {hasDiscount ? (
                  <>
                    <span className="line-through opacity-70">{offering.originalPrice}</span>
                    <span className="font-bold">{offering.discountedPrice}</span>
                  </>
                ) : (
                  <span>{priceLabel || ''}</span>
                )}
              </span>
            </>
          )}
        </button>
      ) : null}
    </div>
  );
}
