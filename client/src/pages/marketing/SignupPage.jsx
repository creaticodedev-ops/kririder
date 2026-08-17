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
import MktLangSwitch from '../../marketing/MktLangSwitch'
import { useMktI18n } from '../../marketing/i18n/MarketingI18n'
import { BRAND, CLIENTS, TRIAL_DAYS } from '../../marketing/config'
import '../../marketing/signup.css'

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

const Arrow = () => (
  <svg className="mkt-btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const SignupPage = () => (
  <MarketingLayout footer={false} nav={false}>
    <SignupInner />
  </MarketingLayout>
)

const SignupInner = () => {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const { t, ta, htmlLang, ogLocale, dir, isRtl } = useMktI18n()
  const { axios, isOwner, setToken, setUser, setIsOwner, setOnboardingRequired, applyLicense, setShowLogin } =
    useAppContext()
  const [step, setStep] = useState(0)
  const [slide, setSlide] = useState(1)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState(null)
  const [trialDays, setTrialDays] = useState(TRIAL_DAYS)
  const [minPassword, setMinPassword] = useState(8)
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [touched, setTouched] = useState({})
  const steps = ta('signup.steps')
  const flow = isRtl ? -1 : 1

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

  const blur = (key) => () => setTouched((prev) => ({ ...prev, [key]: true }))

  const fieldErrors = useMemo(() => {
    const next = {}
    if (touched.name && !form.name.trim()) next.name = t('signup.errName')
    if (touched.email && (!form.email.trim() || !form.email.includes('@'))) next.email = t('signup.errEmail')
    if (touched.password && form.password.length < minPassword) next.password = t('signup.errPassword', { min: minPassword })
    if (touched.confirmPassword && form.password !== form.confirmPassword) next.confirmPassword = t('signup.errMatch')
    if (touched.agencyName && !form.agencyName.trim()) next.agencyName = t('signup.errAgency')
    if (touched.country && !form.country.trim()) next.country = t('signup.errCountry')
    return next
  }, [form, touched, minPassword, t])

  const validateStep0 = () => {
    if (!form.name.trim()) return t('signup.errName')
    if (!form.email.trim() || !form.email.includes('@')) return t('signup.errEmail')
    if (form.password.length < minPassword) return t('signup.errPassword', { min: minPassword })
    if (form.password !== form.confirmPassword) return t('signup.errMatch')
    return ''
  }

  const validateStep1 = () => {
    if (!form.agencyName.trim()) return t('signup.errAgency')
    if (!form.country.trim()) return t('signup.errCountry')
    return ''
  }

  const stepReady = step === 0 ? !validateStep0() : step === 1 ? !validateStep1() : true
  const strength = passwordScore(form.password)
  const strengthLabel = strength === 1 ? t('signup.weak') : strength === 2 ? t('signup.medium') : strength === 3 ? t('signup.strong') : ''

  const go = (next) => {
    setSlide(next > step ? 1 : -1)
    setError('')
    setStep(next)
  }

  const next = () => {
    const msg = step === 0 ? validateStep0() : validateStep1()
    if (msg) {
      setError(msg)
      setTouched((prev) =>
        step === 0
          ? { ...prev, name: true, email: true, password: true, confirmPassword: true }
          : { ...prev, agencyName: true, country: true },
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
        throw new Error(data?.message || t('signup.fail'))
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
      setError(getErrorMessage(err, err.response?.data?.message || t('signup.fail')))
    } finally {
      setSubmitting(false)
    }
  }

  const transition = reduce ? { duration: 0 } : { duration: 0.38, ease }
  const stepKicker =
    step === 0 ? t('signup.stepAccount') : step === 1 ? t('signup.stepBusiness') : t('signup.stepWorkspace')

  return (
    <>
      <SeoHead
        title={t('seo.signupTitle')}
        description={t('seo.signupDescription')}
        path="/signup"
        lang={htmlLang}
        dir={dir}
        locale={ogLocale}
        siteName={BRAND}
      />
      <div className="onboard">
        <div className="onboard-bg" aria-hidden>
          <div className="onboard-haze" />
        </div>
        <header className="onboard-top">
          <BrandMark variant="dark" size="nav" />
          <div className="onboard-top-links">
            <MktLangSwitch />
            <button type="button" onClick={() => setShowLogin(true)}>
              {t('nav.login')}
            </button>
            <Link to="/">{t('signup.backToSite')}</Link>
          </div>
        </header>

        <div className="onboard-body">
          <div className="onboard-intro">
            <p className="mkt-kicker">{t('signup.kicker')}</p>
            <h1>
              {t('signup.titleBefore')}
              <em>{t('signup.titleEm')}</em>
            </h1>
            <p>{t('signup.leadShort', { days: trialDays })}</p>
          </div>
          <div className="onboard-copy">
            <p className="mkt-kicker">{t('signup.kicker')}</p>
            <h1>
              {t('signup.titleBefore')}
              <em>{t('signup.titleEm')}</em>
            </h1>
            <p className="mkt-lead">{t('signup.lead', { days: trialDays })}</p>
            <ul className="onboard-points">
              <li>
                <PointIco d="M4 10h12M4 6h12M4 14h8" />
                <div>
                  <strong>{t('signup.point1Title')}</strong>
                  <span>{t('signup.point1')}</span>
                </div>
              </li>
              <li>
                <PointIco d="M10 3l7 4v6c0 3.2-2.8 5.5-7 7-4.2-1.5-7-3.8-7-7V7l7-4z" />
                <div>
                  <strong>{t('signup.point2Title')}</strong>
                  <span>{t('signup.point2')}</span>
                </div>
              </li>
              <li>
                <PointIco d="M4 11l4 4 8-8" />
                <div>
                  <strong>{t('signup.point3Title', { days: trialDays })}</strong>
                  <span>{t('signup.point3')}</span>
                </div>
              </li>
            </ul>
            <div className="onboard-clients">
              <p>{t('signup.trusted')}</p>
              <div>
                {CLIENTS.map((client) => (
                  <strong key={client.name}>
                    {client.name}
                    <span>{t('signup.client')}</span>
                  </strong>
                ))}
              </div>
            </div>
          </div>

          <SignupStage />

          <div className="onboard-form">
            {step < 3 ? (
              <form
                onSubmit={
                  step === 2
                    ? createWorkspace
                    : (e) => {
                        e.preventDefault()
                        next()
                      }
                }
              >
                <div className="onboard-progress" aria-label={t('signup.stepsAria')}>
                  {steps.map((label, i) => (
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
                    initial={reduce ? false : { opacity: 0, x: 18 * slide * flow, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={reduce ? undefined : { opacity: 0, x: -14 * slide * flow, filter: 'blur(6px)' }}
                    transition={transition}
                  >
                    <p className="onboard-step-kicker">
                      {t('signup.stepLabel', { n: String(step + 1).padStart(2, '0'), name: stepKicker })}
                    </p>
                    <h2>
                      {step === 0 && t('signup.hAccount')}
                      {step === 1 && t('signup.hBusiness')}
                      {step === 2 && t('signup.hWorkspace')}
                    </h2>
                    <p className="mkt-lead">
                      {step === 0 && t('signup.leadAccount')}
                      {step === 1 && t('signup.leadBusiness')}
                      {step === 2 &&
                        t('signup.leadWorkspace', {
                          agency: form.agencyName || t('signup.yourAgency'),
                          days: trialDays,
                        })}
                    </p>

                    {step === 0 && (
                      <div className="onboard-fields">
                        <Field id="su-name" label={t('signup.name')} error={fieldErrors.name}>
                          <input id="su-name" autoComplete="name" required value={form.name} onChange={setField('name')} onBlur={blur('name')} />
                        </Field>
                        <Field id="su-email" label={t('signup.email')} error={fieldErrors.email}>
                          <input id="su-email" type="email" autoComplete="email" required value={form.email} onChange={setField('email')} onBlur={blur('email')} />
                        </Field>
                        <Field id="su-pass" label={t('signup.password')} error={fieldErrors.password}>
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
                            <button
                              type="button"
                              className="onboard-eye"
                              aria-label={showPass ? t('signup.hidePassword') : t('signup.showPassword')}
                              onClick={() => setShowPass((v) => !v)}
                            >
                              <Eye off={showPass} />
                            </button>
                          </div>
                          {form.password ? (
                            <div className={`onboard-strength${strength === 2 ? ' is-ok' : ''}${strength === 3 ? ' is-strong' : ''}`}>
                              <i className={strength >= 1 ? 'is-on' : ''} />
                              <i className={strength >= 2 ? 'is-on' : ''} />
                              <i className={strength >= 3 ? 'is-on' : ''} />
                              <span>{t('signup.strength', { level: strengthLabel })}</span>
                            </div>
                          ) : null}
                        </Field>
                        <Field id="su-pass2" label={t('signup.confirm')} error={fieldErrors.confirmPassword}>
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
                            <button
                              type="button"
                              className="onboard-eye"
                              aria-label={showPass2 ? t('signup.hidePassword') : t('signup.showPassword')}
                              onClick={() => setShowPass2((v) => !v)}
                            >
                              <Eye off={showPass2} />
                            </button>
                          </div>
                        </Field>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="onboard-fields">
                        <Field id="su-agency" label={t('signup.agency')} error={fieldErrors.agencyName}>
                          <input id="su-agency" required value={form.agencyName} onChange={setField('agencyName')} onBlur={blur('agencyName')} />
                        </Field>
                        <Field id="su-country" label={t('signup.country')} error={fieldErrors.country}>
                          <select id="su-country" value={form.country} onChange={setField('country')} onBlur={blur('country')}>
                            {COUNTRIES.map((country) => (
                              <option key={country} value={country}>
                                {t(`countries.${country}`)}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field id="su-phone" label={t('signup.phone')}>
                          <input id="su-phone" type="tel" autoComplete="tel" value={form.phone} onChange={setField('phone')} />
                        </Field>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="onboard-fields">
                        <Field id="su-city" label={t('signup.city')}>
                          <input id="su-city" value={form.city} onChange={setField('city')} />
                        </Field>
                        <Field id="su-fleet" label={t('signup.fleet')}>
                          <input id="su-fleet" placeholder={t('signup.fleetPh')} value={form.fleetSize} onChange={setField('fleetSize')} />
                        </Field>
                        <div className="onboard-recap">
                          <div>
                            <span>{t('signup.recapOwner')}</span> {form.name || '—'}
                          </div>
                          <div>
                            <span>{t('signup.recapEmail')}</span> {form.email || '—'}
                          </div>
                          <div>
                            <span>{t('signup.recapAgency')}</span> {form.agencyName || '—'} · {t(`countries.${form.country}`)}
                          </div>
                        </div>
                        <p className="mkt-lead" style={{ margin: 0 }}>
                          {t('signup.autoSignin')}
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
                      {t('signup.back')}
                    </button>
                  ) : null}
                  <button type="submit" className="onboard-cta" disabled={submitting || !stepReady}>
                    {submitting ? <span className="onboard-spin" aria-hidden /> : null}
                    {step === 2 ? (submitting ? t('signup.creating') : t('signup.create')) : t('cta.continue')}
                    {step < 2 ? <Arrow /> : null}
                  </button>
                </div>
                <p className="onboard-login">
                  {t('signup.already')}{' '}
                  <button type="button" onClick={() => setShowLogin(true)}>
                    {t('nav.login')}
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
                <p className="onboard-step-kicker">{t('signup.readyKicker')}</p>
                <h2>{t('signup.welcome')}</h2>
                <p className="mkt-lead">
                  {t('signup.readyLead', {
                    forAgency: created?.agency?.name ? t('signup.forAgency', { name: created.agency.name }) : '',
                    days: created?.trialDays || trialDays,
                  })}
                </p>
                <div className="onboard-actions">
                  <button type="button" className="onboard-cta" onClick={() => navigate('/owner')}>
                    {t('signup.openDash')}
                    <Arrow />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="onboard-rail">
          <div>
            <strong>{t('signup.rail1t', { days: trialDays })}</strong>
            <span>{t('signup.rail1s')}</span>
          </div>
          <div>
            <strong>{t('signup.rail2t')}</strong>
            <span>{t('signup.rail2s')}</span>
          </div>
          <div>
            <strong>{t('signup.rail3t')}</strong>
            <span>{t('signup.rail3s')}</span>
          </div>
          <div>
            <strong>{t('signup.rail4t')}</strong>
            <span>{t('signup.rail4s')}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignupPage
