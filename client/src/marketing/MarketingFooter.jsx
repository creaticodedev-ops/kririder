import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BrandMark from './BrandMark'
import { DemoRequestCta, WhatsAppDemoCta } from './Ctas'
import { BRAND, demoWhatsAppHref } from './config'
import { useMktI18n } from './i18n/MarketingI18n'

const PRODUCT_LINKS = [
  { to: '/#capabilities', labelKey: 'footer.link.features' },
  { to: '/#product', labelKey: 'footer.link.fleet' },
  { to: '/#product', labelKey: 'footer.link.reservations' },
  { to: '/#product', labelKey: 'footer.link.contracts' },
  { to: '/#product', labelKey: 'footer.link.customers' },
  { to: '/#capabilities', labelKey: 'footer.link.analytics' },
]

const EXPLORE_LINKS = [
  { to: '/#product', labelKey: 'nav.product' },
  { to: '/#features', labelKey: 'nav.features' },
  { to: '/#pricing', labelKey: 'nav.pricing' },
  { to: '/#faq', labelKey: 'nav.faq' },
]

const COMPANY_LINKS = [
  { to: '/about', labelKey: 'nav.about' },
  { to: '/contact', labelKey: 'footer.contact' },
  { to: '/contact?intent=demo', labelKey: 'cta.demo' },
]

const LEGAL_LINKS = [
  { to: '/privacy', labelKey: 'footer.privacy' },
  { to: '/terms', labelKey: 'footer.terms' },
]

export const MarketingFooter = () => {
  const { t } = useMktI18n()
  const rootRef = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = rootRef.current
    if (!node) return undefined
    const reduce =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setInView(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  return (
    <footer ref={rootRef} className={`mkt-foot mkt-foot-pro${inView ? ' is-in' : ''}`}>
      <div className="mkt-foot-atmos" aria-hidden>
        <span className="mkt-foot-glow" />
        <span className="mkt-foot-gridlines" />
      </div>

      <div className="mkt-wrap mkt-foot-inner">
        <div className="mkt-foot-stage">
          <div className="mkt-foot-brand">
            <BrandMark variant="light" size="foot" className="mkt-foot-logo" />
            <p className="mkt-foot-statement">{t('footer.statement')}</p>
          </div>
          <div className="mkt-foot-stage-actions">
            <DemoRequestCta className="mkt-foot-demo" magnetic={false}>
              {t('cta.demo')}
            </DemoRequestCta>
            <WhatsAppDemoCta className="mkt-foot-wa">{t('footer.whatsappCta')}</WhatsAppDemoCta>
            <a className="mkt-foot-phone" href={demoWhatsAppHref()} target="_blank" rel="noopener noreferrer">
              +212 778616837
            </a>
          </div>
        </div>

        <div className="mkt-foot-divider" aria-hidden>
          <span />
        </div>

        <div className="mkt-foot-cols">
          <nav className="mkt-foot-col" aria-label={t('footer.product')}>
            <h2>{t('footer.product')}</h2>
            {PRODUCT_LINKS.map((item) => (
              <Link key={item.labelKey} to={item.to}>
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
          <nav className="mkt-foot-col" aria-label={t('footer.explore')}>
            <h2>{t('footer.explore')}</h2>
            {EXPLORE_LINKS.map((item) => (
              <Link key={item.labelKey} to={item.to}>
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
          <nav className="mkt-foot-col" aria-label={t('footer.company')}>
            <h2>{t('footer.company')}</h2>
            {COMPANY_LINKS.map((item) => (
              <Link key={item.labelKey} to={item.to}>
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
          <nav className="mkt-foot-col" aria-label={t('footer.legal')}>
            <h2>{t('footer.legal')}</h2>
            {LEGAL_LINKS.map((item) => (
              <Link key={item.labelKey} to={item.to}>
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mkt-foot-sign">
          <p className="mkt-foot-mark" aria-hidden>
            {BRAND}
          </p>
          <div className="mkt-foot-legal">
            <p>
              © {new Date().getFullYear()} {BRAND}. {t('footer.rights')}
            </p>
            <p>{t('footer.built')}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default MarketingFooter
