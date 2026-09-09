import { motion, useReducedMotion } from 'motion/react'
import { PrimaryCta } from '../Ctas'
import { TRIAL_DAYS } from '../config'
import { SHOTS } from '../productPreviews'
import { useMktI18n } from '../i18n/MarketingI18n'

const ease = [0.22, 1, 0.36, 1]

export const SaasHero = () => {
  const { t } = useMktI18n()
  const reduce = useReducedMotion()

  return (
    <section className="saas-hero">
      <div className="mkt-wrap saas-hero-grid">
        <div>
          <motion.p
            className="saas-badge"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <i aria-hidden />
            {t('hero.badge')}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
          >
            {t('saas.heroBefore')}
            <em>{t('saas.heroEm')}</em>
            {t('saas.heroAfter')}
          </motion.h1>
          <motion.p
            className="saas-lead"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.16, ease }}
          >
            {t('hero.lead')}
          </motion.p>
          <motion.div
            className="saas-hero-actions"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.26, ease }}
          >
            <PrimaryCta>{t('cta.trial')}</PrimaryCta>
            <a className="mkt-btn mkt-btn-ghost" href="#product">
              {t('cta.explore')}
            </a>
          </motion.div>
          <motion.p
            className="saas-hero-note"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.36 }}
          >
            {t('hero.note', { days: TRIAL_DAYS })}
          </motion.p>
        </div>

        <motion.div
          className="saas-hero-visual"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.2, ease }}
        >
          <div className="saas-float-card is-b" aria-hidden>
            <strong>{t('frames.reservations')}</strong>
            <span>{t('saas.floatDesk')}</span>
          </div>
          <div className="saas-device">
            <div className="saas-device-bar" aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <img
              src={SHOTS.dashboard}
              alt={t('alts.dashboard')}
              width={1280}
              height={800}
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <div className="saas-float-card is-a" aria-hidden>
            <strong>{t('frames.fleet')}</strong>
            <span>{t('saas.floatFleet')}</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SaasHero
