/** Public agency storefront paths — no custom domains (P3). Format: /s/{slug} */

export const normalizeAgencySlug = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)

export const parseStorefrontSlug = (pathname) => {
  const match = String(pathname || '').match(/^\/s\/([a-z0-9-]+)(?:\/|$)/i)
  return match ? normalizeAgencySlug(match[1]) : ''
}

/** Build a path under the current agency storefront, or a root path when no slug. */
export const storefrontPath = (slug, path = '/') => {
  const safeSlug = normalizeAgencySlug(slug)
  const clean =
    !path || path === '/'
      ? ''
      : path.startsWith('/')
        ? path
        : `/${path}`
  if (!safeSlug) return clean || '/'
  return `/s/${safeSlug}${clean}`
}

export const buildAbsoluteStorefrontUrl = (slug, origin) => {
  const base = String(origin || (typeof window !== 'undefined' ? window.location.origin : ''))
    .replace(/\/$/, '')
  const path = storefrontPath(slug)
  return path === '/' ? `${base}/` : `${base}${path}`
}

export const isStorefrontHomePath = (pathname) => {
  const p = String(pathname || '')
  return p === '/' || /^\/s\/[a-z0-9-]+\/?$/i.test(p)
}

export default {
  normalizeAgencySlug,
  parseStorefrontSlug,
  storefrontPath,
  buildAbsoluteStorefrontUrl,
  isStorefrontHomePath,
}
