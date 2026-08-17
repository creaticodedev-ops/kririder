import SeoHead from '../../seo/SeoHead'
import BrandMark from '../../marketing/BrandMark'
import MarketingLayout from '../../marketing/MarketingLayout'
import { BRAND, CLIENTS } from '../../marketing/config'
import { DemoCta, PrimaryCta } from '../../marketing/Ctas'
import { useMktI18n } from '../../marketing/i18n/MarketingI18n'

export const AboutPage = () => (
  <MarketingLayout>
    <AboutInner />
  </MarketingLayout>
)

const AboutInner = () => {
  const { t, htmlLang, ogLocale, dir } = useMktI18n()
  const clients = CLIENTS.map((client) => client.name).join(t('proof.and'))

  return (
    <>
      <SeoHead
        title={t('seo.aboutTitle')}
        description={t('seo.aboutDescription')}
        path="/about"
        lang={htmlLang}
        dir={dir}
        locale={ogLocale}
        siteName={BRAND}
      />
      <section className="mkt-wrap mkt-section">
        <BrandMark variant="light" size="page" />
        <p className="mkt-kicker">{t('about.kicker')}</p>
        <h1 className="mkt-h1" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
          {t('about.title')}
        </h1>
        <p className="mkt-lead" style={{ marginTop: '1.2rem' }}>
          {t('about.p1')}
        </p>
        <p className="mkt-lead" style={{ marginTop: '1rem' }}>
          {t('about.p2', { clients })}
        </p>
        <div className="mkt-actions" style={{ marginTop: '1.8rem' }}>
          <PrimaryCta>{t('cta.trial')}</PrimaryCta>
          <DemoCta />
        </div>
      </section>
    </>
  )
}

export default AboutPage
