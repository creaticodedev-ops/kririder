import { ContactCta, PrimaryCta } from '../Ctas'
import { TRIAL_DAYS } from '../config'
import { useMktI18n } from '../i18n/MarketingI18n'

export const SaasFinalCta = () => {
  const { t } = useMktI18n()

  return (
    <section className="saas-final">
      <div className="mkt-wrap">
        <p className="saas-kicker">{t('final.kicker')}</p>
        <h2 className="saas-h2">{t('saas.finalTitle')}</h2>
        <p className="saas-lead">{t('final.lead', { days: TRIAL_DAYS })}</p>
        <div className="saas-final-actions">
          <PrimaryCta variant="light">{t('cta.trialLong')}</PrimaryCta>
          <ContactCta className="mkt-btn-ghost-light">{t('cta.talk')}</ContactCta>
        </div>
      </div>
    </section>
  )
}

export default SaasFinalCta
