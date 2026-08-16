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
    lowPrice: '299',
    highPrice: '599',
    offerCount: 3,
  },
}

const UiNote = ({ children = 'KRIRIDER workspace. Sample operational data for demonstration — not a live agency account.' }) => (
  <p className="mkt-caption">{children}</p>
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

    <section className="mkt-wrap mkt-hero">
      <div>
        <p className="mkt-kicker">Car rental management software</p>
        <h1 className="mkt-h1">The Operating System for Modern Car Rental Businesses</h1>
        <p className="mkt-lead" style={{ marginTop: '1.15rem' }}>
          Manage reservations, vehicles, customers, contracts, accounting and daily operations from one powerful platform.
        </p>
        <div className="mkt-actions" style={{ marginTop: '1.6rem' }}>
          <PrimaryCta />
          <DemoCta />
        </div>
        <p className="mkt-note">Existing agencies log in to the owner workspace. New teams start with a {TRIAL_DAYS}-day evaluation.</p>
      </div>
      <div>
        <BrowserFrame>
          <DashboardPreview />
        </BrowserFrame>
        <UiNote />
      </div>
    </section>

    <section className="mkt-trust" aria-label="Customers">
      <div className="mkt-wrap mkt-trust-row">
        <p className="mkt-kicker" style={{ margin: 0 }}>
          Built for modern car rental businesses
        </p>
        {CLIENTS.map((client) => (
          <div className="mkt-client" key={client.name}>
            <strong>{client.name}</strong>
            <span>KRIRIDER client</span>
          </div>
        ))}
      </div>
    </section>

    <section className="mkt-wrap mkt-section" id="product">
      <div className="mkt-split">
        <div>
          <p className="mkt-kicker">The problem</p>
          <h2 className="mkt-h2">Your rental business shouldn't depend on disconnected tools.</h2>
          <ul className="mkt-list">
            <li>Reservations managed across different systems</li>
            <li>Vehicle availability difficult to track</li>
            <li>Customer information scattered</li>
            <li>Contracts handled manually</li>
            <li>Payments and expenses difficult to monitor</li>
            <li>Too many spreadsheets and disconnected tools</li>
            <li>Lack of visibility into business performance</li>
          </ul>
        </div>
        <div>
          <p className="mkt-kicker">The platform</p>
          <h2 className="mkt-h2">One platform. Your entire rental operation.</h2>
          <p className="mkt-lead" style={{ marginTop: '1rem' }}>
            KRIRIDER brings reservations, fleet, customers, documents and reporting into a single operational workspace — designed around how rental companies actually work.
          </p>
          <div className="mkt-actions" style={{ marginTop: '1.4rem' }}>
            <PrimaryCta />
          </div>
        </div>
      </div>
    </section>

    <section className="mkt-wrap mkt-section" id="features" style={{ paddingTop: 0 }}>
      <p className="mkt-kicker">Product modules</p>
      <h2 className="mkt-h2">Every core workflow, in one product.</h2>
      <div className="mkt-modules" style={{ marginTop: '2rem' }}>
        <article className="mkt-mod mkt-mod-lg">
          <h3 className="mkt-h3">Reservations</h3>
          <p>Create, manage and track rental reservations from one operational workspace — including walk-in bookings and calendar planning.</p>
          <div style={{ marginTop: '1.1rem' }}>
            <BrowserFrame url="app.kririder.com/owner/manage-bookings">
              <ReservationsPreview />
            </BrowserFrame>
          </div>
        </article>
        <article className="mkt-mod">
          <h3 className="mkt-h3">Fleet management</h3>
          <p>Manage vehicles, availability, locations, maintenance and vehicle-related information.</p>
        </article>
        <article className="mkt-mod">
          <h3 className="mkt-h3">Customers</h3>
          <p>Centralize customer profiles, rental history and operational information.</p>
        </article>
        <article className="mkt-mod">
          <h3 className="mkt-h3">Contracts</h3>
          <p>Generate and manage professional rental contracts and documents from the reservation.</p>
        </article>
        <article className="mkt-mod">
          <h3 className="mkt-h3">Electronic signatures</h3>
          <p>Send a completion link so customers can review documents and sign remotely.</p>
        </article>
        <article className="mkt-mod">
          <h3 className="mkt-h3">Revenue & invoicing</h3>
          <p>Track revenue, payments and invoices alongside daily operations — without a separate spreadsheet trail.</p>
        </article>
        <article className="mkt-mod">
          <h3 className="mkt-h3">Analytics & reports</h3>
          <p>Understand revenue, fleet activity and business performance from the owner workspace.</p>
        </article>
      </div>
      <p className="mkt-note">
        KRIRIDER also includes staff roles, WhatsApp operational settings, a public booking storefront, audit logs and document templates. Modules such as chauffeurs, brokers or partner networks are not part of the current product.
      </p>
    </section>

    <section className="mkt-wrap mkt-section" style={{ paddingTop: 0 }}>
      <p className="mkt-kicker">Connected operations</p>
      <h2 className="mkt-h2">From reservation to accounting, everything stays connected.</h2>
      <p className="mkt-lead" style={{ margin: '0.9rem 0 2rem' }}>
        A booking is not a silo. Customer, vehicle, contract, signature, payment and return remain attached to the same operation.
      </p>
      <div className="mkt-flow">
        {['Reservation', 'Customer', 'Vehicle', 'Contract', 'Signature', 'Payment', 'Return', 'Accounting'].map((step, i) => (
          <article className="mkt-step" key={step}>
            <em>{String(i + 1).padStart(2, '0')}</em>
            <strong>{step}</strong>
          </article>
        ))}
      </div>
    </section>

    <section className="mkt-wrap mkt-section">
      <div className="mkt-split">
        <div>
          <p className="mkt-kicker">Reservations</p>
          <h2 className="mkt-h2">Run the day from one reservation workspace.</h2>
          <p className="mkt-lead" style={{ marginTop: '0.9rem' }}>
            Confirm, assign vehicles, follow pickup and return, and keep customer communication attached to the booking.
          </p>
          <ul className="mkt-list">
            <li>Online, walk-in and WhatsApp booking channels</li>
            <li>Status from pending to completed</li>
            <li>Calendar for occupancy planning</li>
            <li>Staff access with role-based permissions</li>
          </ul>
        </div>
        <div>
          <BrowserFrame url="app.kririder.com/owner/manage-bookings">
            <ReservationsPreview />
          </BrowserFrame>
          <UiNote />
        </div>
      </div>
    </section>

    <section className="mkt-wrap mkt-section" style={{ paddingTop: 0 }}>
      <div className="mkt-split is-flip">
        <div>
          <p className="mkt-kicker">Fleet</p>
          <h2 className="mkt-h2">Know which cars are available — and which are not.</h2>
          <p className="mkt-lead" style={{ marginTop: '0.9rem' }}>
            Vehicle records, locations, maintenance and availability live next to the reservation that needs them.
          </p>
          <ul className="mkt-list">
            <li>Fleet list with availability states</li>
            <li>Pickup locations</li>
            <li>Maintenance tracking</li>
            <li>Vehicle statistics</li>
          </ul>
        </div>
        <div>
          <BrowserFrame url="app.kririder.com/owner/manage-cars">
            <FleetPreview />
          </BrowserFrame>
          <UiNote />
        </div>
      </div>
    </section>

    <section className="mkt-wrap mkt-section" style={{ paddingTop: 0 }}>
      <div className="mkt-split">
        <div>
          <p className="mkt-kicker">Contracts & signatures</p>
          <h2 className="mkt-h2">Professional contracts without the paper chase.</h2>
          <p className="mkt-lead" style={{ marginTop: '0.9rem' }}>
            Generate rental documents from the booking, then send a secure completion flow for customer signature.
          </p>
          <ul className="mkt-list">
            <li>Contract and invoice generation</li>
            <li>Export templates owned by the agency</li>
            <li>Remote document + signature completion</li>
            <li>Agency branding on customer-facing documents</li>
          </ul>
          <div className="mkt-actions" style={{ marginTop: '1.3rem' }}>
            <DemoCta />
          </div>
        </div>
        <div>
          <BrowserFrame url="app.kririder.com/owner/contracts">
            <ContractsPreview />
          </BrowserFrame>
          <UiNote />
        </div>
      </div>
    </section>

    <section className="mkt-wrap mkt-section" style={{ paddingTop: 0 }}>
      <div className="mkt-split is-flip">
        <div>
          <p className="mkt-kicker">Analytics</p>
          <h2 className="mkt-h2">See performance without waiting for month-end.</h2>
          <p className="mkt-lead" style={{ marginTop: '0.9rem' }}>
            Revenue and fleet activity are visible in the owner dashboard and exportable from reports.
          </p>
          <ul className="mkt-list">
            <li>Weekly, monthly and yearly revenue</li>
            <li>Online versus walk-in revenue</li>
            <li>Occupancy and utilization</li>
            <li>CSV report exports</li>
          </ul>
        </div>
        <div>
          <BrowserFrame url="app.kririder.com/owner/analytics">
            <AnalyticsPreview />
          </BrowserFrame>
          <UiNote />
        </div>
      </div>
    </section>

    <section className="mkt-wrap mkt-section">
      <p className="mkt-kicker">Why KRIRIDER</p>
      <h2 className="mkt-h2">Built for car rental businesses. Not adapted from generic software.</h2>
      <p className="mkt-lead" style={{ margin: '0.9rem 0 2rem' }}>
        KRIRIDER is designed around the real workflow of rental companies — from the first reservation to return and reporting.
      </p>
      <div className="mkt-why">
        {[
          ['Rental-specific workflows', 'Bookings, fleet states, contracts and returns are first-class — not bolted onto a generic CRM.'],
          ['Centralized operations', 'One workspace for staff instead of parallel tools for each department.'],
          ['Fleet visibility', 'Availability, locations and maintenance sit next to reservations.'],
          ['Digital contracts', 'Documents are generated from the booking, not rewritten by hand.'],
          ['Electronic signatures', 'Customers complete documents and sign through a dedicated completion link.'],
          ['Financial visibility', 'Revenue, invoices and reports stay attached to operational activity.'],
          ['Role-based administration', 'Owners and staff work with permissions, not a shared password.'],
          ['Responsive owner workspace', 'Day-to-day operational screens are usable on smaller devices.'],
          ['Modern SaaS architecture', 'Each agency is an isolated tenant with its own storefront, branding and data.'],
        ].map(([title, text]) => (
          <article key={title}>
            <h3 className="mkt-h3">{title}</h3>
            <p className="mkt-lead" style={{ marginTop: '0.45rem', fontSize: '0.95rem' }}>
              {text}
            </p>
          </article>
        ))}
      </div>
    </section>

    <section className="mkt-wrap mkt-section" id="pricing">
      <p className="mkt-kicker">Pricing</p>
      <h2 className="mkt-h2">Clear plans for growing rental companies.</h2>
      <p className="mkt-lead" style={{ margin: '0.9rem 0 2rem' }}>
        Start with an evaluation, then choose the plan that matches your fleet size and operational needs.
      </p>
      <div className="mkt-price-grid">
        {PLANS.map((plan) => (
          <article className={`mkt-price${plan.popular ? ' is-pop' : ''}`} key={plan.id}>
            {plan.popular ? <span className="mkt-badge">Most Popular</span> : null}
            <h3 className="mkt-h3">{plan.name}</h3>
            <p className="mkt-lead" style={{ marginTop: '0.45rem', fontSize: '0.92rem' }}>
              {plan.audience}
            </p>
            <p className="mkt-amount">
              {plan.price}
              {plan.currency ? (
                <small>
                  {' '}
                  {plan.currency}/{plan.interval}
                </small>
              ) : null}
            </p>
            <ul>
              {plan.features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <PrimaryCta intent={plan.intent}>{plan.cta}</PrimaryCta>
          </article>
        ))}
      </div>
      <p className="mkt-note">
        Display names are for this website. Limits follow the current KRIRIDER product catalog (Starter = Basic, Professional = Pro, Business = Enterprise). Prices are monthly in MAD and can be updated in the marketing configuration without changing billing code.
      </p>
    </section>

    <section className="mkt-wrap mkt-section" style={{ paddingTop: 0 }}>
      <h2 className="mkt-h2">A simpler operating model.</h2>
      <div className="mkt-compare" style={{ marginTop: '2rem' }}>
        <article>
          <h3 className="mkt-h3">Traditional workflow</h3>
          <ul>
            <li>Spreadsheets</li>
            <li>WhatsApp threads as a booking desk</li>
            <li>Paper contracts</li>
            <li>Manual signatures</li>
            <li>Separate accounting</li>
            <li>Scattered customer data</li>
          </ul>
        </article>
        <article className="is-kr">
          <h3 className="mkt-h3">KRIRIDER</h3>
          <ul>
            <li>One centralized platform</li>
            <li>Digital reservations</li>
            <li>Fleet management</li>
            <li>Digital contracts</li>
            <li>Electronic signatures</li>
            <li>Integrated financial visibility</li>
            <li>Centralized customer information</li>
          </ul>
        </article>
      </div>
    </section>

    <section className="mkt-wrap mkt-section">
      <p className="mkt-kicker">On the road</p>
      <h2 className="mkt-h2">Manage your rental business wherever you are.</h2>
      <p className="mkt-lead" style={{ margin: '0.9rem 0 2rem' }}>
        The owner workspace is responsive. Day-to-day reservation, customer and vehicle actions can be handled from a phone when you are not at the desk.
      </p>
      <div className="mkt-phones">
        <PhoneFrame title="Reservations">
          <p style={{ margin: 0, fontSize: 12, color: '#5e5854' }}>Today · 12 bookings</p>
          <p style={{ margin: '12px 0 0', fontSize: 13 }}>RES-1842 · Confirmed</p>
          <p style={{ margin: '8px 0 0', fontSize: 13 }}>RES-1841 · Ready for pickup</p>
          <p style={{ margin: '8px 0 0', fontSize: 13 }}>Walk-in · Active</p>
        </PhoneFrame>
        <PhoneFrame title="Customer">
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>A. El Amrani</p>
          <p style={{ margin: '8px 0 0', fontSize: 12, color: '#5e5854' }}>History attached to the agency record</p>
          <p style={{ margin: '12px 0 0', fontSize: 12 }}>Last stay · RES-1842</p>
        </PhoneFrame>
        <PhoneFrame title="Vehicle">
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Dacia Duster</p>
          <p style={{ margin: '8px 0 0', fontSize: 12, color: '#5e5854' }}>Available · Casablanca</p>
          <p style={{ margin: '12px 0 0', fontSize: 12 }}>Open in fleet</p>
        </PhoneFrame>
      </div>
      <p className="mkt-note">Not every owner screen is a dedicated native app. KRIRIDER is a responsive web workspace.</p>
    </section>

    <section className="mkt-final">
      <div className="mkt-wrap mkt-section">
        <h2 className="mkt-h2">Ready to modernize your car rental business?</h2>
        <p className="mkt-lead" style={{ marginTop: '0.9rem' }}>
          Bring your reservations, fleet, customers and operations together with KRIRIDER.
        </p>
        <div className="mkt-actions" style={{ marginTop: '1.6rem' }}>
          <PrimaryCta variant="light" />
          <DemoCta className="" />
        </div>
      </div>
    </section>
  </MarketingLayout>
)

export default MarketingHome
