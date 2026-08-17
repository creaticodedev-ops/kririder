import { motion, useReducedMotion } from 'motion/react'
import SeoHead from '../seo/SeoHead'
import { SITE_ORIGIN } from '../seo/constants'
import { organizationJsonLd, websiteJsonLd } from '../seo/jsonLd'
import { BRAND, CLIENTS, PLANS, TRIAL_DAYS } from './config'
import BrandMark from './BrandMark'
import { ContactCta, PrimaryCta } from './Ctas'
import MarketingLayout from './MarketingLayout'
import { Caption, Crop, Frame, HeroScene, Reveal, SHOTS } from './experience'
import { Ecosystem, FinanceChapter } from './chapters'
import { FinalCta } from './FinalCta'
import { useMktI18n } from './i18n/MarketingI18n'
import './experience.css'

const Tick = () => (
  <svg className="mkt-tick" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3.2 8.4l3 3.1 6.6-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Shot = ({ title, src, pos, alt, overlay, isRtl }) => {
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
          initial={reduce ? false : { opacity: 0, y: 18, x: isRtl ? -16 : 16 }}
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

const Spotlight = ({ id, kicker, title, lead, points, shot, overlay, flip = false, tone = 'paper', isRtl, cta }) => (
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
          <PrimaryCta arrow>{cta}</PrimaryCta>
        </div>
      </Reveal>
      <Reveal className="mkt-spot-visual" delay={0.08}>
        <Shot {...shot} overlay={overlay} isRtl={isRtl} />
        <Caption />
      </Reveal>
    </div>
  </section>
)

export const MarketingHome = () => (
  <MarketingLayout>
    <HomeInner />
  </MarketingLayout>
)

const HomeInner = () => {
  const { t, ta, htmlLang, ogLocale, dir } = useMktI18n()
  const isRtl = dir === 'rtl'
  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: BRAND,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: t('seo.homeDescription'),
    url: SITE_ORIGIN,
    inLanguage: htmlLang,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'MAD',
      lowPrice: '0',
      highPrice: '599',
      offerCount: 3,
    },
  }

  return (
    <>
    <SeoHead
      title={t('seo.homeTitle')}
      description={t('seo.homeDescription')}
      path="/"
      lang={htmlLang}
      dir={dir}
      locale={ogLocale}
      siteName={BRAND}
      jsonLd={[organizationJsonLd(null), { ...websiteJsonLd(null), inLanguage: htmlLang }, softwareJsonLd]}
    />

    <section className="mkt-xp-hero">
      <div className="mkt-wrap mkt-xp-hero-grid">
        <div className="mkt-xp-hero-copy">
          <BrandMark variant="dark" size="hero" />
          <p className="mkt-badge">
            <i /> {t('hero.badge')}
          </p>
          <h1 className="mkt-h1">
            {t('hero.titleBefore')}
            <em>{t('hero.titleEm')}</em>
            {t('hero.titleAfter')}
          </h1>
          <p className="mkt-lead">{t('hero.lead')}</p>
          <ul className="mkt-points">
            <li>{t('hero.p1')}</li>
            <li>{t('hero.p2')}</li>
            <li>{t('hero.p3')}</li>
          </ul>
          <div className="mkt-actions">
            <PrimaryCta arrow>{t('cta.trial')}</PrimaryCta>
            <a className="mkt-btn mkt-btn-ghost-light" href="#product">
              {t('cta.explore')}
            </a>
          </div>
          <p className="mkt-note mkt-note-light">{t('hero.note', { days: TRIAL_DAYS })}</p>
        </div>
        <HeroScene />
      </div>
    </section>

    <section className="mkt-proof" aria-label={t('proof.label')}>
      <div className="mkt-wrap mkt-proof-row">
        <p>{t('proof.title')}</p>
        <div className="mkt-proof-logos">
          {CLIENTS.map((client) => (
            <strong key={client.name}>
              {client.name}
              <span>{t('proof.client')}</span>
            </strong>
          ))}
        </div>
      </div>
    </section>

    <Spotlight
      id="product"
      tone="paper"
      isRtl={isRtl}
      cta={t('cta.trialLong')}
      kicker={t('spot.product.kicker')}
      title={t('spot.product.title')}
      lead={t('spot.product.lead')}
      points={[t('spot.product.p1'), t('spot.product.p2'), t('spot.product.p3')]}
      shot={{
        title: t('frames.dashboard'),
        src: SHOTS.dashboard,
        pos: '50% 8%',
        alt: t('alts.dashboard'),
      }}
    />

    <Spotlight
      id="features"
      tone="sand"
      flip
      isRtl={isRtl}
      cta={t('cta.trialLong')}
      kicker={t('spot.features.kicker')}
      title={t('spot.features.title')}
      lead={t('spot.features.lead')}
      points={[t('spot.features.p1'), t('spot.features.p2'), t('spot.features.p3')]}
      shot={{
        title: t('frames.calendar'),
        src: SHOTS.calendar,
        pos: '50% 28%',
        alt: t('alts.calendar'),
      }}
      overlay={{
        title: t('frames.reservation'),
        src: SHOTS.reservations,
        pos: '74% 30%',
        alt: t('alts.reservations'),
      }}
    />

    <Spotlight
      id="fleet"
      tone="paper"
      isRtl={isRtl}
      cta={t('cta.trialLong')}
      kicker={t('spot.fleet.kicker')}
      title={t('spot.fleet.title')}
      lead={t('spot.fleet.lead')}
      points={[t('spot.fleet.p1'), t('spot.fleet.p2'), t('spot.fleet.p3')]}
      shot={{
        title: t('frames.manageCars'),
        src: SHOTS.fleet,
        pos: '48% 16%',
        alt: t('alts.fleet'),
      }}
      overlay={{
        title: t('frames.maintenance'),
        src: SHOTS.maintenance,
        pos: '50% 20%',
        alt: t('alts.maintenance'),
      }}
    />

    <Spotlight
      id="contracts"
      tone="sand"
      flip
      isRtl={isRtl}
      cta={t('cta.trialLong')}
      kicker={t('spot.contracts.kicker')}
      title={t('spot.contracts.title')}
      lead={t('spot.contracts.lead')}
      points={[t('spot.contracts.p1'), t('spot.contracts.p2'), t('spot.contracts.p3')]}
      shot={{
        title: t('frames.contracts'),
        src: SHOTS.contracts,
        pos: '52% 14%',
        alt: t('alts.contracts'),
      }}
      overlay={{
        title: t('frames.signatures'),
        src: SHOTS.signatures,
        pos: '68% 35%',
        alt: t('alts.signatures'),
      }}
    />

    <FinanceChapter />
    <Ecosystem />

    <section className="mkt-plans-band" id="pricing">
      <div className="mkt-wrap">
        <Reveal className="mkt-intro mkt-intro-center">
          <BrandMark variant="light" size="page" />
          <p className="mkt-kicker">{t('pricing.kicker')}</p>
          <h2 className="mkt-h2">{t('pricing.title')}</h2>
          <p className="mkt-lead">{t('pricing.lead', { days: TRIAL_DAYS })}</p>
        </Reveal>
        <div className="mkt-plans">
          {PLANS.map((plan) => (
            <Reveal key={plan.id} className={`mkt-plan${plan.popular ? ' is-pop' : ''}`}>
              {plan.popular ? <span className="mkt-plan-badge">{t('pricing.popular')}</span> : null}
              <h3>{t(`pricing.${plan.id}.name`)}</h3>
              <p className="mkt-amount">
                {plan.id === 'business' ? t('pricing.business.price') : plan.price}
                {plan.currency ? (
                  <small>
                    {plan.currency}/{t('pricing.month')}
                  </small>
                ) : null}
              </p>
              <p className="mkt-plan-audience">{t(`pricing.${plan.id}.audience`)}</p>
              <ul>
                {ta(`pricing.${plan.id}.features`).map((feature) => (
                  <li key={feature}>
                    <Tick />
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.id === 'business' ? (
                <ContactCta>{t('cta.talk')}</ContactCta>
              ) : (
                <PrimaryCta>{t('cta.trial')}</PrimaryCta>
              )}
            </Reveal>
          ))}
        </div>
        <p className="mkt-note">{t('pricing.note')}</p>
      </div>
    </section>

    <FinalCta />
  </>
  )
}

export default MarketingHome
