import { Link } from 'react-router-dom'
import { useMktI18n } from './i18n/MarketingI18n'

export const trialTo = () => '/signup'

const Arrow = () => (
  <svg className="mkt-btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const PrimaryCta = ({ children, className = '', variant = 'primary', arrow = false }) => {
  const { t } = useMktI18n()
  return (
    <Link to="/signup" className={`mkt-btn ${variant === 'light' ? 'mkt-btn-light' : 'mkt-btn-primary'} ${className}`.trim()}>
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
