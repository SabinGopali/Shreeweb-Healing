import React, { useState, useEffect } from 'react';
import {
  fetchCheckoutInfoForOffering,
  createCheckoutUrlForVariant,
} from '../utils/shopifyStorefront';

export default function ShopifyCheckout({ offering }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [shopifyConfig, setShopifyConfig] = useState(null);
  const [checkoutInfo, setCheckoutInfo] = useState(null);

  // Check if offering has discount pricing
  const hasDiscount = offering?.hasDiscount && offering?.originalPrice && offering?.discountedPrice;

  useEffect(() => {
    // Extract Shopify config from embed code or use defaults
    if (!offering) {
      setError('No offering selected');
      setLoading(false);
      return;
    }

    let shopifyDomain = 'yxpnpq-d0.myshopify.com'; // Default domain
    let storefrontAccessToken = '4af1e40438135ba379f6f66ab171c799'; // Default token
    let productId = offering.shopifyProductId || '';

    // Try to extract from embed code if available
    if (offering.shopifyBuyButtonEmbed) {
      const domainMatch = offering.shopifyBuyButtonEmbed.match(/domain:\s*['"]([^'"]+)['"]/);
      const tokenMatch = offering.shopifyBuyButtonEmbed.match(/storefrontAccessToken:\s*['"]([^'"]+)['"]/);
      const productMatch = offering.shopifyBuyButtonEmbed.match(/id:\s*['"]?(\d{6,})['"]?/);

      if (domainMatch) shopifyDomain = domainMatch[1];
      if (tokenMatch) storefrontAccessToken = tokenMatch[1];
      if (productMatch && !productId) productId = productMatch[1];
    }

    if (!productId && !offering.shopifyVariantId) {
      setError('This offering is not configured for checkout. Please contact support.');
      setLoading(false);
      return;
    }

    setShopifyConfig({
      domain: shopifyDomain,
      storefrontAccessToken: storefrontAccessToken,
      productId: productId,
    });
  }, [offering]);

  useEffect(() => {
    if (!shopifyConfig) return;

    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setCheckoutInfo(null);

      const preferredVariant = offering?.shopifyVariantId || offering?.shopify_variant_id;

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
          console.log('Shopify product loaded:', info);
        }
      } catch (e) {
        console.error('Shopify product fetch error:', e);
        if (!cancelled) {
          setError(e?.message || 'Could not load product from Shopify.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [shopifyConfig, offering]);

  const handleCheckout = async () => {
    if (!shopifyConfig || !checkoutInfo?.variantId) {
      setError('Checkout information not available');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      console.log('Creating checkout with variant:', checkoutInfo.variantId);
      
      const checkoutUrl = await createCheckoutUrlForVariant(
        shopifyConfig.domain,
        shopifyConfig.storefrontAccessToken,
        checkoutInfo.variantId,
        1,
        { offering }
      );

      console.log('Redirecting to checkout:', checkoutUrl);
      window.location.href = checkoutUrl;
      
    } catch (e) {
      console.error('Shopify checkout error:', e);
      setError(e?.message || 'Could not start checkout. Please try again.');
      setSubmitting(false);
    }
  };

  if (error && !checkoutInfo) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <svg className="w-12 h-12 text-amber-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-sm text-amber-800 mb-4">{error}</p>
        <p className="text-xs text-amber-600">
          Please ensure the Shopify Product/Variant ID is correctly configured in the CMS.
        </p>
      </div>
    );
  }

  return (
    <div className="shopify-checkout-wrapper relative">
      {loading && (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white/60 p-8 text-center min-h-[72px]"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-stone-300 border-t-amber-600 mb-3" />
          <p className="text-sm text-stone-600">Loading product...</p>
        </div>
      )}

      {/* Price display if discount is enabled */}
      {hasDiscount && !loading && (
        <div className="mb-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl font-serif text-stone-500 line-through">
              {offering.originalPrice}
            </span>
            <span className="text-3xl font-serif text-amber-700 font-medium">
              {offering.discountedPrice}
            </span>
          </div>
          <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full border border-amber-200">
            Limited Time Offer
          </div>
        </div>
      )}

      {error && checkoutInfo && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 mb-4">
          {error}
        </p>
      )}

      {!loading && checkoutInfo && (
        <button
          type="button"
          onClick={handleCheckout}
          disabled={submitting || !checkoutInfo.availableForSale}
          className="w-full min-h-[56px] inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 px-10 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-amber-700 hover:to-amber-800 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {submitting ? (
            <>
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Opening checkout...
            </>
          ) : !checkoutInfo.availableForSale ? (
            'Currently unavailable'
          ) : (
            <>
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Checkout
            </>
          )}
        </button>
      )}
    </div>
  );
}
