/**
 * Shopify Storefront API (Cart) — used so checkout opens with line items populated.
 * Buy Button "checkout" destination can land on an empty cart; Cart API + checkoutUrl does not.
 *
 * Price matching assumes amounts are in the store’s currency (USD for this project).
 */

import { resolveShopifyProductIdForOffering } from './bookingPlan.js';

const STOREFRONT_API_VERSION = '2024-10';
const MAX_PRODUCTS_TO_SCAN = 120;

function normalizeShopDomain(domain) {
  return String(domain || '')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
}

function productGid(numericProductId) {
  return `gid://shopify/Product/${numericProductId}`;
}

function variantGid(numericOrGid) {
  const s = String(numericOrGid);
  if (s.startsWith('gid://')) return s;
  return `gid://shopify/ProductVariant/${s}`;
}

async function storefrontGraphql(domain, storefrontAccessToken, query, variables) {
  const shop = normalizeShopDomain(domain);
  const url = `https://${shop}/api/${STOREFRONT_API_VERSION}/graphql.json`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.errors?.[0]?.message || `Shopify HTTP ${res.status}`);
  }
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }
  return json.data;
}

const PRODUCT_VARIANTS_QUERY = `
  query ProductForCheckout($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      variants(first: 25) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

function pickVariant(product) {
  const nodes = product?.variants?.nodes || [];
  if (!nodes.length) return null;
  const available = nodes.find((v) => v.availableForSale);
  return available || nodes[0];
}

function gidToNumericProductId(gid) {
  if (!gid || typeof gid !== 'string') return '';
  const tail = gid.split('/').pop();
  return tail && /^\d+$/.test(tail) ? tail : '';
}

function minVariantPriceAmount(variants) {
  const nodes = variants?.nodes || variants || [];
  let min = Infinity;
  for (const v of nodes) {
    const n = Number(v?.price?.amount);
    if (!Number.isNaN(n) && n < min) min = n;
  }
  return min === Infinity ? 0 : min;
}

function isComplimentaryOffering(offering) {
  if (!offering) return false;
  const price = String(offering.price || '').toLowerCase();
  if (/complimentary|free(\s|$)|^\s*\$?\s*0(\.00)?\s*$/i.test(price)) return true;
  if (/discovery/i.test(offering.title || '') && !/\$[1-9]/.test(offering.price || '')) return true;
  return false;
}

function offeringMatchTokens(offering) {
  const blob = [offering?.title, offering?.duration, offering?.subtitle, offering?.category]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  const tokens = new Set();
  for (const w of blob.split(/[^a-z0-9]+/)) {
    if (w.length > 2) tokens.add(w);
  }
  for (const n of blob.match(/\d+/g) || []) {
    if (n.length <= 3) tokens.add(n);
  }
  if (/single\s*session/i.test(offering?.title || '')) {
    ['energetic', 'alignment'].forEach((t) => tokens.add(t));
  }
  if (/extended/i.test(offering?.title || '')) {
    tokens.add('extended');
    tokens.add('90');
  }
  if (/monthly/i.test(offering?.title || '') || /monthly/i.test(offering?.subtitle || '')) {
    ['monthly', 'month', 'subscription', 'recurring', 'ongoing', 'support', 'package'].forEach((t) =>
      tokens.add(t)
    );
  }
  if (/realignment/i.test(offering?.title || '')) {
    ['realignment', 'program', 'alignment', 'shift', 'container', 'structured', 'sessions'].forEach((t) =>
      tokens.add(t)
    );
  }
  if (/transformation/i.test(offering?.title || '')) {
    ['transformation', 'program', 'journey', 'deep', 'comprehensive', 'sessions'].forEach((t) =>
      tokens.add(t)
    );
  }
  if (offering?.category === 'recurring') {
    ['monthly', 'recurring', 'subscription', 'ongoing'].forEach((t) => tokens.add(t));
  }
  if (offering?.category === 'program') {
    ['program', 'package', 'container', 'sessions'].forEach((t) => tokens.add(t));
  }
  for (const n of (offering?.duration || '').match(/\d+/g) || []) {
    tokens.add(n);
  }
  return [...tokens];
}

function scoreProductForOffering(productTitle, tokens) {
  const pt = String(productTitle || '').toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (pt.includes(t)) score += t.length >= 4 ? 4 : t.length >= 3 ? 3 : 2;
  }
  return score;
}

/** The common $77 “single alignment / 90 min” SKU — matches too many offerings via generic words like “alignment”. */
function isGenericSingleAlignmentProduct(productTitle) {
  const t = String(productTitle || '').toLowerCase();
  return (
    (/single\s+energetic\s+alignment/i.test(t) || /energetic\s+alignment\s+session/i.test(t)) &&
    (/90|ninety/i.test(t) || /minutes/i.test(t))
  );
}

function isProgramOrMonthlyOffering(offering) {
  if (!offering) return false;
  if (offering.category === 'program' || offering.category === 'recurring') return true;
  const title = offering.title || '';
  return /monthly|realignment|transformation/i.test(title);
}

function isExtendedSessionOffering(offering) {
  return /extended/i.test(offering?.title || '');
}

function isSingleSessionOffering(offering) {
  const t = offering?.title || '';
  return /single\s*session/i.test(t) && !/extended/i.test(t);
}

/**
 * Skip matching everyone to the generic $77 alignment session.
 */
function shouldSkipGenericSingleProduct(node, offering, targetUsd) {
  const title = node.title || '';
  if (!isGenericSingleAlignmentProduct(title)) return false;

  if (isProgramOrMonthlyOffering(offering)) return true;

  if (isExtendedSessionOffering(offering)) return false;

  if (isSingleSessionOffering(offering) && targetUsd != null && targetUsd > 0) {
    const minPrice = minVariantPriceAmount(node.variants);
    const rel = Math.abs(minPrice - targetUsd) / targetUsd;
    if (rel > 0.15) return true;
  }

  return false;
}

/** Largest currency-like number in the CMS price string (USD, e.g. $320, $160 / month → 320 / 160). */
function parsePrimaryPriceUsd(priceStr) {
  const s = String(priceStr || '');
  const re = /\$?\s*([\d,]+(?:\.\d{1,2})?)/g;
  const nums = [];
  let m;
  while ((m = re.exec(s)) !== null) {
    const n = parseFloat(m[1].replace(/,/g, ''), 10);
    if (!Number.isNaN(n) && n >= 1) nums.push(n);
  }
  if (!nums.length) return null;
  return Math.max(...nums);
}

/** 0–100, higher when variant min price is close to the CMS offering price (within ~25%). */
function priceProximityScore(minPrice, targetUsd) {
  if (targetUsd == null || targetUsd <= 0 || minPrice <= 0) return 0;
  const rel = Math.abs(minPrice - targetUsd) / targetUsd;
  if (rel > 0.25) return 0;
  return Math.round(100 * (1 - rel / 0.25));
}

const PRODUCTS_PAGE = `
  query ProductsForCheckoutMatch($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          variants(first: 15) {
            nodes {
              id
              availableForSale
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

async function fetchProductNodesForMatching(domain, token) {
  const nodes = [];
  let after = null;
  let guard = 0;
  while (nodes.length < MAX_PRODUCTS_TO_SCAN && guard < 15) {
    guard += 1;
    const data = await storefrontGraphql(domain, token, PRODUCTS_PAGE, {
      first: Math.min(50, MAX_PRODUCTS_TO_SCAN - nodes.length),
      after,
    });
    const conn = data?.products;
    const edges = conn?.edges || [];
    for (const e of edges) {
      if (e?.node) nodes.push(e.node);
    }
    if (!conn?.pageInfo?.hasNextPage || !conn.pageInfo.endCursor) break;
    after = conn.pageInfo.endCursor;
  }
  return nodes;
}

const MIN_TITLE_SCORE = 7;
const MIN_COMBINED_SCORE = 62;
const STRONG_PRICE_SCORE = 72;

function pickBestCatalogMatch(catalog, offering, tokens, targetUsd) {
  let best = null;
  let bestCombined = -1;

  for (const node of catalog) {
    const minPrice = minVariantPriceAmount(node.variants);
    if (minPrice <= 0) continue;
    const title = node.title || '';
    if (/discovery/i.test(title) && minPrice < 0.01) continue;

    if (shouldSkipGenericSingleProduct(node, offering, targetUsd)) {
      continue;
    }

    const titleScore = tokens.length ? scoreProductForOffering(title, tokens) : 0;
    const priceScore = priceProximityScore(minPrice, targetUsd);
    const combined = titleScore * 14 + priceScore;

    const strongTitle = titleScore >= MIN_TITLE_SCORE;
    const strongPrice = priceScore >= STRONG_PRICE_SCORE;
    const okCombo =
      combined >= MIN_COMBINED_SCORE &&
      (titleScore >= 8 || priceScore >= 18 || strongPrice);
    const weakTitlePlusPrice = titleScore >= 5 && priceScore >= 58;

    if (!(strongTitle || strongPrice || okCombo || weakTitlePlusPrice)) continue;

    if (combined > bestCombined) {
      bestCombined = combined;
      best = node;
    }
  }

  if (!best) return null;
  const numericId = gidToNumericProductId(best.id);
  return numericId ? { numericId, title: best.title, score: bestCombined } : null;
}

/**
 * Picks a paid Shopify product: title token match and/or price proximity to the CMS offering.
 */
async function findBestShopifyProductForOffering(domain, token, offering) {
  const tokens = offeringMatchTokens(offering);
  const targetUsd = parsePrimaryPriceUsd(offering?.price);
  if (tokens.length === 0 && (targetUsd == null || targetUsd <= 0)) return null;

  let catalog;
  try {
    catalog = await fetchProductNodesForMatching(domain, token);
  } catch (e) {
    console.warn('Shopify catalog fetch for offering match:', e);
    return null;
  }

  return pickBestCatalogMatch(catalog, offering, tokens, targetUsd);
}

/**
 * Resolves product + variant for checkout: explicit DB id, complimentary embed, or catalog match for paid.
 */
export async function fetchCheckoutInfoForOffering(
  domain,
  storefrontAccessToken,
  { offering, embedProductId, preferredVariantGidOrNumeric }
) {
  const preferredVariant = preferredVariantGidOrNumeric || undefined;

  if (!offering) {
    return fetchProductCheckoutInfo(domain, storefrontAccessToken, embedProductId, preferredVariant);
  }

  const explicitRaw = offering.shopifyProductId || offering.shopify_product_id;
  if (explicitRaw && String(explicitRaw).trim()) {
    return fetchProductCheckoutInfo(
      domain,
      storefrontAccessToken,
      String(explicitRaw).trim(),
      preferredVariant
    );
  }

  if (isComplimentaryOffering(offering)) {
    return fetchProductCheckoutInfo(domain, storefrontAccessToken, embedProductId, preferredVariant);
  }

  const slugOrMapId = resolveShopifyProductIdForOffering(offering, embedProductId);
  if (slugOrMapId !== embedProductId) {
    return fetchProductCheckoutInfo(domain, storefrontAccessToken, slugOrMapId, preferredVariant);
  }

  try {
    const match = await findBestShopifyProductForOffering(domain, storefrontAccessToken, offering);
    if (match?.numericId) {
      const info = await fetchProductCheckoutInfo(
        domain,
        storefrontAccessToken,
        match.numericId,
        preferredVariant
      );
      const amt = Number(info.priceAmount);
      if (!Number.isNaN(amt) && amt > 0) {
        return info;
      }
    }
  } catch (e) {
    console.warn('Shopify offering→product match failed:', e);
  }

  return fetchProductCheckoutInfo(domain, storefrontAccessToken, embedProductId, preferredVariant);
}

/**
 * @param {string} domain — e.g. yxpnpq-d0.myshopify.com
 * @param {string} storefrontAccessToken
 * @param {string} numericProductId — Admin REST style id from Buy Button embed
 * @param {string} [preferredVariantGidOrNumeric] — optional variant from CMS/DB
 */
export async function fetchProductCheckoutInfo(domain, storefrontAccessToken, numericProductId, preferredVariantGidOrNumeric) {
  const data = await storefrontGraphql(domain, storefrontAccessToken, PRODUCT_VARIANTS_QUERY, {
    id: productGid(numericProductId),
  });

  const product = data?.product;
  if (!product) {
    throw new Error('Product not found in Shopify. Check the product id in your embed.');
  }

  let variant = null;
  if (preferredVariantGidOrNumeric) {
    const want = variantGid(preferredVariantGidOrNumeric);
    variant = product.variants.nodes.find((v) => v.id === want) || null;
  }
  if (!variant) {
    variant = pickVariant(product);
  }
  if (!variant) {
    throw new Error('No variants available for this product.');
  }

  return {
    productTitle: product.title,
    variantId: variant.id,
    variantTitle: variant.title,
    availableForSale: variant.availableForSale,
    priceAmount: variant.price?.amount,
    currencyCode: variant.price?.currencyCode,
  };
}

const CART_CREATE_WITH_LINES = `
  mutation CartCreateWithLines($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

function truncateAttr(value, maxLen) {
  const s = String(value ?? '').trim();
  if (!s) return '';
  if (s.length <= maxLen) return s;
  return `${s.slice(0, Math.max(0, maxLen - 1))}…`;
}

/**
 * Line item properties shown on Shopify checkout / order (CMS offering context).
 */
export function buildOfferingLineAttributes(offering) {
  if (!offering || typeof offering !== 'object') return [];
  const attrs = [];
  if (offering.title) {
    attrs.push({ key: 'Service', value: truncateAttr(offering.title, 255) });
  }
  if (offering.duration) {
    attrs.push({ key: 'Duration', value: truncateAttr(offering.duration, 120) });
  }
  if (offering.price) {
    attrs.push({ key: 'Listed_price_USD', value: truncateAttr(offering.price, 120) });
  }
  return attrs;
}

/**
 * Creates a cart with line items in one request (more reliable than empty cart + lines add).
 * @param {object} [options]
 * @param {Array<{key: string, value: string}>} [options.lineAttributes] — shown on checkout as line properties
 * @param {object} [options.offering] — used for line attributes when lineAttributes omitted
 */
export async function createCheckoutUrlForVariant(
  domain,
  storefrontAccessToken,
  variantGid,
  quantity = 1,
  options = {}
) {
  const qty = Math.max(1, Math.floor(Number(quantity)) || 1);
  const lineAttributes =
    options.lineAttributes?.length > 0
      ? options.lineAttributes
      : buildOfferingLineAttributes(options.offering);

  const line = {
    merchandiseId: variantGid,
    quantity: qty,
    ...(lineAttributes.length > 0 ? { attributes: lineAttributes } : {}),
  };

  const input = {
    lines: [line],
  };

  const data = await storefrontGraphql(domain, storefrontAccessToken, CART_CREATE_WITH_LINES, { input });
  const cartCreate = data?.cartCreate;
  const err = cartCreate?.userErrors?.[0];
  if (err?.message) {
    throw new Error(err.message);
  }

  const cart = cartCreate?.cart;
  const checkoutUrl = cart?.checkoutUrl;
  const totalQuantity = cart?.totalQuantity ?? 0;

  if (!checkoutUrl) {
    throw new Error('Shopify did not return a checkout URL.');
  }
  if (totalQuantity < 1) {
    throw new Error('Checkout cart has no items. Try again, or set the Shopify product on this offering in CMS.');
  }

  return checkoutUrl;
}
