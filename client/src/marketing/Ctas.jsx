import { Link } from 'react-router-dom'

export const trialTo = (intent = 'trial') => `/contact?intent=${intent}`

export const PrimaryCta = ({ children = 'Start Free Trial', intent = 'trial', className = '', variant = 'primary' }) => (
  <Link to={trialTo(intent)} className={`mkt-btn ${variant === 'light' ? 'mkt-btn-light' : 'mkt-btn-primary'} ${className}`.trim()}>
    {children}
  </Link>
)

export const DemoCta = ({ children = 'Book a Demo', className = '' }) => (
  <Link to={trialTo('demo')} className={`mkt-btn mkt-btn-ghost ${className}`.trim()}>
    {children}
  </Link>
)

export default PrimaryCta
