import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useAppContext } from '../context/AppContext'
import BrandMark from './BrandMark'
import { PrimaryCta } from './Ctas'
import MktLangSwitch from './MktLangSwitch'
import { useMktI18n } from './i18n/MarketingI18n'

const ease = [0.22, 1, 0.36, 1]

export const MarketingNav = () => {
  const { isOwner, logout, setShowLogin, navigate } = useAppContext()
  const { t } = useMktI18n()
  const location = useLocation()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)

  const links = [
    { href: '/#features', label: t('nav.features') },
    { href: '/#product', label: t('nav.product') },
    { href: '/#pricing', label: t('nav.pricing') },
    { href: '/about', label: t('nav.about') },
  ]

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    const mq = window.matchMedia('(min-width: 900px)')
    const onChange = (event) => {
      if (event.matches) setOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const close = () => setOpen(false)

  return (
    <>
    <header className={`mkt-nav${solid || open ? ' is-solid' : ''}${open ? ' is-open' : ''}`}>
      <div className="mkt-wrap mkt-nav-inner">
        <BrandMark variant="dark" size="nav" />
        <nav className="mkt-nav-links" aria-label={t('nav.productNav')}>
          {links.map((item) => (
            <Link key={item.href} to={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mkt-nav-cta">
          <MktLangSwitch />
          {isOwner ? (
            <>
              <button type="button" className="mkt-btn mkt-btn-ghost" onClick={() => navigate('/owner')}>
                {t('nav.dashboard')}
              </button>
              <button type="button" className="mkt-btn mkt-btn-primary" onClick={logout}>
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <button type="button" className="mkt-btn mkt-btn-ghost" onClick={() => setShowLogin(true)}>
                {t('nav.login')}
              </button>
              <PrimaryCta magnetic={false}>{t('cta.trial')}</PrimaryCta>
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
    </header>
    <div className="mkt-nav-spacer" aria-hidden />

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mkt-mobile-menu"
            className="mkt-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.productNav')}
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.32, ease }}
          >
            <div className="mkt-menu-atmos" aria-hidden>
              <span className="mkt-menu-glow" />
              <span className="mkt-menu-line" />
            </div>
            <div className="mkt-wrap mkt-menu-body">
              <motion.nav
                className="mkt-menu-links"
                aria-label={t('nav.productNav')}
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: reduce ? { staggerChildren: 0 } : { staggerChildren: 0.07, delayChildren: 0.08 },
                  },
                }}
              >
                {links.map((item, index) => (
                  <motion.div
                    key={item.href}
                    variants={{
                      hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
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
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.38, ease }}
              >
                {isOwner ? (
                  <>
                    <button type="button" className="mkt-menu-login" onClick={() => { close(); navigate('/owner') }}>
                      {t('nav.dashboard')}
                    </button>
                    <button type="button" className="mkt-btn mkt-btn-light mkt-menu-cta" onClick={() => { close(); logout() }}>
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
                    <PrimaryCta variant="light" arrow className="mkt-menu-cta" onClick={close}>
                      {t('cta.trial')}
                    </PrimaryCta>
                  </>
                )}
              </motion.div>
              <p className="mkt-menu-note">{t('footer.built')}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default MarketingNav
