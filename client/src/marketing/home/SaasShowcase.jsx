import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { SHOTS } from '../productPreviews'
import { useMktI18n } from '../i18n/MarketingI18n'

const TABS = [
  { id: 'reservations', shot: 'reservations', alt: 'reservations' },
  { id: 'fleet', shot: 'fleet', alt: 'fleet' },
  { id: 'customers', shot: 'customers', alt: 'customers' },
  { id: 'contracts', shot: 'contracts', alt: 'contracts' },
  { id: 'finance', shot: 'revenues', alt: 'revenues' },
]

export const SaasShowcase = () => {
  const { t } = useMktI18n()
  const reduce = useReducedMotion()
  const [active, setActive] = useState(TABS[0].id)
  const current = TABS.find((tab) => tab.id === active) || TABS[0]

  return (
    <section className="saas-section saas-showcase" id="product">
      <div className="mkt-wrap">
        <div className="saas-intro">
          <p className="saas-kicker">{t('saas.showcaseKicker')}</p>
          <h2 className="saas-h2">{t('saas.showcaseTitle')}</h2>
          <p className="saas-lead">{t('saas.showcaseLead')}</p>
        </div>

        <div className="saas-tabs" role="tablist" aria-label={t('saas.showcaseKicker')}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              className="saas-tab"
              aria-selected={active === tab.id}
              onClick={() => setActive(tab.id)}
            >
              {t(`saas.show.${tab.id}.label`)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <div className="saas-show-frame">
              <img
                src={SHOTS[current.shot]}
                alt={t(`alts.${current.alt}`)}
                width={1400}
                height={860}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="saas-show-copy">
              <h3>{t(`saas.show.${current.id}.title`)}</h3>
              <p>{t(`saas.show.${current.id}.body`)}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default SaasShowcase
