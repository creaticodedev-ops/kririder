import SeoHead from '../../seo/SeoHead'
import BrandMark from '../../marketing/BrandMark'
import MarketingLayout from '../../marketing/MarketingLayout'
import { BRAND, CONTACT_EMAIL } from '../../marketing/config'
import { useMktI18n } from '../../marketing/i18n/MarketingI18n'

const LegalInner = ({ path, titleKey, descKey, kickerKey, headingKey, bodyKeys, questionKey, fallbackKey }) => {
  const { t, htmlLang, ogLocale, dir } = useMktI18n()

  return (
    <>
      <SeoHead
        title={t(titleKey)}
        description={t(descKey)}
        path={path}
        lang={htmlLang}
        dir={dir}
        locale={ogLocale}
        siteName={BRAND}
      />
      <section className="mkt-wrap mkt-section">
        <BrandMark variant="light" size="page" />
        <p className="mkt-kicker">{t(kickerKey)}</p>
        <h1 className="mkt-h1" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          {t(headingKey)}
        </h1>
        <div className="mkt-lead" style={{ marginTop: '1.2rem', display: 'grid', gap: '1rem' }}>
          {bodyKeys.map((key) => (
            <p key={key}>{t(key)}</p>
          ))}
          {CONTACT_EMAIL ? (
            <p>
              {t(questionKey)}{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          ) : fallbackKey ? (
            <p>{t(fallbackKey)}</p>
          ) : null}
        </div>
      </section>
    </>
  )
}

const PrivacyInner = () => (
  <LegalInner
    path="/privacy"
    titleKey="seo.privacyTitle"
    descKey="seo.privacyDescription"
    kickerKey="privacy.kicker"
    headingKey="privacy.title"
    bodyKeys={['privacy.p1', 'privacy.p2', 'privacy.p3', 'privacy.p4']}
    questionKey="privacy.questions"
    fallbackKey="privacy.fallback"
  />
)

const TermsInner = () => (
  <LegalInner
    path="/terms"
    titleKey="seo.termsTitle"
    descKey="seo.termsDescription"
    kickerKey="terms.kicker"
    headingKey="terms.title"
    bodyKeys={['terms.p1', 'terms.p2', 'terms.p3', 'terms.p4']}
    questionKey="terms.questions"
  />
)

export const PrivacyPage = () => (
  <MarketingLayout>
    <PrivacyInner />
  </MarketingLayout>
)

export const TermsPage = () => (
  <MarketingLayout>
    <TermsInner />
  </MarketingLayout>
)

export default PrivacyPage
