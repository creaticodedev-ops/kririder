import { motion, useReducedMotion } from 'motion/react'
import SeoHead from '../seo/SeoHead'
import { SITE_ORIGIN } from '../seo/constants'
import { organizationJsonLd, websiteJsonLd } from '../seo/jsonLd'
import { BRAND, CLIENTS, PLANS, SEO, TRIAL_DAYS } from './config'
import BrandMark from './BrandMark'
import { ContactCta, PrimaryCta } from './Ctas'
import MarketingLayout from './MarketingLayout'
import { Caption, Crop, Frame, HeroScene, Reveal, SHOTS } from './experience'
import { Ecosystem, FinanceChapter } from './chapters'
import './experience.css'

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

const Tick = () => (
  <svg className="mkt-tick" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3.2 8.4l3 3.1 6.6-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Shot = ({ title, src, pos, alt, overlay }) => {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={`mkt-spot-shot${overlay ? ' has-overlay' : ''}`}
      whileHover={reduce ? undefined : { y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Frame title={title}>
        <Crop src={src} pos={pos} alt={alt} />
      </Frame>
      {overlay ? (
        <motion.div
          className="mkt-spot-overlay"
          initial={reduce ? false : { opacity: 0, y: 18, x: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0, x: 0 }}
          viewport={{ once: true, margin: '-12%' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <Frame title={overlay.title}>
            <Crop src={overlay.src} pos={overlay.pos} alt={overlay.alt} />
          </Frame>
        </motion.div>
      ) : null}
    </motion.div>
  )
}

const Spotlight = ({ id, kicker, title, lead, points, shot, overlay, flip = false, tone = 'paper' }) => (
  <section id={id} className={`mkt-spot is-${tone}`}>
    <div className={`mkt-wrap mkt-spot-grid${flip ? ' is-flip' : ''}`}>
      <Reveal className="mkt-spot-copy">
        <p className="mkt-kicker">{kicker}</p>
        <h2 className="mkt-h2">{title}</h2>
        <p className="mkt-lead">{lead}</p>
        {points ? (
          <ul className="mkt-ticks">
            {points.map((item) => (
              <li key={item}>
                <Tick />
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mkt-actions">
          <PrimaryCta arrow>Start your free trial</PrimaryCta>
        </div>
      </Reveal>
      <Reveal className="mkt-spot-visual" delay={0.08}>
        <Shot {...shot} overlay={overlay} />
        <Caption />
      </Reveal>
    </div>
  </section>
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

    <section className="mkt-xp-hero">
      <div className="mkt-wrap mkt-xp-hero-grid">
        <div className="mkt-xp-hero-copy">
          <BrandMark variant="dark" size="hero" />
          <p className="mkt-badge">
            <i /> Car rental operating system
          </p>
          <h1 className="mkt-h1">
            The operating system for <em>modern car rental</em> businesses.
          </h1>
          <p className="mkt-lead">
            KRIRIDER is the platform rental companies use to run reservations, fleet, customers, contracts, payments,
            invoices and analytics from one workspace.
          </p>
          <ul className="mkt-points">
            <li>Save time at the desk</li>
            <li>Keep the fleet visible</li>
            <li>Close the rental digitally</li>
          </ul>
          <div className="mkt-actions">
            <PrimaryCta arrow>Start free trial</PrimaryCta>
            <a className="mkt-btn mkt-btn-ghost-light" href="#product">
              Explore the platform
            </a>
          </div>
          <p className="mkt-note mkt-note-light">
            {TRIAL_DAYS}-day free trial — one per agency. No payment to start.
          </p>
        </div>
        <HeroScene />
      </div>
    </section>

    <section className="mkt-proof" aria-label="Customers">
      <div className="mkt-wrap mkt-proof-row">
        <p>Trusted by car rental companies on KRIRIDER</p>
        <div className="mkt-proof-logos">
          {CLIENTS.map((client) => (
            <strong key={client.name}>
              {client.name}
              <span>Client</span>
            </strong>
          ))}
        </div>
      </div>
    </section>

    <Spotlight
      id="product"
      tone="paper"
      kicker="One workspace"
      title="Run your entire operation from one workspace."
      lead="The owner dashboard is the morning view: occupancy, bookings, revenue and fleet status — then the same product opens the work behind each number."
      points={['Bookings, fleet and revenue in one place', 'Walk-in and online in the same desk', 'Staff work in a shared agency account']}
      shot={{
        title: 'Dashboard',
        src: SHOTS.dashboard,
        pos: '50% 8%',
        alt: 'KRIRIDER dashboard with occupancy, bookings and fleet status',
      }}
    />

    <Spotlight
      id="features"
      tone="sand"
      flip
      kicker="Reservations"
      title="Reservations without the spreadsheet chaos."
      lead="Online, walk-in and WhatsApp channels share statuses from pending through return. The calendar, the list and the booking file are the same rental."
      points={['Calendar occupancy against live bookings', 'Walk-in created at the desk', 'Customer history on the agency record']}
      shot={{
        title: 'Calendar',
        src: SHOTS.calendar,
        pos: '50% 28%',
        alt: 'KRIRIDER reservation calendar',
      }}
      overlay={{
        title: 'Reservation',
        src: SHOTS.reservations,
        pos: '74% 30%',
        alt: 'KRIRIDER reservation list',
      }}
    />

    <Spotlight
      id="fleet"
      tone="paper"
      kicker="Fleet"
      title="A fleet that stays organized."
      lead="Each row is a physical vehicle — Fleet ID, VIN, plate, mileage and branch. Availability and maintenance sit next to the booking that needs the car."
      points={['Physical assets, not spreadsheet rows', 'Locations attached to the vehicle', 'Maintenance tracked per car']}
      shot={{
        title: 'Manage cars',
        src: SHOTS.fleet,
        pos: '48% 16%',
        alt: 'KRIRIDER fleet table with vehicles, plates and status',
      }}
      overlay={{
        title: 'Maintenance',
        src: SHOTS.maintenance,
        pos: '50% 20%',
        alt: 'KRIRIDER fleet maintenance',
      }}
    />

    <Spotlight
      id="contracts"
      tone="sand"
      flip
      kicker="Documents"
      title="Contracts and signatures, completely digital."
      lead="Contracts and invoices are generated from the rental. Customers complete files through a dedicated completion link — the stay is not retyped onto paper."
      points={['PDFs generated from the booking', 'Remote signature requests', 'Agency templates for contracts and invoices']}
      shot={{
        title: 'Contracts',
        src: SHOTS.contracts,
        pos: '52% 14%',
        alt: 'KRIRIDER contract workspace',
      }}
      overlay={{
        title: 'Signatures',
        src: SHOTS.signatures,
        pos: '68% 35%',
        alt: 'KRIRIDER signature requests',
      }}
    />

    <FinanceChapter />
    <Ecosystem />

    <section className="mkt-plans-band" id="pricing">
      <div className="mkt-wrap">
        <Reveal className="mkt-intro mkt-intro-center">
          <BrandMark variant="light" size="page" />
          <p className="mkt-kicker">Pricing</p>
          <h2 className="mkt-h2">Simple, transparent plans.</h2>
          <p className="mkt-lead">
            Start free. After {TRIAL_DAYS} days, continue on Starter, Professional or Business. No card during
            registration.
          </p>
        </Reveal>
        <div className="mkt-plans">
          {PLANS.map((plan) => (
            <Reveal key={plan.id} className={`mkt-plan${plan.popular ? ' is-pop' : ''}`}>
              {plan.popular ? <span className="mkt-plan-badge">Most popular</span> : null}
              <h3>{plan.name}</h3>
              <p className="mkt-amount">
                {plan.price}
                {plan.currency ? (
                  <small>
                    {plan.currency}/{plan.interval}
                  </small>
                ) : null}
              </p>
              <p className="mkt-plan-audience">{plan.audience}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Tick />
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.id === 'business' ? (
                <ContactCta>Talk to us</ContactCta>
              ) : (
                <PrimaryCta>Start free trial</PrimaryCta>
              )}
            </Reveal>
          ))}
        </div>
        <p className="mkt-note">
          Starter, Professional and Business are marketing names for Basic, Pro and Enterprise in the product catalog.
        </p>
      </div>
    </section>

    <section className="mkt-final">
      <div className="mkt-wrap">
        <p className="mkt-kicker">Get started</p>
        <h2 className="mkt-h2">Run your rental business with KRIRIDER.</h2>
        <p className="mkt-lead">
          Create an account in minutes. {TRIAL_DAYS}-day free trial — one per agency. No payment during registration.
        </p>
        <div className="mkt-actions">
          <PrimaryCta variant="light" arrow>
            Start your free trial
          </PrimaryCta>
          <ContactCta className="mkt-btn-ghost-light">Talk to us</ContactCta>
        </div>
      </div>
    </section>
  </MarketingLayout>
)

export default MarketingHome
