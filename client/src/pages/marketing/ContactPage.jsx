import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SeoHead from '../../seo/SeoHead'
import BrandMark from '../../marketing/BrandMark'
import MarketingLayout from '../../marketing/MarketingLayout'
import { BRAND, CONTACT_EMAIL, CONTACT_WHATSAPP } from '../../marketing/config'
import { useMktI18n } from '../../marketing/i18n/MarketingI18n'

export const ContactPage = () => (
  <MarketingLayout>
    <ContactInner />
  </MarketingLayout>
)

const ContactInner = () => {
  const { t, htmlLang, ogLocale, dir } = useMktI18n()
  const [params] = useSearchParams()
  const intentParam = params.get('intent') === 'demo' ? 'demo' : 'trial'
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    fleet: '',
    intent: intentParam,
    message: '',
  })

  const who = form.company || form.name
  const subject = useMemo(
    () =>
      form.intent === 'demo'
        ? t('contact.subjectDemo', { who })
        : t('contact.subjectTrial', { who }),
    [form.intent, t, who],
  )

  const body = useMemo(
    () =>
      [
        `${t('contact.bodyName')}: ${form.name}`,
        `${t('contact.bodyEmail')}: ${form.email}`,
        `${t('contact.bodyCompany')}: ${form.company}`,
        `${t('contact.bodyFleet')}: ${form.fleet || '—'}`,
        `${t('contact.bodyRequest')}: ${form.intent === 'demo' ? t('contact.intentDemo') : t('contact.intentTrial')}`,
        '',
        form.message || '',
      ].join('\n'),
    [form, t],
  )

  const onSubmit = (event) => {
    event.preventDefault()
    if (CONTACT_EMAIL) {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }
    setSent(true)
  }

  return (
    <>
      <SeoHead
        title={t('seo.contactTitle')}
        description={t('seo.contactDescription')}
        path="/contact"
        lang={htmlLang}
        dir={dir}
        locale={ogLocale}
        siteName={BRAND}
      />
      <section className="mkt-wrap mkt-section">
        <BrandMark variant="light" size="page" />
        <p className="mkt-kicker">{t('contact.kicker')}</p>
        <h1 className="mkt-h1" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          {intentParam === 'demo' ? t('contact.titleDemo') : t('contact.titleTrial')}
        </h1>
        <p className="mkt-lead" style={{ marginTop: '1rem' }}>
          {t('contact.leadBefore')}{' '}
          <Link to="/signup" style={{ color: 'inherit' }}>
            {t('contact.leadLink')}
          </Link>
          . {t('contact.leadAfter')}
        </p>

        {sent ? (
          <p className="mkt-lead" style={{ marginTop: '2rem' }}>
            {CONTACT_EMAIL ? t('contact.sentMail') : t('contact.sentManual')}
          </p>
        ) : (
          <form className="mkt-form" style={{ marginTop: '2rem' }} onSubmit={onSubmit}>
            <div className="mkt-field">
              <label htmlFor="mkt-name">{t('contact.name')}</label>
              <input id="mkt-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="mkt-field">
              <label htmlFor="mkt-email">{t('contact.email')}</label>
              <input
                id="mkt-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="mkt-field">
              <label htmlFor="mkt-company">{t('contact.company')}</label>
              <input id="mkt-company" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div className="mkt-field">
              <label htmlFor="mkt-fleet">{t('contact.fleet')}</label>
              <input id="mkt-fleet" value={form.fleet} onChange={(e) => setForm({ ...form, fleet: e.target.value })} />
            </div>
            <div className="mkt-field">
              <label htmlFor="mkt-intent">{t('contact.request')}</label>
              <select id="mkt-intent" value={form.intent} onChange={(e) => setForm({ ...form, intent: e.target.value })}>
                <option value="trial">{t('contact.intentTrial')}</option>
                <option value="demo">{t('contact.intentDemo')}</option>
              </select>
            </div>
            <div className="mkt-field">
              <label htmlFor="mkt-message">{t('contact.message')}</label>
              <textarea id="mkt-message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <button type="submit" className="mkt-btn mkt-btn-primary">
              {t('contact.send')}
            </button>
          </form>
        )}

        <p className="mkt-note">
          {CONTACT_EMAIL ? (
            <>
              {t('contact.emailLabel')}{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'inherit' }}>
                {CONTACT_EMAIL}
              </a>
              {CONTACT_WHATSAPP ? (
                <>
                  {' '}
                  · {t('contact.whatsapp')}{' '}
                  <a href={`https://wa.me/${CONTACT_WHATSAPP}`} style={{ color: 'inherit' }}>
                    {CONTACT_WHATSAPP}
                  </a>
                </>
              ) : null}
            </>
          ) : (
            t('contact.noEmail')
          )}
        </p>
      </section>
    </>
  )
}

export default ContactPage
