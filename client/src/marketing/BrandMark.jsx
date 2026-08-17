import { Link } from 'react-router-dom'
import { BRAND } from './config'
import logoWebp from './brand/kririder-logo.webp'
import logoPng from './brand/kririder-logo.png'

export const BrandMark = ({ to = '/', className = '', variant = 'dark', size = 'nav' }) => (
  <Link
    to={to}
    className={`mkt-mark mkt-mark-${variant} mkt-mark-${size} ${className}`.trim()}
    aria-label={`${BRAND} home`}
  >
    <picture>
      <source type="image/webp" srcSet={logoWebp} />
      <img
        src={logoPng}
        alt=""
        width={1024}
        height={168}
        decoding="async"
        draggable="false"
      />
    </picture>
  </Link>
)

export default BrandMark
