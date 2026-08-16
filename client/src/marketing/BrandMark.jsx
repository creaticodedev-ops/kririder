import { Link } from 'react-router-dom'
import { BRAND } from './config'

const Mark = () => (
  <span className="mkt-mark-kr" aria-hidden>
    KR
  </span>
)

export const BrandMark = ({ to = '/', className = '', variant = 'light' }) => (
  <Link to={to} className={`mkt-mark mkt-mark-${variant} ${className}`.trim()} aria-label={`${BRAND} home`}>
    <Mark />
    <span className="mkt-mark-word">KRIRIDER</span>
  </Link>
)

export default BrandMark
