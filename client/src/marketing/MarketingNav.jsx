import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import BrandMark from './BrandMark'
import { PrimaryCta } from './Ctas'

const LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#product', label: 'Product' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
]

export const MarketingNav = () => {
  const { isOwner, logout, setShowLogin, navigate } = useAppContext()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)

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
        <BrandMark variant="dark" />
        <nav className="mkt-nav-links" aria-label="Product">
          {LINKS.map((item) => (
            <Link key={item.href} to={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mkt-nav-cta">
          {isOwner ? (
            <>
              <button type="button" className="mkt-btn mkt-btn-ghost" onClick={() => navigate('/owner')}>
                Dashboard
              </button>
              <button type="button" className="mkt-btn mkt-btn-primary" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <button type="button" className="mkt-btn mkt-btn-ghost" onClick={() => setShowLogin(true)}>
                Log in
              </button>
              <PrimaryCta>Start free trial</PrimaryCta>
            </>
          )}
        </div>
        <button
          type="button"
          className="mkt-burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
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
      {open ? (
        <div className="mkt-wrap mkt-drawer">
          {LINKS.map((item) => (
            <Link key={item.href} to={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          {isOwner ? (
            <>
              <button type="button" onClick={() => navigate('/owner')}>
                Dashboard
              </button>
              <button type="button" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setShowLogin(true)}>
                Log in
              </button>
              <PrimaryCta>Start free trial</PrimaryCta>
            </>
          )}
        </div>
      ) : null}
    </header>
  )
}

export default MarketingNav
