import { Link } from 'react-router-dom'

export const trialTo = () => '/signup'

export const PrimaryCta = ({ children = 'Try KRIRIDER free', className = '', variant = 'primary' }) => (
  <Link to="/signup" className={`mkt-btn ${variant === 'light' ? 'mkt-btn-light' : 'mkt-btn-primary'} ${className}`.trim()}>
    {children}
  </Link>
)

export const DemoCta = ({ children = 'Create account', className = '' }) => (
  <Link to="/signup" className={`mkt-btn mkt-btn-ghost ${className}`.trim()}>
    {children}
  </Link>
)

export default PrimaryCta
