import dashboard from './shots/dashboard.png'
import reservations from './shots/reservations.png'
import calendar from './shots/calendar.png'
import booking from './shots/booking.png'
import fleet from './shots/fleet.png'
import customers from './shots/customers.png'
import contracts from './shots/contracts.png'
import signatures from './shots/signatures.png'
import invoices from './shots/invoices.png'
import accounting from './shots/accounting.png'
import revenues from './shots/revenues.png'
import analytics from './shots/analytics.png'
import reports from './shots/reports.png'
import maintenance from './shots/maintenance.png'
import walkin from './shots/walkin.png'
import storefront from './shots/storefront.png'
import locations from './shots/locations.png'
import templates from './shots/templates.png'

export const SHOTS = {
  dashboard,
  reservations,
  calendar,
  booking,
  fleet,
  customers,
  contracts,
  signatures,
  invoices,
  accounting,
  revenues,
  analytics,
  reports,
  maintenance,
  walkin,
  storefront,
  locations,
  templates,
}

export const ProductShot = ({
  src,
  alt,
  title = 'KRIRIDER',
  className = '',
  crop = 'top',
  eager = false,
  ratio,
}) => (
  <figure className={`mkt-shot ${className}`.trim()}>
    <div className="mkt-shot-bar" aria-hidden>
      <span className="mkt-shot-dots">
        <i />
        <i />
        <i />
      </span>
      <span className="mkt-shot-url">{title}</span>
    </div>
    <div className={`mkt-shot-view is-${crop}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </div>
  </figure>
)

export const ShotCrop = ({ src, alt, pos = '50% 12%', className = '' }) => (
  <div className={`mkt-crop ${className}`.trim()}>
    <img src={src} alt={alt} style={{ objectPosition: pos }} loading="lazy" decoding="async" />
  </div>
)

export const HeroStage = () => (
  <div className="mkt-hero-stage">
    <ProductShot
      className="mkt-hero-stage-main"
      src={SHOTS.dashboard}
      title="Owner workspace"
      alt="KRIRIDER dashboard with occupancy, bookings, revenue and fleet status"
      eager
      ratio="16 / 10.4"
    />
    <aside className="mkt-float mkt-float-shot mkt-float-a" aria-hidden>
      <ShotCrop src={SHOTS.reservations} pos="72% 28%" alt="" />
      <p>Reservations</p>
    </aside>
    <aside className="mkt-float mkt-float-shot mkt-float-b" aria-hidden>
      <ShotCrop src={SHOTS.analytics} pos="55% 22%" alt="" />
      <p>Analytics</p>
    </aside>
  </div>
)
