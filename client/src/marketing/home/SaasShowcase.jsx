import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { DemoRequestCta, WhatsAppDemoCta } from '../Ctas'
import { ProductShot, SHOT_META } from '../productPreviews'
import { useMktI18n } from '../i18n/MarketingI18n'

/** Curated product journey — real RSZ CAR workspace screens. */
const VIEWS = [
  { id: 'overview', shot: 'dashboard' },
  { id: 'desk', shot: 'reservations' },
  { id: 'planning', shot: 'calendar' },
  { id: 'fleet', shot: 'fleet' },
  { id: 'documents', shot: 'contracts' },
  { id: 'insights', shot: 'statistics' },
]

const FLOATS = [
  { id: 'fleet', pos: 'is-a' },
  { id: 'desk', pos: 'is-b' },
  { id: 'docs', pos: 'is-c' },
]

const prefetchShot = (shotId) => {
  const shot = SHOT_META[shotId]
  if (!shot || typeof window === 'undefined') return
  const href = shot.webp
  if ([...document.head.querySelectorAll('link[rel="prefetch"]')].some((n) => n.href.includes(href.split('/').pop()))) {
    return
  }
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.as = 'image'
  link.href = href
  link.type = 'image/webp'
  document.head.appendChild(link)
}

export const SaasShowcase = () => {
  const { t } = useMktI18n()
  const reduce = useReducedMotion()
  const baseId = useId()
  const [activeIdx, setActiveIdx] = useState(0)
  const [entered, setEntered] = useState(false)
  const [settled, setSettled] = useState(false)
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const active = VIEWS[activeIdx]

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true)
          io.disconnect()
        }
      },
      { rootMargin: '80px 0px', threshold: 0.12 }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!entered || reduce) {
      if (entered) setSettled(true)
      return undefined
    }
    const timer = window.setTimeout(() => setSettled(true), 1100)
    return () => window.clearTimeout(timer)
  }, [entered, reduce])

  useEffect(() => {
    if (!entered) return
    prefetchShot(VIEWS[(activeIdx + 1) % VIEWS.length].shot)
    prefetchShot(VIEWS[(activeIdx - 1 + VIEWS.length) % VIEWS.length].shot)
  }, [activeIdx, entered])

  useEffect(() => {
    if (reduce || !entered || !stageRef.current) return undefined
    if (typeof window === 'undefined' || !window.matchMedia('(pointer:fine)').matches) return undefined
    const node = stageRef.current
    const onMove = (event) => {
      const box = node.getBoundingClientRect()
      const x = ((event.clientX - box.left) / box.width - 0.5) * 2
      const y = ((event.clientY - box.top) / box.height - 0.5) * 2
      node.style.setProperty('--tilt-x', `${(y * -2.2).toFixed(2)}deg`)
      node.style.setProperty('--tilt-y', `${(x * 3.2).toFixed(2)}deg`)
      node.style.setProperty('--glow-x', `${((event.clientX - box.left) / box.width) * 100}%`)
      node.style.setProperty('--glow-y', `${((event.clientY - box.top) / box.height) * 100}%`)
    }
    const onLeave = () => {
      node.style.setProperty('--tilt-x', '0.5deg')
      node.style.setProperty('--tilt-y', '-1.6deg')
    }
    node.addEventListener('pointermove', onMove)
    node.addEventListener('pointerleave', onLeave)
    return () => {
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerleave', onLeave)
    }
  }, [entered, reduce])

  const select = useCallback((idx) => {
    setActiveIdx(idx)
  }, [])

  const onKeyNav = (event) => {
    let next = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (activeIdx + 1) % VIEWS.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (activeIdx - 1 + VIEWS.length) % VIEWS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = VIEWS.length - 1
    if (next === null) return
    event.preventDefault()
    setActiveIdx(next)
    event.currentTarget.querySelectorAll('[role="tab"]')[next]?.focus?.()
  }

  return (
    <section
      ref={sectionRef}
      className={`saas-section saas-showcase${entered ? ' is-in' : ''}${settled ? ' is-settled' : ''}${reduce ? ' is-reduced' : ''}`}
      id="product"
    >
      <div className="saas-premiere">
        <div className="mkt-wrap saas-premiere-grid">
          <div className="saas-premiere-copy">
            <p className="saas-premiere-eyebrow">{t('saas.premiere.eyebrow')}</p>
            <h2 className="saas-premiere-title">{t('saas.premiere.title')}</h2>
            <p className="saas-premiere-lead">{t('saas.premiere.lead')}</p>

            <div className="saas-premiere-actions">
              <DemoRequestCta className="saas-premiere-demo">{t('cta.demo')}</DemoRequestCta>
              <WhatsAppDemoCta className="saas-premiere-wa">{t('cta.whatsapp')}</WhatsAppDemoCta>
            </div>
            <p className="saas-premiere-note">{t('saas.premiere.note')}</p>
          </div>

          <div
            ref={stageRef}
            className="saas-premiere-stage"
            aria-hidden={false}
          >
            <div className="saas-premiere-glow" aria-hidden />
            <div className="saas-premiere-sweep" aria-hidden />

            {FLOATS.map((item) => (
              <div key={item.id} className={`saas-premiere-float ${item.pos}`} aria-hidden>
                <i />
                <span>{t(`saas.premiere.float.${item.id}`)}</span>
              </div>
            ))}

            <div className={`saas-premiere-frame${reduce ? '' : ' has-depth'}`}>
              <div className="saas-stage-chrome" aria-hidden>
                <span />
                <span />
                <span />
                <p>{t(`saas.show.${active.id}.chrome`)}</p>
              </div>
              <div className="saas-premiere-viewport" key={active.shot}>
                <ProductShot
                  id={active.shot}
                  alt={t(`alts.${active.shot}`)}
                  eager={activeIdx === 0}
                  sizes="(max-width: 900px) 94vw, min(720px, 52vw)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mkt-wrap saas-explore">
        <div className="saas-explore-head">
          <p className="saas-kicker">{t('saas.showcaseKicker')}</p>
          <h3 className="saas-explore-title">{t('saas.showcaseTitle')}</h3>
          <p className="saas-lead">{t('saas.showcaseLead')}</p>
        </div>

        <div className="saas-stage">
          <div className="saas-stage-rail" role="tablist" aria-label={t('saas.showcaseKicker')} onKeyDown={onKeyNav}>
            {VIEWS.map((view, idx) => {
              const selected = idx === activeIdx
              return (
                <button
                  key={view.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${view.id}`}
                  className="saas-stage-tab"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(idx)}
                  onMouseEnter={() => prefetchShot(view.shot)}
                  onFocus={() => prefetchShot(view.shot)}
                >
                  <span className="saas-stage-step" aria-hidden>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="saas-stage-tab-copy">
                    <strong>{t(`saas.show.${view.id}.label`)}</strong>
                    <span>{t(`saas.show.${view.id}.hint`)}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="saas-stage-main">
            <div
              className="saas-stage-caption saas-explore-caption"
              role="tabpanel"
              id={`${baseId}-panel`}
              aria-labelledby={`${baseId}-tab-${active.id}`}
            >
              <p className="saas-stage-index" aria-hidden>
                {String(activeIdx + 1).padStart(2, '0')} / {String(VIEWS.length).padStart(2, '0')}
              </p>
              <h3>{t(`saas.show.${active.id}.title`)}</h3>
              <p>{t(`saas.show.${active.id}.body`)}</p>
            </div>

            <div className="saas-stage-strip" aria-label={t('saas.showcaseKicker')}>
              {VIEWS.map((view, idx) => (
                <button
                  key={view.id}
                  type="button"
                  className={`saas-stage-thumb${idx === activeIdx ? ' is-active' : ''}`}
                  onClick={() => select(idx)}
                  onMouseEnter={() => prefetchShot(view.shot)}
                  aria-label={t(`saas.show.${view.id}.label`)}
                  aria-pressed={idx === activeIdx}
                >
                  {entered ? <ProductShot id={view.shot} alt="" sizes="120px" /> : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SaasShowcase
