/**
 * Resolve which offering the user selected from ?plan=…
 * Supports: MongoDB _id, legacy slug keys, and slugified titles (e.g. realignment-program).
 */

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Legacy ?plan= keys from older links (Hero, VideoSection, etc.) */
const LEGACY_PLAN_TITLE_TESTS = {
  discovery: (title) => /discovery/i.test(title),
  session: (title) => /single session|single energetic|alignment session/i.test(title) && !/extended|monthly|program/i.test(title),
  'single-session': (title) => /single session|single energetic|alignment session/i.test(title) && !/extended|monthly|program/i.test(title),
  'extended-session': (title) => /extended/i.test(title),
  'monthly-support': (title) => /monthly/i.test(title),
  'realignment-program': (title) => /realignment/i.test(title),
  'transformation-program': (title) => /transformation/i.test(title),
};

/**
 * Optional fallback Shopify Admin numeric product ids (when offering has no shopifyProductId in DB).
 * Keys: slugified offering title (see slugify()). Prefer CMS → Edit offering → Shopify fields.
 */
export const SHOPIFY_PRODUCT_ID_BY_OFFERING_SLUG = {
  // 'monthly-support': '',
  // 'realignment-program': '',
  // 'transformation-program': '',
  // 'single-session': '',
  // 'extended-session': '',
};

export function resolveShopifyProductIdForOffering(offering, defaultEmbedProductId) {
  const explicit = offering?.shopifyProductId || offering?.shopify_product_id;
  if (explicit && String(explicit).trim()) {
    return String(explicit).trim();
  }
  const slug = slugify(offering?.title || '');
  const mapped = SHOPIFY_PRODUCT_ID_BY_OFFERING_SLUG[slug];
  if (mapped && String(mapped).trim()) {
    return String(mapped).trim();
  }
  return defaultEmbedProductId;
}

export function resolveOfferingFromPlanParam(offerings, planParam) {
  if (!planParam || !Array.isArray(offerings) || offerings.length === 0) {
    return undefined;
  }

  const raw = String(planParam).trim();

  const byId = offerings.find((o) => String(o._id) === raw);
  if (byId) return byId;

  const legacyTest = LEGACY_PLAN_TITLE_TESTS[raw.toLowerCase()];
  if (legacyTest) {
    const hit = offerings.find((o) => legacyTest(o.title || ''));
    if (hit) return hit;
  }

  const wantSlug = raw.toLowerCase();
  const byTitleSlug = offerings.find((o) => slugify(o.title) === wantSlug);
  if (byTitleSlug) return byTitleSlug;

  const compact = wantSlug.replace(/-/g, '');
  const byTitleCompact = offerings.find((o) => slugify(o.title).replace(/-/g, '') === compact);
  if (byTitleCompact) return byTitleCompact;

  return undefined;
}

/**
 * Match CMS "additional programs" names to a real offering _id for booking links.
 */
export function findOfferingIdByProgramName(offerings, programName) {
  if (!Array.isArray(offerings) || !programName) return '';
  const n = String(programName).trim().toLowerCase();
  const exact = offerings.find((o) => (o.title || '').trim().toLowerCase() === n);
  if (exact) return String(exact._id);
  const first = n.split(/\s+/)[0];
  if (first.length >= 4) {
    const hit = offerings.find((o) => (o.title || '').toLowerCase().includes(first));
    if (hit) return String(hit._id);
  }
  return '';
}

export { slugify };
