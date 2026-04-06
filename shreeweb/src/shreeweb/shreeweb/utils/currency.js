/**
 * All amounts on this site are US dollars (USD), matching Shopify when the store uses USD.
 */

export const APP_CURRENCY = 'USD';
export const APP_LOCALE = 'en-US';

/**
 * @param {string|number} amount — numeric amount in USD (e.g. variant price from Shopify)
 * @returns {string} e.g. "$77.00"
 */
export function formatUsd(amount) {
  if (amount == null || amount === '') return '';
  const n = Number(amount);
  if (Number.isNaN(n)) return '';
  try {
    return new Intl.NumberFormat(APP_LOCALE, {
      style: 'currency',
      currency: APP_CURRENCY,
    }).format(n);
  } catch {
    return '';
  }
}
