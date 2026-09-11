import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useAppContext } from '../context/AppContext'
import BrandMark from './BrandMark'
import { DemoRequestCta, WhatsAppDemoCta } from './Ctas'
import MktLangSwitch from './MktLangSwitch'
import { useMktI18n } from './i18n/MarketingI18n'

const ease = [0.22, 1, 0.36, 1]

const linkId = (href) => href.replace(/^\/#/, '') || 'home'

export const MarketingNav = () => {
  const { isOwner, logout, setShowLogin, navigate } = useAppContext()
  const { t } = useMktI18n()
  const location = useLocation()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHash, setActiveHash] = useState('')
  const [entered, setEntered] = useState(false)

  const links = useMemo(
    () => [
      { href: '/#product', label: t('nav.product') },
      { href: '/#features', label: t('nav.features') },
      { href: '/#pricing', label: t('nav.pricing') },
      { href: '/#faq', label: t('nav.faq') },
    ],
    [t]
  )

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setEntered(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18)
      if (location.pathname !== '/') return
      const sections = links.map((l) => document.getElementById(linkId(l.href))).filter(Boolean)
      let current = ''
      const y = window.scrollY + 120
      for (const el of sections) {
        if (el.offsetTop <= y) current = el.id
      }
      setActiveHash(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [links, location.pathname])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!open) return undefined
    document.body.classList.add('nav-open')
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('nav-open')
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 960px)')
    const onChange = (event) => {
      if (event.matches) setOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const close = () => setOpen(false)
  const isActive = (href) => location.pathname === '/' && activeHash === linkId(href)

  return (
    <>
      <header
        className={`mkt-nav mkt-nav-pro${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}${entered ? ' is-in' : ''}`}
      >
        <div className="mkt-wrap">
          <div className="mkt-nav-rail">
            <BrandMark variant="light" size="nav" className="mkt-nav-logo" />

            <nav className="mkt-nav-links" aria-label={t('nav.productNav')}>
              {links.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={isActive(item.href) ? 'is-active' : undefined}
                  aria-current={isActive(item.href) ? 'true' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mkt-nav-cta">
              <MktLangSwitch />
              {isOwner ? (
                <>
                  <button type="button" className="mkt-nav-text" onClick={() => navigate('/owner')}>
                    {t('nav.dashboard')}
                  </button>
                  <button type="button" className="mkt-btn mkt-btn-primary mkt-nav-demo" onClick={logout}>
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="mkt-nav-text" onClick={() => setShowLogin(true)}>
                    {t('nav.login')}
                  </button>
                  <WhatsAppDemoCta className="mkt-nav-wa">{t('cta.whatsappShort')}</WhatsAppDemoCta>
                  <DemoRequestCta className="mkt-nav-demo" magnetic={false}>
                    {t('cta.demo')}
                  </DemoRequestCta>
                </>
              )}
            </div>

            <div className="mkt-nav-mobile">
              <MktLangSwitch />
              <button
                type="button"
                className={`mkt-burger${open ? ' is-open' : ''}`}
                aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
                aria-expanded={open}
                aria-controls="mkt-mobile-menu"
                onClick={() => setOpen((v) => !v)}
              >
                <span className="mkt-burger-lines" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mkt-mobile-menu"
            className="mkt-menu mkt-menu-pro"
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.productNav')}
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.28, ease }}
          >
            <div className="mkt-wrap mkt-menu-body">
              <motion.nav
                className="mkt-menu-links"
                aria-label={t('nav.productNav')}
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: reduce ? { staggerChildren: 0 } : { staggerChildren: 0.06, delayChildren: 0.05 },
                  },
                }}
              >
                {links.map((item, index) => (
                  <motion.div
                    key={item.href}
                    variants={{
                      hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
                    }}
                  >
                    <Link to={item.href} className="mkt-menu-link" onClick={close}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              <motion.div
                className="mkt-menu-actions"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : 0.28, ease }}
              >
                {isOwner ? (
                  <>
                    <button type="button" className="mkt-menu-login" onClick={() => { close(); navigate('/owner') }}>
                      {t('nav.dashboard')}
                    </button>
                    <button type="button" className="mkt-btn mkt-btn-primary mkt-menu-cta" onClick={() => { close(); logout() }}>
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="mkt-menu-login"
                      onClick={() => {
                        close()
                        setShowLogin(true)
                      }}
                    >
                      {t('nav.login')}
                    </button>
                    <WhatsAppDemoCta className="mkt-menu-wa" onClick={close}>
                      {t('cta.whatsapp')}
                    </WhatsAppDemoCta>
                    <DemoRequestCta className="mkt-menu-cta" magnetic={false} onClick={close}>
                      {t('cta.demo')}
                    </DemoRequestCta>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default MarketingNav
