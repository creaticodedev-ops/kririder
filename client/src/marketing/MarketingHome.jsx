import { useMemo, useState } from 'react'
import SeoHead from '../seo/SeoHead'
import { SITE_ORIGIN } from '../seo/constants'
import { organizationJsonLd, websiteJsonLd } from '../seo/jsonLd'
import { BRAND, CLIENTS, PLANS, SEO, TRIAL_DAYS } from './config'
import { DemoCta, PrimaryCta } from './Ctas'
import MarketingLayout from './MarketingLayout'
import { HeroStage, ProductShot, SHOTS, ShotCrop } from './productPreviews'

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: BRAND,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: SEO.description,
  url: SITE_ORIGIN,
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'MAD',
    lowPrice: '0',
    highPrice: '599',
    offerCount: 3,
  },
}

const Note = () => (
  <p className="mkt-caption">Real KRIRIDER workspace. Interface shown from HDN Car, a KRIRIDER client.</p>
)

const SHOWCASES = [
  { id: 'dashboard', label: 'Dashboard', src: SHOTS.dashboard, title: 'Dashboard' },
  { id: 'reservations', label: 'Reservations', src: SHOTS.reservations, title: 'Reservations' },
  { id: 'calendar', label: 'Calendar', src: SHOTS.calendar, title: 'Calendar' },
  { id: 'fleet', label: 'Fleet', src: SHOTS.fleet, title: 'Fleet' },
  { id: 'customers', label: 'Customers', src: SHOTS.customers, title: 'Customers' },
  { id: 'contracts', label: 'Contracts', src: SHOTS.contracts, title: 'Contracts' },
  { id: 'finance', label: 'Finance', src: SHOTS.revenues, title: 'Revenues' },
  { id: 'maintenance', label: 'Maintenance', src: SHOTS.maintenance, title: 'Maintenance' },
]

const ProductStage = () => {
  const [active, setActive] = useState(SHOWCASES[0].id)
  const current = useMemo(() => SHOWCASES.find((item) => item.id === active) || SHOWCASES[0], [active])
  return (
    <div className="mkt-stage">
      <div className="mkt-tabs" role="tablist" aria-label="Product modules">
        {SHOWCASES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === active}
            className={item.id === active ? 'is-on' : ''}
            onClick={() => setActive(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <ProductShot src={current.src} title={current.title} alt={`KRIRIDER ${current.label} workspace`} ratio="16 / 10.2" />
      <Note />
    </div>
  )
}

const Hub = () => (
  <div className="mkt-mosaic" aria-hidden>
    {[
      [SHOTS.reservations, '72% 30%'],
      [SHOTS.fleet, '50% 18%'],
      [SHOTS.customers, '50% 20%'],
      [SHOTS.contracts, '60% 18%'],
      [SHOTS.analytics, '50% 16%'],
      [SHOTS.revenues, '50% 22%'],
    ].map(([src, pos], i) => (
      <ShotCrop key={i} src={src} pos={pos} alt="" />
    ))}
  </div>
)

export const MarketingHome = () => (
  <MarketingLayout>
    <SeoHead
      title={SEO.title}
      description={SEO.description}
      path="/"
      lang="en"
      locale="en_GB"
      siteName={BRAND}
      jsonLd={[organizationJsonLd(null), websiteJsonLd(null), softwareJsonLd]}
    />

    <section className="mkt-hero">
      <div className="mkt-wrap mkt-hero-grid">
        <div className="mkt-hero-copy">
          <p className="mkt-badge">
            <i /> All-in-one car rental management platform
          </p>
          <h1 className="mkt-h1">
            The operating system for <em>modern car rental</em> businesses.
          </h1>
          <p className="mkt-lead">
            KRIRIDER brings reservations, fleet, customers, contracts, payments, invoices and analytics together in one
            owner workspace — built for rental companies, not adapted from generic software.
          </p>
          <div className="mkt-actions">
            <PrimaryCta arrow>Start your free trial</PrimaryCta>
            <a className="mkt-btn mkt-btn-ghost-light" href="#workspace">
              <span className="mkt-play" aria-hidden />
              Explore the platform
            </a>
          </div>
          <ul className="mkt-trust">
            <li>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden>
                <path
                  d="M10 2.5l6.5 2.2v5.1c0 4.1-2.7 6.8-6.5 8.2C6.2 16.6 3.5 13.9 3.5 9.8V4.7L10 2.5z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
              {TRIAL_DAYS}-day free trial
            </li>
            <li>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M4 11l5-8 2.2 4.2H16L9 18l-1.5-5H4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
              Setup in minutes
            </li>
            <li>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden>
                <rect x="4" y="9" width="12" height="8" rx="1.4" stroke="currentColor" strokeWidth="1.4" />
                <path d="M7 9V7.2A3 3 0 0113 7.2V9" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              No payment to start
            </li>
          </ul>
        </div>
        <div className="mkt-hero-visual">
          <HeroStage />
          <Note />
        </div>
      </div>
    </section>

    <section className="mkt-proof" aria-label="Customers">
      <div className="mkt-wrap mkt-proof-row">
        <p>Trusted by car rental companies</p>
        <div className="mkt-proof-logos">
          {CLIENTS.map((client) => (
            <strong key={client.name}>
              {client.name}
              <span>KRIRIDER client</span>
            </strong>
          ))}
        </div>
      </div>
    </section>

    <section className="mkt-band" id="product">
      <div className="mkt-wrap mkt-duo">
        <div>
          <p className="mkt-kicker">The challenge</p>
          <h2 className="mkt-h2">Running a rental business is complex.</h2>
          <p className="mkt-lead">
            Desks still juggle WhatsApp threads, spreadsheets and paper contracts. Availability, customers and payments
            live in different places — so the day depends on whoever remembers.
          </p>
          <div className="mkt-pains">
            {[
              ['Scattered data', 'Bookings, customers and vehicle status across separate files.'],
              ['Manual processes', 'Contracts and signatures rewritten by hand for every stay.'],
              ['Limited visibility', 'No single view of occupancy, revenue or returns.'],
              ['Disconnected tools', 'Walk-in, online and WhatsApp treated as different operations.'],
            ].map(([title, text]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <p className="mkt-kicker">The solution</p>
          <h2 className="mkt-h2">One platform. Everything connected.</h2>
          <p className="mkt-lead">
            Confirm a booking, assign a car, issue a contract, collect a signature, record a payment and close the
            return — from the same KRIRIDER workspace.
          </p>
          <Hub />
        </div>
      </div>
    </section>

    <section className="mkt-wrap mkt-section" id="workspace">
      <div className="mkt-intro">
        <p className="mkt-kicker">Product experience</p>
        <h2 className="mkt-h2">The workspace your team opens every morning.</h2>
        <p className="mkt-lead">
          These are real KRIRIDER screens. Switch between dashboard, reservations, calendar, fleet, customers, contracts,
          finance and maintenance.
        </p>
      </div>
      <ProductStage />
    </section>

    <section className="mkt-feature" id="features">
      <div className="mkt-wrap mkt-feature-row">
        <div>
          <p className="mkt-kicker">Reservations</p>
          <h2 className="mkt-h2">Run the desk from one booking workspace.</h2>
          <p className="mkt-lead">
            Online, walk-in and WhatsApp channels share statuses from pending through return. The calendar shows occupancy
            against the same bookings.
          </p>
        </div>
        <div className="mkt-layer">
          <ProductShot src={SHOTS.calendar} title="Calendar" alt="KRIRIDER reservation calendar" ratio="16 / 10" />
          <ProductShot
            className="mkt-layer-card"
            src={SHOTS.booking}
            title="Reservation"
            alt="KRIRIDER reservation detail"
            ratio="16 / 11"
          />
        </div>
      </div>
    </section>

    <section className="mkt-feature is-invert">
      <div className="mkt-wrap mkt-feature-row">
        <div>
          <p className="mkt-kicker">Fleet</p>
          <h2 className="mkt-h2">Every car is a physical asset — not a spreadsheet row.</h2>
          <p className="mkt-lead">
            Fleet ID, VIN, plate, mileage, branch and availability sit next to the booking that needs the vehicle. Locations
            and maintenance stay in the same product.
          </p>
        </div>
        <ProductShot src={SHOTS.fleet} title="Manage cars" alt="KRIRIDER fleet table with vehicles, plates and status" ratio="16 / 10" />
      </div>
    </section>

    <section className="mkt-band">
      <div className="mkt-wrap">
        <div className="mkt-intro">
          <p className="mkt-kicker">Customers & desk</p>
          <h2 className="mkt-h2">CRM, walk-in and locations in the same system.</h2>
        </div>
        <div className="mkt-trio">
          <article>
            <ProductShot src={SHOTS.customers} title="Customers" alt="KRIRIDER customer records" ratio="16 / 11" />
            <h3>Customers</h3>
            <p>History lives on the agency record, not in a private chat thread.</p>
          </article>
          <article>
            <ProductShot src={SHOTS.walkin} title="Walk-in" alt="KRIRIDER walk-in reservation form" ratio="16 / 11" />
            <h3>Walk-in</h3>
            <p>Create an offline reservation at the desk. It flows into calendar, payments and reports.</p>
          </article>
          <article>
            <ProductShot src={SHOTS.locations} title="Locations" alt="KRIRIDER pickup locations" ratio="16 / 11" />
            <h3>Locations</h3>
            <p>Pickup and return points attached to the fleet and the booking.</p>
          </article>
        </div>
      </div>
    </section>

    <section className="mkt-feature">
      <div className="mkt-wrap mkt-feature-row">
        <div>
          <p className="mkt-kicker">Contracts & signatures</p>
          <h2 className="mkt-h2">Documents generated from the rental — then signed remotely.</h2>
          <p className="mkt-lead">
            Contracts and invoices come from the booking. Customers complete files through a dedicated completion link.
            Templates stay under agency control.
          </p>
        </div>
        <div className="mkt-stack-shots">
          <ProductShot src={SHOTS.contracts} title="Contracts" alt="KRIRIDER contract workspace" ratio="16 / 10.5" />
          <div className="mkt-stack-side">
            <ShotCrop className="is-tall" src={SHOTS.signatures} pos="70% 35%" alt="KRIRIDER signature requests" />
            <ShotCrop className="is-tall" src={SHOTS.templates} pos="50% 20%" alt="KRIRIDER contract and invoice templates" />
          </div>
        </div>
      </div>
    </section>

    <section className="mkt-feature is-dark" id="finance">
      <div className="mkt-wrap">
        <div className="mkt-intro">
          <p className="mkt-kicker">Finance & insights</p>
          <h2 className="mkt-h2">Revenue, accounting and exports without waiting for month-end.</h2>
          <p className="mkt-lead">
            Booking-derived income, paid versus unpaid, invoices and CSV/PDF reports sit next to the work that produced
            them.
          </p>
        </div>
        <div className="mkt-film">
          <ProductShot src={SHOTS.revenues} title="Revenues" alt="KRIRIDER revenues with paid and unpaid totals" ratio="16 / 10" />
          <ProductShot src={SHOTS.accounting} title="Accounting" alt="KRIRIDER accounting workspace" ratio="16 / 10" />
          <ProductShot src={SHOTS.invoices} title="Invoices" alt="KRIRIDER invoices" ratio="16 / 10" />
        </div>
        <div className="mkt-film mkt-film-2">
          <ProductShot src={SHOTS.analytics} title="Analytics" alt="KRIRIDER analytics dashboard" ratio="16 / 10" />
          <ProductShot src={SHOTS.reports} title="Reports" alt="KRIRIDER reports and CSV exports" ratio="16 / 10" />
        </div>
      </div>
    </section>

    <section className="mkt-feature is-invert">
      <div className="mkt-wrap mkt-feature-row">
        <div>
          <p className="mkt-kicker">Maintenance</p>
          <h2 className="mkt-h2">Service, insurance and costs tracked per physical vehicle.</h2>
          <p className="mkt-lead">
            Mileage, next service, inspections and shop status are not model-level notes. They belong to the exact car on
            the lot.
          </p>
        </div>
        <ProductShot src={SHOTS.maintenance} title="Fleet maintenance" alt="KRIRIDER fleet maintenance table" ratio="16 / 10" />
      </div>
    </section>

    <section className="mkt-wrap mkt-section">
      <div className="mkt-intro">
        <p className="mkt-kicker">Public storefront</p>
        <h2 className="mkt-h2">Your rental brand in front of the customer.</h2>
        <p className="mkt-lead">
          Each agency can publish a storefront for vehicle pages and reservation requests — isolated from other tenants,
          on KRIRIDER.
        </p>
      </div>
      <ProductShot
        src={SHOTS.storefront}
        title="Agency storefront"
        alt="Public vehicle page generated by KRIRIDER for a client agency"
        ratio="16 / 11"
      />
      <Note />
    </section>

    <section className="mkt-wrap mkt-section" style={{ paddingTop: 0 }}>
      <div className="mkt-intro">
        <p className="mkt-kicker">Connected workflow</p>
        <h2 className="mkt-h2">From reservation to financial visibility.</h2>
        <p className="mkt-lead">Each step stays attached to the same rental — so staff never re-key the stay.</p>
      </div>
      <ol className="mkt-flow">
        {['Reservation', 'Customer', 'Vehicle', 'Contract', 'Signature', 'Payment', 'Return', 'Invoices'].map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>

    <section className="mkt-why">
      <div className="mkt-wrap mkt-why-grid">
        <div>
          <p className="mkt-kicker">Why KRIRIDER</p>
          <h2 className="mkt-h2">Built for car rental companies. Not adapted from generic software.</h2>
          <p className="mkt-lead">
            Bookings, fleet states, contracts and returns are first-class objects. Each agency is isolated, with its own
            staff permissions, templates and optional public storefront.
          </p>
          <div className="mkt-actions" style={{ marginTop: '1.4rem' }}>
            <PrimaryCta arrow>Start your free trial</PrimaryCta>
          </div>
        </div>
        <ol className="mkt-why-list">
          {[
            ['One operations desk', 'Owners and staff share a workspace instead of parallel tools and a shared password.'],
            ['Fleet as inventory', 'Availability is the product of the calendar, locations and maintenance — not a spreadsheet row.'],
            ['Documents from the rental', 'Contracts and invoices are generated, then signed through the customer completion link.'],
            ['Performance in the product', 'Revenue, occupancy and channel mix sit next to the work that produced them.'],
          ].map(([title, text], i) => (
            <li key={title}>
              <em>{String(i + 1).padStart(2, '0')}</em>
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="mkt-wrap mkt-section" id="pricing">
      <div className="mkt-intro">
        <p className="mkt-kicker">Pricing</p>
        <h2 className="mkt-h2">Start free. Choose a plan when the trial ends.</h2>
        <p className="mkt-lead">
          Registration does not require a card. After {TRIAL_DAYS} days, continue on Starter, Professional or Business.
        </p>
      </div>
      <div className="mkt-table-wrap">
        <table className="mkt-matrix">
          <thead>
            <tr>
              <th> </th>
              {PLANS.map((plan) => (
                <th key={plan.id} className={plan.popular ? 'is-pop' : ''}>
                  {plan.popular ? <div className="mkt-kicker">Most popular</div> : null}
                  {plan.name}
                  <div className="mkt-amount">
                    {plan.price}
                    {plan.currency ? (
                      <small>
                        {' '}
                        {plan.currency}/{plan.interval}
                      </small>
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Built for</td>
              {PLANS.map((plan) => (
                <td key={plan.id} className={plan.popular ? 'is-pop' : ''}>
                  {plan.audience}
                </td>
              ))}
            </tr>
            <tr>
              <td>Included</td>
              {PLANS.map((plan) => (
                <td key={plan.id} className={plan.popular ? 'is-pop' : ''}>
                  {plan.features.map((f) => (
                    <div key={f}>{f}</div>
                  ))}
                </td>
              ))}
            </tr>
            <tr>
              <td> </td>
              {PLANS.map((plan) => (
                <td key={plan.id} className={plan.popular ? 'is-pop' : ''}>
                  <PrimaryCta>{plan.id === 'business' ? 'Create account' : 'Start free trial'}</PrimaryCta>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mkt-note">
        Starter, Professional and Business are marketing names for Basic, Pro and Enterprise in the product catalog.
      </p>
    </section>

    <section className="mkt-final">
      <div className="mkt-wrap">
        <p className="mkt-kicker">Get started</p>
        <h2 className="mkt-h2">Ready to run your rental business on KRIRIDER?</h2>
        <p className="mkt-lead">
          Create an account in minutes. {TRIAL_DAYS}-day free trial — one per agency. No payment during registration.
        </p>
        <div className="mkt-actions">
          <PrimaryCta variant="light" arrow>
            Start your free trial
          </PrimaryCta>
          <DemoCta>Create your account</DemoCta>
        </div>
      </div>
    </section>
  </MarketingLayout>
)

export default MarketingHome
