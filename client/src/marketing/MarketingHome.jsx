import { useMemo, useState } from 'react'
import SeoHead from '../seo/SeoHead'
import { SITE_ORIGIN } from '../seo/constants'
import { organizationJsonLd, websiteJsonLd } from '../seo/jsonLd'
import { BRAND, CLIENTS, PLANS, SEO, TRIAL_DAYS } from './config'
import { DemoCta, PrimaryCta } from './Ctas'
import MarketingLayout from './MarketingLayout'
import { BrowserFrame, PhoneFrame } from './productPreviews'
import {
  AnalyticsPreview,
  ContractsPreview,
  DashboardPreview,
  FleetPreview,
  ReservationsPreview,
} from './productPreviews'

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
  <p className="mkt-caption">KRIRIDER owner workspace. Sample operational data — not a live agency account.</p>
)

const SHOWCASES = [
  { id: 'reservations', label: 'Reservations', Preview: ReservationsPreview, url: 'app.kririder.com/owner/manage-bookings' },
  { id: 'fleet', label: 'Fleet', Preview: FleetPreview, url: 'app.kririder.com/owner/manage-cars' },
  { id: 'contracts', label: 'Contracts', Preview: ContractsPreview, url: 'app.kririder.com/owner/contracts' },
  { id: 'analytics', label: 'Analytics', Preview: AnalyticsPreview, url: 'app.kririder.com/owner/analytics' },
]

const ProductStage = () => {
  const [active, setActive] = useState(SHOWCASES[0].id)
  const current = useMemo(() => SHOWCASES.find((item) => item.id === active) || SHOWCASES[0], [active])
  const Preview = current.Preview
  return (
    <div>
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
      <BrowserFrame url={current.url}>
        <Preview />
      </BrowserFrame>
      <Note />
    </div>
  )
}

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

    <section className="mkt-wrap mkt-hero">
      <div>
        <p className="mkt-kicker">Car rental operating system</p>
        <h1 className="mkt-h1">The Operating System for Modern Car Rental Businesses</h1>
        <p className="mkt-lead" style={{ marginTop: '1.15rem' }}>
          Manage reservations, vehicles, customers, contracts, accounting and daily operations from one powerful platform.
        </p>
        <div className="mkt-actions" style={{ marginTop: '1.5rem' }}>
          <PrimaryCta>Start your free trial</PrimaryCta>
          <a className="mkt-btn mkt-btn-ghost" href="#product">
            See the workspace
          </a>
        </div>
        <p className="mkt-note">
          Create a KRIRIDER account in minutes. {TRIAL_DAYS}-day free trial — one per agency. No payment to start.
        </p>
      </div>
      <div className="mkt-stack">
        <div className="mkt-stack-back">
          <BrowserFrame url="app.kririder.com/owner/manage-bookings">
            <ReservationsPreview />
          </BrowserFrame>
        </div>
        <BrowserFrame>
          <DashboardPreview />
        </BrowserFrame>
      </div>
    </section>

    <div className="mkt-wrap">
      <div className="mkt-rail" aria-label="Customers">
        <span>Used by rental companies on KRIRIDER</span>
        {CLIENTS.map((client) => (
          <strong key={client.name}>
            {client.name} <span>client</span>
          </strong>
        ))}
      </div>
    </div>

    <section className="mkt-wrap mkt-section" id="product">
      <div className="mkt-split">
        <div>
          <p className="mkt-kicker">The operation</p>
          <h2 className="mkt-h2">Your rental business shouldn't depend on disconnected tools.</h2>
          <ul className="mkt-list">
            <li>Reservations managed across different systems</li>
            <li>Vehicle availability difficult to track</li>
            <li>Customer information scattered</li>
            <li>Contracts handled manually</li>
            <li>Payments difficult to monitor</li>
            <li>Too many spreadsheets</li>
            <li>No single view of performance</li>
          </ul>
        </div>
        <div>
          <p className="mkt-kicker">KRIRIDER</p>
          <h2 className="mkt-h2">One platform. Your entire rental operation.</h2>
          <p className="mkt-lead" style={{ marginTop: '1rem' }}>
            The owner workspace is built around rental work: confirm a booking, assign a car, issue a contract, collect a signature, record a payment, close the return.
          </p>
          <div className="mkt-actions" style={{ marginTop: '1.3rem' }}>
            <PrimaryCta>Try KRIRIDER free</PrimaryCta>
          </div>
        </div>
      </div>
    </section>

    <section className="mkt-wrap mkt-section" id="features" style={{ paddingTop: 0 }}>
      <p className="mkt-kicker">Workspace</p>
      <h2 className="mkt-h2">The same product your team will open every morning.</h2>
      <ProductStage />
    </section>

    <section className="mkt-wrap mkt-section" style={{ paddingTop: 0 }}>
      <p className="mkt-kicker">Connected flow</p>
      <h2 className="mkt-h2">From reservation to accounting, everything stays connected.</h2>
      <div className="mkt-timeline" style={{ marginTop: '1.8rem' }}>
        {['Reservation', 'Customer', 'Vehicle', 'Contract', 'Signature', 'Payment', 'Return', 'Accounting'].map(
          (step, i) => (
            <article className="mkt-step" key={step}>
              <em>{String(i + 1).padStart(2, '0')}</em>
              <strong>{step}</strong>
            </article>
          ),
        )}
      </div>
    </section>

    <section className="mkt-wrap mkt-section">
      <div className="mkt-split">
        <div>
          <p className="mkt-kicker">Reservations</p>
          <h2 className="mkt-h2">Run the desk from one reservation workspace.</h2>
          <ul className="mkt-list">
            <li>Online, walk-in and WhatsApp channels</li>
            <li>Statuses from pending through return</li>
            <li>Calendar occupancy</li>
            <li>Role-based staff access</li>
          </ul>
        </div>
        <div>
          <BrowserFrame url="app.kririder.com/owner/manage-bookings">
            <ReservationsPreview />
          </BrowserFrame>
          <Note />
        </div>
      </div>
    </section>

    <section className="mkt-wrap mkt-section" style={{ paddingTop: 0 }}>
      <div className="mkt-split is-flip">
        <div>
          <p className="mkt-kicker">Fleet</p>
          <h2 className="mkt-h2">Availability is not a spreadsheet row.</h2>
          <ul className="mkt-list">
            <li>Vehicle records next to the booking that needs them</li>
            <li>Locations and maintenance in the same product</li>
            <li>Occupancy visible on the dashboard</li>
          </ul>
        </div>
        <div>
          <BrowserFrame url="app.kririder.com/owner/manage-cars">
            <FleetPreview />
          </BrowserFrame>
          <Note />
        </div>
      </div>
    </section>

    <section className="mkt-wrap mkt-section" style={{ paddingTop: 0 }}>
      <div className="mkt-split">
        <div>
          <p className="mkt-kicker">Contracts & signatures</p>
          <h2 className="mkt-h2">Documents generated from the rental — then signed remotely.</h2>
          <ul className="mkt-list">
            <li>Contracts and invoices from the booking</li>
            <li>Agency templates</li>
            <li>Customer completion link for documents and signature</li>
          </ul>
        </div>
        <div>
          <BrowserFrame url="app.kririder.com/owner/contracts">
            <ContractsPreview />
          </BrowserFrame>
          <Note />
        </div>
      </div>
    </section>

    <section className="mkt-wrap mkt-section" style={{ paddingTop: 0 }}>
      <div className="mkt-split is-flip">
        <div>
          <p className="mkt-kicker">Analytics</p>
          <h2 className="mkt-h2">Revenue and fleet activity without waiting for month-end.</h2>
          <ul className="mkt-list">
            <li>Weekly, monthly and yearly revenue</li>
            <li>Online versus walk-in</li>
            <li>CSV exports from reports</li>
          </ul>
        </div>
        <div>
          <BrowserFrame url="app.kririder.com/owner/analytics">
            <AnalyticsPreview />
          </BrowserFrame>
          <Note />
        </div>
      </div>
    </section>

    <section className="mkt-wrap mkt-section">
      <p className="mkt-kicker">Why KRIRIDER</p>
      <h2 className="mkt-h2">Built for car rental businesses. Not adapted from generic software.</h2>
      <div className="mkt-spec" style={{ marginTop: '1.6rem' }}>
        {[
          ['Rental workflow', 'Bookings, fleet states, contracts and returns are first-class objects.'],
          ['One operations desk', 'Staff work in a shared agency workspace instead of parallel tools.'],
          ['Fleet visibility', 'Availability, locations and maintenance sit next to reservations.'],
          ['Digital contracts', 'Documents are generated, not rewritten by hand.'],
          ['Electronic signatures', 'Customers complete files through a dedicated completion link.'],
          ['Financial view', 'Revenue, invoices and reports stay attached to activity.'],
          ['Roles', 'Owners and staff use permissions — not a shared password.'],
          ['Responsive workspace', 'Day-to-day actions work on a laptop or a phone browser.'],
          ['Tenant architecture', 'Each agency is isolated, with its own storefront and data.'],
        ].map(([title, text]) => (
          <article key={title}>
            <h3 className="mkt-h3">{title}</h3>
            <p className="mkt-lead" style={{ marginTop: '0.4rem', fontSize: '0.92rem' }}>
              {text}
            </p>
          </article>
        ))}
      </div>
    </section>

    <section className="mkt-wrap mkt-section" id="pricing">
      <p className="mkt-kicker">Pricing</p>
      <h2 className="mkt-h2">Start free. Choose a plan when the trial ends.</h2>
      <p className="mkt-lead" style={{ margin: '0.85rem 0 1.6rem' }}>
        Registration does not require a card. After {TRIAL_DAYS} days, continue on Starter, Professional or Business.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table className="mkt-matrix">
          <thead>
            <tr>
              <th> </th>
              {PLANS.map((plan) => (
                <th key={plan.id} className={plan.popular ? 'is-pop' : ''}>
                  {plan.popular ? <div className="mkt-kicker">Most popular</div> : null}
                  {plan.name}
                  <div className="mkt-amount" style={{ marginTop: '0.45rem' }}>
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
        Starter, Professional and Business are marketing names for Basic, Pro and Enterprise in the product catalog. Limits can be updated in marketing configuration without changing billing code.
      </p>
    </section>

    <section className="mkt-wrap mkt-section" style={{ paddingTop: 0 }}>
      <h2 className="mkt-h2">A simpler operating model.</h2>
      <div className="mkt-compare" style={{ marginTop: '1.6rem' }}>
        <article>
          <h3 className="mkt-h3">Traditional workflow</h3>
          <ul>
            <li>Spreadsheets</li>
            <li>WhatsApp as a booking desk</li>
            <li>Paper contracts</li>
            <li>Manual signatures</li>
            <li>Separate accounting</li>
            <li>Scattered customer files</li>
          </ul>
        </article>
        <article>
          <h3 className="mkt-h3">KRIRIDER</h3>
          <ul>
            <li>One centralized platform</li>
            <li>Digital reservations</li>
            <li>Fleet management</li>
            <li>Digital contracts</li>
            <li>Electronic signatures</li>
            <li>Integrated financial visibility</li>
            <li>Centralized customers</li>
          </ul>
        </article>
      </div>
    </section>

    <section className="mkt-wrap mkt-section">
      <p className="mkt-kicker">Wherever you are</p>
      <h2 className="mkt-h2">Manage your rental business wherever you are.</h2>
      <p className="mkt-lead" style={{ margin: '0.85rem 0 1.6rem' }}>
        The owner workspace is responsive. Reservation, customer and vehicle actions can be handled from a phone when you are not at the desk.
      </p>
      <div className="mkt-phones">
        <PhoneFrame title="Reservations">
          <p style={{ margin: 0, fontSize: 12, color: '#a39990' }}>Today · 12 bookings</p>
          <p style={{ margin: '12px 0 0', fontSize: 13 }}>RES-1842 · Confirmed</p>
          <p style={{ margin: '8px 0 0', fontSize: 13 }}>RES-1841 · Ready for pickup</p>
        </PhoneFrame>
        <PhoneFrame title="Customer">
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>A. El Amrani</p>
          <p style={{ margin: '8px 0 0', fontSize: 12, color: '#a39990' }}>History on the agency record</p>
        </PhoneFrame>
        <PhoneFrame title="Vehicle">
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Dacia Duster</p>
          <p style={{ margin: '8px 0 0', fontSize: 12, color: '#a39990' }}>Available · Casablanca</p>
        </PhoneFrame>
      </div>
      <p className="mkt-note">KRIRIDER is a responsive web workspace, not a separate native app for every screen.</p>
    </section>

    <section className="mkt-final">
      <div className="mkt-wrap mkt-section">
        <h2 className="mkt-h2">Ready to modernize your car rental business?</h2>
        <p className="mkt-lead" style={{ marginTop: '0.85rem' }}>
          Bring your reservations, fleet, customers and operations together with KRIRIDER.
        </p>
        <div className="mkt-actions" style={{ marginTop: '1.5rem' }}>
          <PrimaryCta variant="light">Start your free trial</PrimaryCta>
          <DemoCta>Create your account</DemoCta>
        </div>
      </div>
    </section>
  </MarketingLayout>
)

export default MarketingHome
