import { Link } from 'react-router-dom'
import { BRAND } from './config'
import logo from './logo-kririder.png'

export const BrandMark = ({ to = '/', className = '' }) => (
  <Link to={to} className={`mkt-mark ${className}`.trim()} aria-label={`${BRAND} home`}>
    <span className="mkt-mark-logo">
      <img src={logo} alt="" width={220} height={72} />
    </span>
  </Link>
)

export default BrandMark
