import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import SeoHead from '../../seo/SeoHead'
import { useAppContext } from '../../context/AppContext'
import { getErrorMessage } from '../../utils/apiError'
import { resolveOwnerPermissions } from '../../utils/ownerPermissions'
import MarketingLayout from '../../marketing/MarketingLayout'
import BrandMark from '../../marketing/BrandMark'
import SignupStage from '../../marketing/SignupStage'
import { BRAND, CLIENTS, TRIAL_DAYS } from '../../marketing/config'
import '../../marketing/signup.css'

const COUNTRIES = ['Morocco', 'France', 'Spain', 'Belgium', 'United Kingdom', 'United Arab Emirates', 'Tunisia', 'Algeria', 'Senegal', 'Other']
const STEPS = ['Account', 'Business', 'Workspace']

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

const ease = [0.22, 1, 0.36, 1]

const passwordScore = (value) => {
  if (!value) return 0
  let score = 0
  if (value.length >= 8) score += 1
  if (value.length >= 12) score += 1
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1
  if (/\d/.test(value)) score += 1
  if (/[^A-Za-z0-9]/.test(value)) score += 1
  if (score <= 2) return 1
  if (score <= 3) return 2
  return 3
}

const Eye = ({ off = false }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    {off ? (
      <path d="M3 3l12 12M7.2 7.4A3 3 0 0011 12M8.1 5.2A6.8 6.8 0 019 5.1c3.4 0 6 2.3 7.4 3.9a.8.8 0 010 1c-.5.6-1.2 1.3-2.1 1.9M4.4 6.2C3.3 6.9 2.4 7.8 1.6 8.6a.8.8 0 000 1C3 11.3 5.6 13.5 9 13.5c.6 0 1.2-.1 1.7-.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    ) : (
      <>
        <path d="M1.6 9s2.8-4.4 7.4-4.4S16.4 9 16.4 9s-2.8 4.4-7.4 4.4S1.6 9 1.6 9z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="9" cy="9" r="2.3" stroke="currentColor" strokeWidth="1.5" />
      </>
    )}
  </svg>
)

const PointIco = ({ d }) => (
  <svg className="onboard-ico" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Field = ({ id, label, error, children }) => (
  <div className={`onboard-field${error ? ' is-bad' : ''}`}>
    <label htmlFor={id}>{label}</label>
    {children}
    {error ? <p className="onboard-hint">{error}</p> : null}
  </div>
)

export const SignupPage = () => {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const { axios, isOwner, setToken, setUser, setIsOwner, setOnboardingRequired, applyLicense, setShowLogin } =
    useAppContext()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState(null)
  const [trialDays, setTrialDays] = useState(TRIAL_DAYS)
  const [minPassword, setMinPassword] = useState(8)
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (isOwner && !created) navigate('/owner', { replace: true })
  }, [isOwner, created, navigate])

  useEffect(() => {
    axios
      .get('/api/agency-onboarding/signup-info')
      .then(({ data }) => {
        if (data?.trialDays) setTrialDays(data.trialDays)
        if (data?.passwordMinLength) setMinPassword(data.passwordMinLength)
      })
      .catch(() => {})
  }, [axios])

  const setField = (key) => (event) => {
    const value = event.target.value
    setForm((f) => ({ ...f, [key]: value }))
    if (error) setError('')
  }

  const blur = (key) => () => setTouched((t) => ({ ...t, [key]: true }))

  const fieldErrors = useMemo(() => {
    const next = {}
    if (touched.name && !form.name.trim()) next.name = 'Enter your full name'
    if (touched.email && (!form.email.trim() || !form.email.includes('@'))) next.email = 'Enter a valid work email'
    if (touched.password && form.password.length < minPassword) next.password = `Password must be at least ${minPassword} characters`
    if (touched.confirmPassword && form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match'
    if (touched.agencyName && !form.agencyName.trim()) next.agencyName = 'Enter your rental company name'
    if (touched.country && !form.country.trim()) next.country = 'Select a country'
    return next
  }, [form, touched, minPassword])

  const validateStep0 = () => {
    if (!form.name.trim()) return 'Enter your full name'
    if (!form.email.trim() || !form.email.includes('@')) return 'Enter a valid work email'
    if (form.password.length < minPassword) return `Password must be at least ${minPassword} characters`
    if (form.password !== form.confirmPassword) return 'Passwords do not match'
    return ''
  }

  const validateStep1 = () => {
    if (!form.agencyName.trim()) return 'Enter your rental company name'
    if (!form.country.trim()) return 'Select a country'
    return ''
  }

  const stepReady = step === 0 ? !validateStep0() : step === 1 ? !validateStep1() : true
  const strength = passwordScore(form.password)
  const strengthLabel = strength === 1 ? 'Weak' : strength === 2 ? 'Medium' : strength === 3 ? 'Strong' : ''

  const go = (next) => {
    setDir(next > step ? 1 : -1)
    setError('')
    setStep(next)
  }

  const next = () => {
    const msg = step === 0 ? validateStep0() : validateStep1()
    if (msg) {
      setError(msg)
      setTouched((t) =>
        step === 0
          ? { ...t, name: true, email: true, password: true, confirmPassword: true }
          : { ...t, agencyName: true, country: true },
      )
      return
    }
    go(step + 1)
  }

  const createWorkspace = async (event) => {
    event.preventDefault()
    if (submitting) return
    const first = validateStep0()
    const second = validateStep1()
    if (first || second) {
      setError(first || second)
      go(first ? 0 : 1)
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
      setCreated(data)
      setToken(data.token)
      setOnboardingRequired(false)
      setIsOwner(true)
      applyLicense?.(data.license, data.user)
      setUser({
        ...data.user,
        permissions: resolveOwnerPermissions(data.user?.permissions || []),
      })
      go(3)
    } catch (err) {
      setError(getErrorMessage(err, err.response?.data?.message || 'Could not create the account'))
    } finally {
      setSubmitting(false)
    }
  }

  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.38, ease }

  return (
    <MarketingLayout footer={false} nav={false}>
      <SeoHead
        title="Create your KRIRIDER account"
        description="Start a free KRIRIDER trial and create your rental workspace in minutes."
        path="/signup"
        lang="en"
        locale="en_GB"
        siteName={BRAND}
      />
      <div className="onboard">
        <div className="onboard-bg" aria-hidden>
          <div className="onboard-haze" />
        </div>
        <header className="onboard-top">
          <BrandMark variant="dark" size="nav" />
          <div className="onboard-top-links">
            <button type="button" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <Link to="/">Back to site</Link>
          </div>
        </header>

        <div className="onboard-body">
          <div className="onboard-intro">
            <p className="mkt-kicker">Start your free trial</p>
            <h1>
              Your rental workspace <em>starts here.</em>
            </h1>
            <p>
              {trialDays} days free. No payment required.
            </p>
          </div>
          <div className="onboard-copy">
            <p className="mkt-kicker">Start your free trial</p>
            <h1>
              Your rental workspace <em>starts here.</em>
            </h1>
            <p className="mkt-lead">
              {trialDays} days free. No payment required. Create your owner account and open a KRIRIDER workspace for
              reservations, fleet, customers and contracts.
            </p>
            <ul className="onboard-points">
              <li>
                <PointIco d="M4 10h12M4 6h12M4 14h8" />
                <div>
                  <strong>One operating system</strong>
                  <span>Reservations, fleet, customers, contracts and daily operations in one workspace.</span>
                </div>
              </li>
              <li>
                <PointIco d="M10 3l7 4v6c0 3.2-2.8 5.5-7 7-4.2-1.5-7-3.8-7-7V7l7-4z" />
                <div>
                  <strong>Built for rental companies</strong>
                  <span>KRIRIDER is the platform. Your agency brand stays yours.</span>
                </div>
              </li>
              <li>
                <PointIco d="M4 11l4 4 8-8" />
                <div>
                  <strong>{trialDays}-day trial</strong>
                  <span>One trial per agency. No payment during registration.</span>
                </div>
              </li>
            </ul>
            <div className="onboard-clients">
              <p>Trusted by car rental companies on KRIRIDER</p>
              <div>
                {CLIENTS.map((client) => (
                  <strong key={client.name}>
                    {client.name}
                    <span>Client</span>
                  </strong>
                ))}
              </div>
            </div>
          </div>

          <SignupStage />

          <div className="onboard-form">
            {step < 3 ? (
              <form onSubmit={step === 2 ? createWorkspace : (e) => { e.preventDefault(); next() }}>
                <div className="onboard-progress" aria-label="Registration steps">
                  {STEPS.map((label, i) => (
                    <span key={label} style={{ display: 'contents' }}>
                      {i > 0 ? <i /> : null}
                      <button
                        type="button"
                        className={step === i ? 'is-on' : step > i ? 'is-done' : ''}
                        disabled={i > step}
                        onClick={() => i < step && go(i)}
                      >
                        <b>{String(i + 1).padStart(2, '0')}</b>
                        {label}
                      </button>
                    </span>
                  ))}
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    initial={reduce ? false : { opacity: 0, x: 18 * dir, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={reduce ? undefined : { opacity: 0, x: -14 * dir, filter: 'blur(6px)' }}
                    transition={transition}
                  >
                    <p className="onboard-step-kicker">
                      Step {String(step + 1).padStart(2, '0')} — {step === 0 ? 'Your account' : step === 1 ? 'Your business' : 'Your workspace'}
                    </p>
                    <h2>
                      {step === 0 && 'Let’s create your account.'}
                      {step === 1 && 'Tell us about the agency.'}
                      {step === 2 && 'Prepare the workspace.'}
                    </h2>
                    <p className="mkt-lead">
                      {step === 0 && 'This becomes the owner login for your KRIRIDER workspace.'}
                      {step === 1 && 'Your company name is how the workspace will appear.'}
                      {step === 2 &&
                        `KRIRIDER will create your owner account, ${form.agencyName || 'your agency'}, and a ${trialDays}-day trial workspace.`}
                    </p>

                    {step === 0 && (
                      <div className="onboard-fields">
                        <Field id="su-name" label="Full name" error={fieldErrors.name}>
                          <input id="su-name" autoComplete="name" required value={form.name} onChange={setField('name')} onBlur={blur('name')} />
                        </Field>
                        <Field id="su-email" label="Work email" error={fieldErrors.email}>
                          <input id="su-email" type="email" autoComplete="email" required value={form.email} onChange={setField('email')} onBlur={blur('email')} />
                        </Field>
                        <Field id="su-pass" label="Password" error={fieldErrors.password}>
                          <div className="onboard-pass">
                            <input
                              id="su-pass"
                              type={showPass ? 'text' : 'password'}
                              autoComplete="new-password"
                              required
                              minLength={minPassword}
                              value={form.password}
                              onChange={setField('password')}
                              onBlur={blur('password')}
                            />
                            <button type="button" className="onboard-eye" aria-label={showPass ? 'Hide password' : 'Show password'} onClick={() => setShowPass((v) => !v)}>
                              <Eye off={showPass} />
                            </button>
                          </div>
                          {form.password ? (
                            <div className={`onboard-strength${strength === 2 ? ' is-ok' : ''}${strength === 3 ? ' is-strong' : ''}`}>
                              <i className={strength >= 1 ? 'is-on' : ''} />
                              <i className={strength >= 2 ? 'is-on' : ''} />
                              <i className={strength >= 3 ? 'is-on' : ''} />
                              <span>{strengthLabel} strength</span>
                            </div>
                          ) : null}
                        </Field>
                        <Field id="su-pass2" label="Confirm password" error={fieldErrors.confirmPassword}>
                          <div className="onboard-pass">
                            <input
                              id="su-pass2"
                              type={showPass2 ? 'text' : 'password'}
                              autoComplete="new-password"
                              required
                              value={form.confirmPassword}
                              onChange={setField('confirmPassword')}
                              onBlur={blur('confirmPassword')}
                            />
                            <button type="button" className="onboard-eye" aria-label={showPass2 ? 'Hide password' : 'Show password'} onClick={() => setShowPass2((v) => !v)}>
                              <Eye off={showPass2} />
                            </button>
                          </div>
                        </Field>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="onboard-fields">
                        <Field id="su-agency" label="Company / agency name" error={fieldErrors.agencyName}>
                          <input id="su-agency" required value={form.agencyName} onChange={setField('agencyName')} onBlur={blur('agencyName')} />
                        </Field>
                        <Field id="su-country" label="Country" error={fieldErrors.country}>
                          <select id="su-country" value={form.country} onChange={setField('country')} onBlur={blur('country')}>
                            {COUNTRIES.map((c) => (
                              <option key={c}>{c}</option>
                            ))}
                          </select>
                        </Field>
                        <Field id="su-phone" label="Phone (optional)">
                          <input id="su-phone" type="tel" autoComplete="tel" value={form.phone} onChange={setField('phone')} />
                        </Field>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="onboard-fields">
                        <Field id="su-city" label="City (optional)">
                          <input id="su-city" value={form.city} onChange={setField('city')} />
                        </Field>
                        <Field id="su-fleet" label="Fleet size (optional)">
                          <input id="su-fleet" placeholder="e.g. 12 vehicles" value={form.fleetSize} onChange={setField('fleetSize')} />
                        </Field>
                        <div className="onboard-recap">
                          <div>
                            <span>Owner</span> {form.name || '—'}
                          </div>
                          <div>
                            <span>Email</span> {form.email || '—'}
                          </div>
                          <div>
                            <span>Agency</span> {form.agencyName || '—'} · {form.country}
                          </div>
                        </div>
                        <p className="mkt-lead" style={{ margin: 0 }}>
                          You will be signed in automatically. Existing emails cannot register twice.
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {error ? (
                  <p className="onboard-error" role="alert">
                    {error}
                  </p>
                ) : null}

                <div className="onboard-actions">
                  {step > 0 ? (
                    <button type="button" className="onboard-back" onClick={() => go(step - 1)} disabled={submitting}>
                      Back
                    </button>
                  ) : null}
                  <button type="submit" className="onboard-cta" disabled={submitting || !stepReady}>
                    {submitting ? <span className="onboard-spin" aria-hidden /> : null}
                    {step === 2 ? (submitting ? 'Creating workspace…' : 'Create account') : 'Continue'}
                    {step < 2 ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </button>
                </div>
                <p className="onboard-login">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setShowLogin(true)}>
                    Log in
                  </button>
                </p>
              </form>
            ) : (
              <motion.div
                className="onboard-success"
                initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease }}
              >
                <div className="onboard-mark" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3.2 8.4l3 3.1 6.6-7" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="onboard-step-kicker">Workspace ready</p>
                <h2>Welcome to KRIRIDER.</h2>
                <p className="mkt-lead">
                  Your workspace is ready{created?.agency?.name ? ` for ${created.agency.name}` : ''}. Trial:{' '}
                  {created?.trialDays || trialDays} days.
                </p>
                <div className="onboard-actions">
                  <button type="button" className="onboard-cta" onClick={() => navigate('/owner')}>
                    Open dashboard
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="onboard-rail">
          <div>
            <strong>{trialDays} days free</strong>
            <span>No payment during registration</span>
          </div>
          <div>
            <strong>One trial per agency</strong>
            <span>Owner account + workspace</span>
          </div>
          <div>
            <strong>Ready after signup</strong>
            <span>Signed in automatically</span>
          </div>
          <div>
            <strong>Your brand stays yours</strong>
            <span>KRIRIDER is the platform</span>
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}

export default SignupPage
