import { Link } from 'react-router-dom'

export const trialTo = () => '/signup'

const Arrow = () => (
  <svg className="mkt-btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const PrimaryCta = ({ children = 'Try KRIRIDER free', className = '', variant = 'primary', arrow = false }) => (
  <Link to="/signup" className={`mkt-btn ${variant === 'light' ? 'mkt-btn-light' : 'mkt-btn-primary'} ${className}`.trim()}>
    {children}
    {arrow ? <Arrow /> : null}
  </Link>
)

export const DemoCta = ({ children = 'Create account', className = '' }) => (
  <Link to="/signup" className={`mkt-btn mkt-btn-ghost ${className}`.trim()}>
    {children}
  </Link>
)

export default PrimaryCta
