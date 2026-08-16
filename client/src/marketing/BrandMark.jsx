import { Link } from 'react-router-dom'
import { BRAND } from './config'

/** Light-surface wordmark. The packed logo asset has a black canvas, so it is not used here. */
export const BrandMark = ({ to = '/', className = '' }) => (
  <Link to={to} className={`mkt-mark ${className}`.trim()} aria-label={`${BRAND} home`}>
    <span className="mkt-mark-badge" aria-hidden>
      <svg viewBox="0 0 32 32" fill="none">
        <path
          d="M4 22c6-1 9-7 14-9 3 4 6 7 10 7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M7 22h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path
          d="M10.5 21.2c.8-3 2.6-5 5.5-5.4 2.2-.3 3.7.6 4.6 2.2.4.7.8 2.1.8 3.2H10.5Z"
          fill="currentColor"
        />
      </svg>
    </span>
    <span className="mkt-mark-text">
      <span>KRI</span>RIDER
    </span>
  </Link>
)

export default BrandMark
