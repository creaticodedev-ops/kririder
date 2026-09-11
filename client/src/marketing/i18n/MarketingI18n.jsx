import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ar } from './ar'
import { en } from './en'
import { es } from './es'
import { fr } from './fr'
import { getLocaleMeta, getNested, interpolate } from './locales'
import { LANG_CHANGE_EVENT, readStoredLocale, writeStoredLocale } from './localeSync'
import { saasArExtras, saasEsExtras, saasFrExtras } from './saasLocaleExtras'

const deepMerge = (target, source) => {
  if (source === undefined || source === null) return target
  if (Array.isArray(source)) return source
  if (typeof source !== 'object') return source
  const base = target && typeof target === 'object' && !Array.isArray(target) ? target : {}
  const out = { ...base }
  for (const key of Object.keys(source)) {
    out[key] = deepMerge(base[key], source[key])
  }
  return out
}

const esPatched = deepMerge(es, {
  cta: {
    demo: 'Solicitar una demo',
    whatsapp: 'Contactar por WhatsApp',
    whatsappShort: 'WhatsApp',
  },
  alts: {
    statistics: 'Estadísticas de vehículos RSZ CAR: ingresos y utilización',
  },
  saas: saasEsExtras,
})

const arPatched = deepMerge(ar, {
  cta: {
    demo: 'طلب عرض توضيحي',
    whatsapp: 'التواصل عبر واتساب',
    whatsappShort: 'واتساب',
  },
  alts: {
    statistics: 'إحصاءات مركبات RSZ CAR: الإيرادات والاستخدام',
  },
  saas: saasArExtras,
})

const frPatched = deepMerge(fr, {
  saas: saasFrExtras,
})

const dictionaries = { en, fr: frPatched, es: esPatched, ar: arPatched }

const MarketingI18nContext = createContext(null)

export const MarketingI18nProvider = ({ children }) => {
  const [locale, setLocaleState] = useState(readStoredLocale)
  const meta = getLocaleMeta(locale)

  const setLocale = (code) => {
    if (!dictionaries[code]) return
    setLocaleState(code)
    writeStoredLocale(code)
  }

  useEffect(() => {
    const onBridge = (event) => {
      const code = event?.detail?.code
      if (!dictionaries[code] || code === locale) return
      setLocaleState(code)
    }
    window.addEventListener(LANG_CHANGE_EVENT, onBridge)
    return () => window.removeEventListener(LANG_CHANGE_EVENT, onBridge)
  }, [locale])

  useEffect(() => {
    const html = document.documentElement
    const prevLang = html.lang
    const prevDir = html.getAttribute('dir') || 'ltr'
    html.lang = meta.htmlLang
    html.dir = meta.dir
    html.classList.toggle('mkt-rtl', meta.dir === 'rtl')
    return () => {
      html.lang = prevLang
      html.dir = prevDir
      html.classList.remove('mkt-rtl')
    }
  }, [meta.dir, meta.htmlLang])

  const value = useMemo(() => {
    const dict = dictionaries[locale] || en
    const lookup = (key) => {
      const local = getNested(dict, key)
      if (local !== undefined) return local
      return getNested(en, key)
    }
    const t = (key, vars = {}) => {
      const valueAt = lookup(key)
      if (typeof valueAt !== 'string') return ''
      return interpolate(valueAt, vars)
    }
    const ta = (key) => {
      const valueAt = lookup(key)
      return Array.isArray(valueAt) ? valueAt : []
    }
    return {
      locale,
      dir: meta.dir,
      isRtl: meta.dir === 'rtl',
      htmlLang: meta.htmlLang,
      ogLocale: meta.ogLocale,
      setLocale,
      t,
      ta,
    }
  }, [locale, meta.dir, meta.htmlLang, meta.ogLocale])

  return <MarketingI18nContext.Provider value={value}>{children}</MarketingI18nContext.Provider>
}

export const useMktI18n = () => {
  const ctx = useContext(MarketingI18nContext)
  if (!ctx) throw new Error('useMktI18n must be used within MarketingI18nProvider')
  return ctx
}

export default MarketingI18nProvider
