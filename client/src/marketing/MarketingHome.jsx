import SeoHead from '../seo/SeoHead'
import { SITE_ORIGIN } from '../seo/constants'
import { organizationJsonLd, websiteJsonLd } from '../seo/jsonLd'
import { BRAND, CLIENTS, PLANS, SEO, TRIAL_DAYS } from './config'
import { DemoCta, PrimaryCta } from './Ctas'
import MarketingLayout from './MarketingLayout'
import { Caption, Crop, Frame, HeroScene, Reveal, SHOTS } from './experience'
import {
  ConnectScene,
  ContractChapter,
  Ecosystem,
  FinanceChapter,
  FleetChapter,
  ReservationChapter,
} from './chapters'
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
          <p className="mkt-badge">
            <i /> All-in-one car rental management platform
          </p>
          <h1 className="mkt-h1">
            The operating system for <em>modern car rental</em> businesses.
          </h1>
          <p className="mkt-lead">
            KRIRIDER brings reservations, fleet, customers, contracts, payments, invoices and analytics together in one
            owner workspace.
          </p>
          <div className="mkt-actions">
            <PrimaryCta arrow>Start your free trial</PrimaryCta>
            <a className="mkt-btn mkt-btn-ghost-light" href="#features">
              <span className="mkt-play" aria-hidden />
              Explore the platform
            </a>
          </div>
          <ul className="mkt-trust">
            <li>
              {TRIAL_DAYS}-day free trial · No payment to start · Used by {CLIENTS.map((c) => c.name).join(' and ')}
            </li>
          </ul>
        </div>
        <HeroScene />
      </div>
      <p className="mkt-xp-scrollhint">Scroll the operation</p>
    </section>

    <section className="mkt-xp-problem" id="product">
      <div className="mkt-wrap mkt-xp-problem-grid">
        <Reveal>
          <p className="mkt-kicker">02 — The problem</p>
          <h2 className="mkt-h2">Rental work fragments the moment it leaves the conversation.</h2>
          <p className="mkt-lead">
            A booking in one place, a car in another, a contract rewritten by hand, revenue waiting for month-end. The
            desk depends on whoever remembers.
          </p>
        </Reveal>
        <div className="mkt-xp-chaos" aria-hidden>
          <Reveal className="mkt-xp-chaos-item is-1" delay={0.04}>
            <Frame title="Reservations">
              <Crop src={SHOTS.reservations} pos="75% 30%" alt="" />
            </Frame>
          </Reveal>
          <Reveal className="mkt-xp-chaos-item is-2" delay={0.1}>
            <Frame title="Fleet">
              <Crop src={SHOTS.fleet} pos="40% 20%" alt="" />
            </Frame>
          </Reveal>
          <Reveal className="mkt-xp-chaos-item is-3" delay={0.16}>
            <Frame title="Contract">
              <Crop src={SHOTS.contracts} pos="60% 18%" alt="" />
            </Frame>
          </Reveal>
          <Reveal className="mkt-xp-chaos-item is-4" delay={0.22}>
            <Frame title="Revenue">
              <Crop src={SHOTS.revenues} pos="50% 22%" alt="" />
            </Frame>
          </Reveal>
        </div>
      </div>
    </section>

    <ConnectScene />
    <ReservationChapter />
    <FleetChapter />
    <ContractChapter />
    <FinanceChapter />
    <Ecosystem />

    <section className="mkt-wrap mkt-section" id="pricing">
      <Reveal className="mkt-intro">
        <p className="mkt-kicker">09 — Pricing</p>
        <h2 className="mkt-h2">Start free. Choose a plan when the trial ends.</h2>
        <p className="mkt-lead">
          Registration does not require a card. After {TRIAL_DAYS} days, continue on Starter, Professional or Business.
        </p>
      </Reveal>
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
        <p className="mkt-kicker">10 — Start</p>
        <h2 className="mkt-h2">Run your rental business with KRIRIDER.</h2>
        <p className="mkt-lead">
          Create an account in minutes. {TRIAL_DAYS}-day free trial — one per agency. No payment during registration.
        </p>
        <div className="mkt-actions">
          <PrimaryCta variant="light" arrow>
            Start your free trial
          </PrimaryCta>
          <DemoCta>Create your account</DemoCta>
        </div>
        <Caption />
      </div>
    </section>
  </MarketingLayout>
)

export default MarketingHome
