import { Link } from 'react-router-dom'
import BrandMark from './BrandMark'
import { BRAND } from './config'

export const MarketingFooter = () => (
  <footer className="mkt-foot">
    <div className="mkt-wrap">
      <div className="mkt-foot-grid">
        <div>
          <BrandMark variant="dark" />
          <p className="mkt-lead" style={{ marginTop: '1rem', fontSize: '0.92rem' }}>
            Car rental management software for reservations, fleet, customers, contracts and daily operations.
          </p>
        </div>
        <div>
          <h2>Product</h2>
          <Link to="/#features">Features</Link>
          <Link to="/#pricing">Pricing</Link>
          <Link to="/#product">Workspace</Link>
        </div>
        <div>
          <h2>Company</h2>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <h2>Legal</h2>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
      <div className="mkt-foot-legal">
        <p>
          © {new Date().getFullYear()} {BRAND}. All rights reserved.
        </p>
        <p>Built for car rental businesses.</p>
      </div>
    </div>
  </footer>
)

export default MarketingFooter
