import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SeoHead from '../../seo/SeoHead'
import { useAppContext } from '../../context/AppContext'
import { getErrorMessage } from '../../utils/apiError'
import { resolveOwnerPermissions } from '../../utils/ownerPermissions'
import MarketingLayout from '../../marketing/MarketingLayout'
import BrandMark from '../../marketing/BrandMark'
import { BRAND, TRIAL_DAYS } from '../../marketing/config'

const COUNTRIES = ['Morocco', 'France', 'Spain', 'Belgium', 'United Kingdom', 'United Arab Emirates', 'Tunisia', 'Algeria', 'Senegal', 'Other']

const empty = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agencyName: '',
  country: 'Morocco',
  phone: '',
  city: '',
  fleetSize: '',
}

export const SignupPage = () => {
  const navigate = useNavigate()
  const { axios, isOwner, setToken, setUser, setIsOwner, setOnboardingRequired, applyLicense, setShowLogin } =
    useAppContext()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState(null)
  const [trialDays, setTrialDays] = useState(TRIAL_DAYS)

  useEffect(() => {
    if (isOwner) navigate('/owner', { replace: true })
  }, [isOwner, navigate])

  useEffect(() => {
    axios
      .get('/api/agency-onboarding/signup-info')
      .then(({ data }) => {
        if (data?.trialDays) setTrialDays(data.trialDays)
      })
      .catch(() => {})
  }, [axios])

  const setField = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }))

  const validateStep0 = () => {
    if (!form.name.trim()) return 'Enter your full name'
    if (!form.email.trim() || !form.email.includes('@')) return 'Enter a valid work email'
    if (form.password.length < 8) return 'Password must be at least 8 characters'
    if (form.password !== form.confirmPassword) return 'Passwords do not match'
    return ''
  }

  const validateStep1 = () => {
    if (!form.agencyName.trim()) return 'Enter your rental company name'
    if (!form.country.trim()) return 'Select a country'
    return ''
  }

  const next = () => {
    const msg = step === 0 ? validateStep0() : validateStep1()
    if (msg) {
      setError(msg)
      return
    }
    setError('')
    setStep((s) => s + 1)
  }

  const createWorkspace = async (event) => {
    event.preventDefault()
    if (submitting) return
    const first = validateStep0()
    const second = validateStep1()
    if (first || second) {
      setError(first || second)
      setStep(first ? 0 : 1)
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const { data } = await axios.post('/api/agency-onboarding/signup', {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        agencyName: form.agencyName.trim(),
        country: form.country,
        phone: form.phone.trim(),
        city: form.city.trim(),
        fleetSize: form.fleetSize.trim(),
      })
      if (!data?.success || !data.token) {
        throw new Error(data?.message || 'Could not create the account')
      }
      localStorage.setItem('token', data.token)
      axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
      setToken(data.token)
      setOnboardingRequired(false)
      setIsOwner(true)
      applyLicense?.(data.license, data.user)
      setUser({
        ...data.user,
        permissions: resolveOwnerPermissions(data.user?.permissions || []),
      })
      setCreated(data)
      setStep(3)
    } catch (err) {
      setError(getErrorMessage(err, err.response?.data?.message || 'Could not create the account'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MarketingLayout footer={false}>
      <SeoHead
        title="Create your KRIRIDER account"
        description="Start a free KRIRIDER trial and create your rental workspace in minutes."
        path="/signup"
        lang="en"
        locale="en_GB"
        siteName={BRAND}
      />
      <div className="mkt-signup">
        <aside className="mkt-signup-aside">
          <BrandMark variant="dark" size="foot" />
          <p className="mkt-kicker" style={{ marginTop: '2.4rem' }}>
            Free trial
          </p>
          <h1 className="mkt-h2">Your rental workspace, ready to run.</h1>
          <p className="mkt-lead" style={{ marginTop: '1rem' }}>
            {trialDays} days free. One trial per agency. No payment during registration.
          </p>
        </aside>
        <div className="mkt-wrap mkt-signup-main">
          {step < 3 ? (
            <form onSubmit={step === 2 ? createWorkspace : (e) => { e.preventDefault(); next() }} className="mkt-form" style={{ maxWidth: '28rem' }}>
              <p className="mkt-kicker">Create account</p>
              <h2 className="mkt-h2" style={{ fontSize: '2rem' }}>
                {step === 0 && 'Your account'}
                {step === 1 && 'Your rental business'}
                {step === 2 && 'Your workspace'}
              </h2>
              <div className="mkt-steps" aria-hidden>
                {['Account', 'Business', 'Workspace'].map((label, i) => (
                  <span key={label} className={i === step ? 'is-on' : ''}>
                    {label}
                  </span>
                ))}
              </div>

              {step === 0 && (
                <>
                  <div className="mkt-field">
                    <label htmlFor="su-name">Full name</label>
                    <input id="su-name" autoComplete="name" required value={form.name} onChange={setField('name')} />
                  </div>
                  <div className="mkt-field">
                    <label htmlFor="su-email">Work email</label>
                    <input id="su-email" type="email" autoComplete="email" required value={form.email} onChange={setField('email')} />
                  </div>
                  <div className="mkt-field">
                    <label htmlFor="su-pass">Password</label>
                    <input
                      id="su-pass"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={form.password}
                      onChange={setField('password')}
                    />
                  </div>
                  <div className="mkt-field">
                    <label htmlFor="su-pass2">Confirm password</label>
                    <input
                      id="su-pass2"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={form.confirmPassword}
                      onChange={setField('confirmPassword')}
                    />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="mkt-field">
                    <label htmlFor="su-agency">Company / agency name</label>
                    <input id="su-agency" required value={form.agencyName} onChange={setField('agencyName')} />
                  </div>
                  <div className="mkt-field">
                    <label htmlFor="su-country">Country</label>
                    <select id="su-country" value={form.country} onChange={setField('country')}>
                      {COUNTRIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mkt-field">
                    <label htmlFor="su-phone">Phone</label>
                    <input id="su-phone" type="tel" autoComplete="tel" value={form.phone} onChange={setField('phone')} />
                  </div>
                  <div className="mkt-field">
                    <label htmlFor="su-city">City (optional)</label>
                    <input id="su-city" value={form.city} onChange={setField('city')} />
                  </div>
                  <div className="mkt-field">
                    <label htmlFor="su-fleet">Fleet size (optional)</label>
                    <input id="su-fleet" placeholder="e.g. 12 vehicles" value={form.fleetSize} onChange={setField('fleetSize')} />
                  </div>
                </>
              )}

              {step === 2 && (
                <div>
                  <p className="mkt-lead">
                    KRIRIDER will create your owner account, {form.agencyName || 'your agency'}, and a {trialDays}-day trial workspace.
                  </p>
                  <p className="mkt-note">You will be signed in automatically. Existing emails cannot register twice.</p>
                </div>
              )}

              {error ? <p className="mkt-error">{error}</p> : null}

              <div className="mkt-actions">
                {step > 0 ? (
                  <button type="button" className="mkt-btn mkt-btn-ghost" onClick={() => { setError(''); setStep((s) => s - 1) }} disabled={submitting}>
                    Back
                  </button>
                ) : null}
                <button type="submit" className="mkt-btn mkt-btn-primary" disabled={submitting}>
                  {step === 2 ? (submitting ? 'Creating workspace…' : 'Create account') : 'Continue'}
                </button>
              </div>
              <p className="mkt-note">
                Already with KRIRIDER?{' '}
                <button type="button" className="mkt-btn mkt-btn-ghost" style={{ minHeight: 'auto', padding: 0, border: 0 }} onClick={() => setShowLogin(true)}>
                  Log in
                </button>
                {' · '}
                <Link to="/">Back to site</Link>
              </p>
            </form>
          ) : (
            <div className="mkt-form">
              <p className="mkt-kicker">Ready</p>
              <h2 className="mkt-h2">Welcome to KRIRIDER 👋</h2>
              <p className="mkt-lead" style={{ marginTop: '0.8rem' }}>
                Your workspace is ready{created?.agency?.name ? ` for ${created.agency.name}` : ''}. Trial: {created?.trialDays || trialDays} days.
              </p>
              <div className="mkt-actions" style={{ marginTop: '1.4rem' }}>
                <button type="button" className="mkt-btn mkt-btn-primary" onClick={() => navigate('/owner')}>
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MarketingLayout>
  )
}

export default SignupPage
