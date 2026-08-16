import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SeoHead from '../../seo/SeoHead'
import MarketingLayout from '../../marketing/MarketingLayout'
import { BRAND, CONTACT_EMAIL, CONTACT_WHATSAPP } from '../../marketing/config'

export const ContactPage = () => {
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

  const subject = useMemo(
    () => (form.intent === 'demo' ? `KRIRIDER demo request — ${form.company || form.name}` : `KRIRIDER trial request — ${form.company || form.name}`),
    [form.intent, form.company, form.name],
  )

  const body = useMemo(
    () =>
      [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Company: ${form.company}`,
        `Fleet size: ${form.fleet || '—'}`,
        `Request: ${form.intent === 'demo' ? 'Book a demo' : 'Start free trial'}`,
        '',
        form.message || '',
      ].join('\n'),
    [form],
  )

  const onSubmit = (event) => {
    event.preventDefault()
    if (CONTACT_EMAIL) {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }
    setSent(true)
  }

  return (
    <MarketingLayout>
      <SeoHead
        title="Contact KRIRIDER"
        description="Start a KRIRIDER evaluation or book a product demo for your car rental business."
        path="/contact"
        lang="en"
        locale="en_GB"
        siteName={BRAND}
      />
      <section className="mkt-wrap mkt-section">
        <p className="mkt-kicker">Contact</p>
        <h1 className="mkt-h1" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          {intentParam === 'demo' ? 'Book a demo' : 'Start your KRIRIDER evaluation'}
        </h1>
        <p className="mkt-lead" style={{ marginTop: '1rem' }}>
          Tell us about your rental operation. There is no public self-serve signup — new agencies are provisioned by the KRIRIDER team.
        </p>

        {sent ? (
          <p className="mkt-lead" style={{ marginTop: '2rem' }}>
            {CONTACT_EMAIL
              ? 'Your email client should open with the request. If it does not, write to us using the address below.'
              : 'Your request details are ready. Add VITE_PLATFORM_SUPPORT_EMAIL to send automatically, or share this summary with your KRIRIDER contact.'}
          </p>
        ) : (
          <form className="mkt-form" style={{ marginTop: '2rem' }} onSubmit={onSubmit}>
            <div className="mkt-field">
              <label htmlFor="mkt-name">Name</label>
              <input id="mkt-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="mkt-field">
              <label htmlFor="mkt-email">Work email</label>
              <input
                id="mkt-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="mkt-field">
              <label htmlFor="mkt-company">Rental company</label>
              <input id="mkt-company" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div className="mkt-field">
              <label htmlFor="mkt-fleet">Fleet size</label>
              <input id="mkt-fleet" value={form.fleet} onChange={(e) => setForm({ ...form, fleet: e.target.value })} />
            </div>
            <div className="mkt-field">
              <label htmlFor="mkt-intent">Request</label>
              <select id="mkt-intent" value={form.intent} onChange={(e) => setForm({ ...form, intent: e.target.value })}>
                <option value="trial">Start Free Trial</option>
                <option value="demo">Book a Demo</option>
              </select>
            </div>
            <div className="mkt-field">
              <label htmlFor="mkt-message">Message</label>
              <textarea id="mkt-message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <button type="submit" className="mkt-btn mkt-btn-primary">
              Send request
            </button>
          </form>
        )}

        <p className="mkt-note">
          {CONTACT_EMAIL ? (
            <>
              Email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'inherit' }}>
                {CONTACT_EMAIL}
              </a>
              {CONTACT_WHATSAPP ? (
                <>
                  {' '}
                  · WhatsApp{' '}
                  <a href={`https://wa.me/${CONTACT_WHATSAPP}`} style={{ color: 'inherit' }}>
                    {CONTACT_WHATSAPP}
                  </a>
                </>
              ) : null}
            </>
          ) : (
            'Set VITE_PLATFORM_SUPPORT_EMAIL so requests open a mail composer to your team.'
          )}
        </p>
      </section>
    </MarketingLayout>
  )
}

export default ContactPage
