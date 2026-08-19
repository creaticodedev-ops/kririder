import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'
import { useMktI18n } from './i18n/MarketingI18n'

export const trialTo = () => '/signup'

const Arrow = () => (
  <svg className="mkt-btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const useMagnetic = (enabled) => {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const onMove = (event) => {
    if (!enabled || reduce || !ref.current) return
    if (typeof window === 'undefined' || !window.matchMedia('(pointer:fine)').matches) return
    const box = ref.current.getBoundingClientRect()
    const x = (event.clientX - box.left - box.width / 2) * 0.07
    const y = (event.clientY - box.top - box.height / 2) * 0.09
    ref.current.style.transition = 'none'
    ref.current.style.setProperty('--mx', `${x}px`)
    ref.current.style.setProperty('--my', `${y}px`)
    ref.current.style.setProperty('--hx', `${((event.clientX - box.left) / box.width) * 100}%`)
    ref.current.style.setProperty('--hy', `${((event.clientY - box.top) / box.height) * 100}%`)
  }
  const onLeave = () => {
    if (!ref.current) return
    ref.current.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)'
    ref.current.style.setProperty('--mx', '0px')
    ref.current.style.setProperty('--my', '0px')
  }
  return { ref, onMove, onLeave }
}

export const PrimaryCta = ({ children, className = '', variant = 'primary', arrow = true, onClick, magnetic = true }) => {
  const { t } = useMktI18n()
  const isLight = variant === 'light'
  const skipMag = !magnetic || className.includes('mkt-menu-cta')
  const mag = useMagnetic(!skipMag)
  return (
    <Link
      ref={mag.ref}
      to="/signup"
      className={`mkt-btn ${isLight ? 'mkt-btn-light' : 'mkt-btn-primary'} mkt-cta ${className}`.trim()}
      onClick={onClick}
      onMouseMove={mag.onMove}
      onMouseLeave={mag.onLeave}
    >
      {children ?? t('cta.trial')}
      {arrow ? <Arrow /> : null}
    </Link>
  )
}

export const DemoCta = ({ children, className = '' }) => {
  const { t } = useMktI18n()
  return (
    <Link to="/signup" className={`mkt-btn mkt-btn-ghost ${className}`.trim()}>
      {children ?? t('cta.account')}
    </Link>
  )
}

export const ContactCta = ({ children, className = '' }) => {
  const { t } = useMktI18n()
  return (
    <Link to="/contact" className={`mkt-btn mkt-btn-ghost ${className}`.trim()}>
      {children ?? t('cta.talk')}
    </Link>
  )
}

export default PrimaryCta
