import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
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

const prefetchShot = (shotId) => {
  const shot = SHOT_META[shotId]
  if (!shot || typeof window === 'undefined') return
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.as = 'image'
  link.href = shot.webp
  link.type = 'image/webp'
  if (![...document.head.querySelectorAll('link[rel="prefetch"]')].some((n) => n.href === link.href)) {
    document.head.appendChild(link)
  }
}

export const SaasShowcase = () => {
  const { t } = useMktI18n()
  const reduce = useReducedMotion()
  const baseId = useId()
  const [activeIdx, setActiveIdx] = useState(0)
  const [entered, setEntered] = useState(false)
  const sectionRef = useRef(null)
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
      { rootMargin: '120px 0px', threshold: 0.08 }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!entered) return
    const next = VIEWS[(activeIdx + 1) % VIEWS.length]
    const prev = VIEWS[(activeIdx - 1 + VIEWS.length) % VIEWS.length]
    prefetchShot(next.shot)
    prefetchShot(prev.shot)
  }, [activeIdx, entered])

  const select = useCallback((idx) => {
    setActiveIdx(idx)
  }, [])

  const onKeyNav = (event) => {
    let next = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = (activeIdx + 1) % VIEWS.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (activeIdx - 1 + VIEWS.length) % VIEWS.length
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = VIEWS.length - 1
    }
    if (next === null) return
    event.preventDefault()
    setActiveIdx(next)
    const btn = event.currentTarget.querySelectorAll('[role="tab"]')[next]
    btn?.focus?.()
  }

  return (
    <section
      ref={sectionRef}
      className={`saas-section saas-showcase${entered ? ' is-in' : ''}`}
      id="product"
    >
      <div className="mkt-wrap">
        <div className="saas-intro saas-showcase-intro">
          <p className="saas-kicker">{t('saas.showcaseKicker')}</p>
          <h2 className="saas-h2">{t('saas.showcaseTitle')}</h2>
          <p className="saas-lead">{t('saas.showcaseLead')}</p>
        </div>

        <div className="saas-stage">
          <div className="saas-stage-rail" role="tablist" aria-label={t('saas.showcaseKicker')} onKeyDown={onKeyNav}>
            {VIEWS.map((view, idx) => {
              const selected = idx === activeIdx
              const tabId = `${baseId}-tab-${view.id}`
              const panelId = `${baseId}-panel`
              return (
                <button
                  key={view.id}
                  type="button"
                  role="tab"
                  id={tabId}
                  className="saas-stage-tab"
                  aria-selected={selected}
                  aria-controls={panelId}
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
              className="saas-stage-panel"
              role="tabpanel"
              id={`${baseId}-panel`}
              aria-labelledby={`${baseId}-tab-${active.id}`}
            >
              <div className={`saas-stage-frame${reduce ? '' : ' has-depth'}`}>
                <div className="saas-stage-chrome" aria-hidden>
                  <span />
                  <span />
                  <span />
                  <p>{t(`saas.show.${active.id}.chrome`)}</p>
                </div>
                <div className="saas-stage-viewport" key={active.shot}>
                  <ProductShot
                    id={active.shot}
                    alt={t(`alts.${active.shot}`)}
                    eager={activeIdx === 0}
                    sizes="(max-width: 900px) 94vw, min(820px, 58vw)"
                  />
                </div>
              </div>

              <div className="saas-stage-caption">
                <p className="saas-stage-index" aria-hidden>
                  {String(activeIdx + 1).padStart(2, '0')} / {String(VIEWS.length).padStart(2, '0')}
                </p>
                <h3>{t(`saas.show.${active.id}.title`)}</h3>
                <p>{t(`saas.show.${active.id}.body`)}</p>
              </div>
            </div>

            <div className="saas-stage-strip" aria-hidden="true">
              {VIEWS.map((view, idx) => (
                <button
                  key={view.id}
                  type="button"
                  className={`saas-stage-thumb${idx === activeIdx ? ' is-active' : ''}`}
                  tabIndex={-1}
                  onClick={() => select(idx)}
                  onMouseEnter={() => prefetchShot(view.shot)}
                  aria-label={t(`saas.show.${view.id}.label`)}
                >
                  {entered ? (
                    <ProductShot id={view.shot} alt="" sizes="120px" />
                  ) : null}
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
