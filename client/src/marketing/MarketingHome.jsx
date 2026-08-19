import { motion, useReducedMotion } from 'motion/react'
import SeoHead from '../seo/SeoHead'
import { SITE_ORIGIN } from '../seo/constants'
import { organizationJsonLd, websiteJsonLd } from '../seo/jsonLd'
import { BRAND, CLIENTS, PLANS, TRIAL_DAYS } from './config'
import { ContactCta, PrimaryCta } from './Ctas'
import MarketingLayout from './MarketingLayout'
import { HeroScene, Reveal } from './experience'
import { Ecosystem, FinanceChapter } from './chapters'
import { DeskAct, AssetAct } from './productActs'
import { FinalCta } from './FinalCta'
import { useMktI18n } from './i18n/MarketingI18n'

const ease = [0.22, 1, 0.36, 1]

const Tick = () => (
  <svg className="mkt-tick" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3.2 8.4l3 3.1 6.6-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const MarketingHome = () => (
  <MarketingLayout>
    <HomeInner />
  </MarketingLayout>
)

const HomeInner = () => {
  const { t, ta, htmlLang, ogLocale, dir } = useMktI18n()
  const reduce = useReducedMotion()
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

  const settle = () => (reduce ? false : { opacity: 0, y: 8, filter: 'blur(6px)' })
  const settleMove = (delay) => ({ duration: 0.95, delay, ease })

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
        <motion.div
          className="mkt-xp-hero-haze"
          aria-hidden
          initial={reduce ? false : { opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease }}
        />
        <div className="mkt-xp-hero-haze is-drift" aria-hidden />
        <div className="mkt-wrap mkt-xp-hero-grid">
          <div className="mkt-xp-hero-copy">
            <motion.p
              className="mkt-badge"
              initial={settle()}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={settleMove(0.18)}
            >
              <i /> {t('hero.badge')}
            </motion.p>
            <motion.h1
              className="mkt-h1"
              initial={settle()}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={settleMove(0.32)}
            >
              {t('hero.titleBefore')}
              <em>{t('hero.titleEm')}</em>
              {t('hero.titleAfter')}
            </motion.h1>
            <motion.p
              className="mkt-lead"
              initial={settle()}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={settleMove(0.48)}
            >
              {t('hero.lead')}
            </motion.p>
            <motion.ul
              className="mkt-points"
              initial={settle()}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={settleMove(0.62)}
            >
              <li>{t('hero.p1')}</li>
              <li>{t('hero.p2')}</li>
              <li>{t('hero.p3')}</li>
            </motion.ul>
            <motion.div
              className="mkt-actions"
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, delay: 1.22, ease }}
            >
              <PrimaryCta>{t('cta.trial')}</PrimaryCta>
              <a className="mkt-btn mkt-btn-ghost-light" href="#product">
                {t('cta.explore')}
              </a>
            </motion.div>
            <motion.p
              className="mkt-note mkt-note-light"
              initial={settle()}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={settleMove(1.28)}
            >
              {t('hero.note', { days: TRIAL_DAYS })}
            </motion.p>
          </div>
          <HeroScene />
        </div>
      </section>

      <section className="mkt-proof" aria-label={t('proof.label')}>
        <div className="mkt-wrap mkt-proof-plate">
          <p>{t('proof.plate')}</p>
          <ul>
            {CLIENTS.map((client) => (
              <li key={client.name}>
                <strong>{client.name}</strong>
                <span>{t('proof.client')}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <DeskAct />
      <AssetAct />
      <FinanceChapter />
      <Ecosystem />

      <section className="mkt-plans-band" id="pricing">
        <div className="mkt-wrap">
          <Reveal className="mkt-intro mkt-intro-center">
            <p className="mkt-kicker">{t('pricing.kicker')}</p>
            <h2 className="mkt-h2">{t('pricing.title')}</h2>
            <p className="mkt-lead">{t('pricing.lead', { days: TRIAL_DAYS })}</p>
          </Reveal>
          <div className="mkt-plans">
            {PLANS.map((plan, index) => (
              <Reveal key={plan.id} className={`mkt-plan${plan.popular ? ' is-pop' : ''}`} delay={index * 0.06}>
                <span className="mkt-plan-trim">
                  {String(index + 1).padStart(2, '0')}
                  {plan.popular ? <em>{t('pricing.popular')}</em> : null}
                </span>
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
