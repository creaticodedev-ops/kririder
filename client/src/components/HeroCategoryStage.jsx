import { useEffect, useRef, useState } from 'react'
import { HERO_IMAGE } from '../assets/assets'
import { formatFromAmount } from '../storefront/categoryShowcase'

export const SHOWCASE_MS = 7000

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return reduced
}

export const useCategoryAutoplay = (count) => {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const hoverRef = useRef(false)
  const holdTimer = useRef(0)
  const holdUntil = useRef(0)

  useEffect(() => {
    setIndex((current) => (count ? current % count : 0))
  }, [count])

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) setPaused(true)
      else if (!hoverRef.current && Date.now() >= holdUntil.current && !reduced) {
        setPaused(false)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.clearTimeout(holdTimer.current)
    }
  }, [reduced])

  useEffect(() => {
    if (reduced || paused || count < 2) return undefined
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count)
    }, SHOWCASE_MS)
    return () => window.clearInterval(timer)
  }, [count, paused, reduced])

  const tryResume = () => {
    if (reduced || hoverRef.current || Date.now() < holdUntil.current) return
    setPaused(false)
  }

  return {
    index,
    paused,
    reduced,
    select: (next) => {
      setIndex(next)
      setPaused(true)
      holdUntil.current = Date.now() + 8000
      window.clearTimeout(holdTimer.current)
      holdTimer.current = window.setTimeout(tryResume, 8000)
    },
    pause: () => {
      hoverRef.current = true
      setPaused(true)
    },
    resume: () => {
      hoverRef.current = false
      tryResume()
    },
  }
}

export const CategoryTabs = ({ slides, index, paused, reduced, onSelect, currency, t }) => {
  if (!slides.length) return null
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {slides.map((slide, i) => {
        const selected = i === index
        const price = slide.fromPrice != null
          ? t('storefront.fromPrice', { price: formatFromAmount(slide.fromPrice, currency) })
          : ''
        return (
          <button
            key={slide.id}
            type="button"
            onClick={() => onSelect(i)}
            className={`booking-tap min-h-12 min-w-[7.5rem] shrink-0 border px-3.5 py-2.5 text-left transition ${
              selected
                ? 'border-white/35 bg-white/[0.08] text-white'
                : 'border-white/10 bg-transparent text-white/55 hover:border-white/25 hover:text-white/85'
            }`}
            aria-pressed={selected}
          >
            <span className="block text-[11px] font-semibold uppercase tracking-[0.16em]">{slide.category}</span>
            {price ? <span className="mt-1 block text-[11px] font-light tracking-wide opacity-80">{price}</span> : null}
            <span
              className={`sf-cat-progress mt-2.5 block ${selected ? 'is-active' : ''} ${
                selected && paused ? 'is-paused' : ''
              } ${reduced ? 'is-static' : ''}`}
              aria-hidden
            >
              <span />
            </span>
          </button>
        )
      })}
    </div>
  )
}

export const CategoryVehicle = ({ slide, fallbackSrc, preloadSrc, reduced }) => {
  const src = slide?.image || fallbackSrc || HERO_IMAGE.webp
  const stageRef = useRef(null)
  const lead = slide?.lead

  useEffect(() => {
    if (!preloadSrc || preloadSrc === src) return undefined
    const preload = new Image()
    preload.src = preloadSrc
    return undefined
  }, [preloadSrc, src])

  useEffect(() => {
    const el = stageRef.current
    if (!el || reduced) return undefined
    const onMove = (event) => {
      const box = el.getBoundingClientRect()
      const x = ((event.clientX - box.left) / box.width) * 2 - 1
      const y = ((event.clientY - box.top) / box.height) * 2 - 1
      el.style.setProperty('--sf-px', String(Math.max(-1, Math.min(1, x))))
      el.style.setProperty('--sf-py', String(Math.max(-1, Math.min(1, y))))
    }
    const onLeave = () => {
      el.style.setProperty('--sf-px', '0')
      el.style.setProperty('--sf-py', '0')
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced])

  return (
    <div
      ref={stageRef}
      className={`sf-hero-stage relative min-h-[min(44vh,380px)] w-full lg:min-h-[min(58vh,620px)] ${reduced ? '' : 'is-live'}`}
    >
      <div className="sf-hero-atmosphere" aria-hidden />
      <img
        key={src}
        src={src}
        alt={lead ? `${lead.brand} ${lead.model}` : slide?.category || ''}
        width={1400}
        height={800}
        decoding="async"
        fetchPriority="high"
        className={`sf-hero-shot ${reduced ? 'is-static' : 'sf-motion'}`}
        onError={(event) => {
          event.currentTarget.src = HERO_IMAGE.webp
        }}
      />
      {lead ? (
        <p className="pointer-events-none absolute inset-x-0 bottom-3 px-1 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-white/55 sm:bottom-5">
          {lead.brand} {lead.model}
        </p>
      ) : null}
    </div>
  )
}

export const CategoryCaption = ({ slide, currency, t, onView }) => {
  if (!slide) return null
  const lead = slide.lead
  const priceLabel =
    slide.fromPrice != null ? t('storefront.fromPrice', { price: formatFromAmount(slide.fromPrice, currency) }) : ''
  const specs = lead
    ? [lead.transmission, lead.seating_capacity, lead.fuel_type].filter(Boolean).join(' · ')
    : ''

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">{t('hero.featuredModel')}</p>
      <h2 className="mt-2 font-display text-[2.5rem] font-medium leading-[0.92] tracking-tight text-white sm:text-5xl lg:text-[3.6rem]">
        {slide.category}
      </h2>
      {priceLabel ? (
        <p className="mt-3 text-lg font-light text-white/80 sm:text-xl">{priceLabel}</p>
      ) : null}
      {lead ? (
        <p className="mt-4 text-sm text-white/70">
          {lead.brand} {lead.model}
          {specs ? <span className="text-white/45"> · {specs}</span> : null}
        </p>
      ) : null}
      {lead && onView ? (
        <button type="button" onClick={onView} className="mt-5 text-sm font-medium text-white underline-offset-4 hover:underline">
          {t('storefront.viewVehicle')} →
        </button>
      ) : null}
    </div>
  )
}
