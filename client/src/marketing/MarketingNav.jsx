import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import BrandMark from './BrandMark'
import { PrimaryCta } from './Ctas'
import MktLangSwitch from './MktLangSwitch'
import { useMktI18n } from './i18n/MarketingI18n'

export const MarketingNav = () => {
  const { isOwner, logout, setShowLogin, navigate } = useAppContext()
  const { t } = useMktI18n()
  const location = useLocation()
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
    return () => document.body.classList.remove('nav-open')
  }, [open])

  return (
    <header className={`mkt-nav${solid || open ? ' is-solid' : ''}`}>
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
              <PrimaryCta>{t('cta.trial')}</PrimaryCta>
            </>
          )}
        </div>
        <div className="mkt-nav-mobile">
          <MktLangSwitch />
          <button
            type="button"
            className="mkt-burger"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
              {open ? (
                <path d="M2 2l18 12M20 2L2 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              ) : (
                <path d="M1 2h20M1 8h20M1 14h20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {open ? (
        <div className="mkt-wrap mkt-drawer">
          {links.map((item) => (
            <Link key={item.href} to={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          {isOwner ? (
            <>
              <button type="button" onClick={() => navigate('/owner')}>
                {t('nav.dashboard')}
              </button>
              <button type="button" onClick={logout}>
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setShowLogin(true)}>
                {t('nav.login')}
              </button>
              <PrimaryCta>{t('cta.trial')}</PrimaryCta>
            </>
          )}
        </div>
      ) : null}
    </header>
  )
}

export default MarketingNav
