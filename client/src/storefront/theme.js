const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

export const DEFAULT_STOREFRONT_PRIMARY = '#8F1F1F'

export const normalizeHex = (value, fallback = '') => {
  const raw = String(value || '').trim()
  if (!HEX.test(raw)) return fallback
  if (raw.length === 4) {
    return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`.toLowerCase()
  }
  return raw.toLowerCase()
}

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

const toHex = ({ r, g, b }) =>
  `#${[r, g, b].map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('')}`

const mix = (hex, target, amount) => {
  const a = hexToRgb(hex)
  const b = hexToRgb(target)
  return toHex({
    r: a.r + (b.r - a.r) * amount,
    g: a.g + (b.g - a.g) * amount,
    b: a.b + (b.b - a.b) * amount,
  })
}

const luminance = (hex) => {
  const { r, g, b } = hexToRgb(hex)
  const lin = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

export const onColor = (hex) => (luminance(hex) > 0.42 ? '#161210' : '#ffffff')

export const applyStorefrontBrand = (profile) => {
  const root = document.documentElement
  const primary = normalizeHex(profile?.primaryBrandColor, DEFAULT_STOREFRONT_PRIMARY)
  const secondary = normalizeHex(profile?.secondaryBrandColor, mix(primary, '#0b0a09', 0.55))
  const dull = mix(primary, '#000000', 0.22)
  root.style.setProperty('--color-primary', primary)
  root.style.setProperty('--color-primary-dull', dull)
  root.style.setProperty('--sf-primary', primary)
  root.style.setProperty('--sf-primary-dull', dull)
  root.style.setProperty('--sf-on-primary', onColor(primary))
  root.style.setProperty('--sf-secondary', secondary)
  root.style.setProperty('--sf-on-secondary', onColor(secondary))
  root.style.setProperty('--sf-wash', `color-mix(in srgb, ${primary} 28%, transparent)`)
}

export const clearStorefrontBrand = (fallback = DEFAULT_STOREFRONT_PRIMARY) => {
  const root = document.documentElement
  root.style.setProperty('--color-primary', fallback)
  root.style.setProperty('--color-primary-dull', mix(fallback, '#000000', 0.22))
  ;[
    '--sf-primary',
    '--sf-primary-dull',
    '--sf-on-primary',
    '--sf-secondary',
    '--sf-on-secondary',
    '--sf-wash',
  ].forEach((key) => root.style.removeProperty(key))
}

export const vehicleImage = (car) =>
  car?.image || car?.images?.[0] || ''

export const vehicleGallery = (car) => {
  const list = [car?.image, ...(Array.isArray(car?.images) ? car.images : [])].filter(Boolean)
  return [...new Set(list)]
}
