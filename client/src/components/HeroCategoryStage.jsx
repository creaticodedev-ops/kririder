import { useEffect, useRef, useState } from 'react'
import { HERO_IMAGE } from '../assets/assets'
import { formatFromAmount } from '../storefront/categoryShowcase'

export const SHOWCASE_MS = 6500

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

export const CategoryTabs = ({ slides, index, paused, reduced, onSelect }) => {
  if (!slides.length) return null
  return (
    <div className="flex gap-0.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {slides.map((slide, i) => {
        const selected = i === index
        return (
          <button
            key={slide.id}
            type="button"
            onClick={() => onSelect(i)}
            className={`booking-tap min-h-11 shrink-0 px-3 py-2 text-left transition ${
              selected ? 'text-white' : 'text-white/40 hover:text-white/75'
            }`}
            aria-pressed={selected}
          >
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em]">{slide.category}</span>
            <span
              className={`sf-cat-progress mt-2 block ${selected ? 'is-active' : ''} ${
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

  useEffect(() => {
    if (!preloadSrc || preloadSrc === src) return undefined
    const preload = new Image()
    preload.src = preloadSrc
    return undefined
  }, [preloadSrc, src])

  return (
    <div className="sf-hero-stage relative min-h-[min(40vh,340px)] w-full lg:min-h-[min(54vh,580px)]">
      <img
        key={src}
        src={src}
        alt={slide?.lead ? `${slide.lead.brand} ${slide.lead.model}` : slide?.category || ''}
        width={1400}
        height={800}
        decoding="async"
        fetchPriority="high"
        className={`sf-hero-shot ${reduced ? 'is-static' : 'sf-motion'}`}
        onError={(event) => {
          event.currentTarget.src = HERO_IMAGE.webp
        }}
      />
    </div>
  )
}

export const CategoryCaption = ({ slide, currency, t }) => {
  if (!slide) return null
  const priceLabel =
    slide.fromPrice != null ? t('storefront.fromPrice', { price: formatFromAmount(slide.fromPrice, currency) }) : ''
  return (
    <div>
      <h2 className="font-display text-[2.75rem] font-medium leading-[0.88] tracking-tight text-white sm:text-5xl lg:text-[4.25rem]">
        {slide.category}
      </h2>
      {priceLabel ? (
        <p className="mt-3 text-sm font-light tracking-[0.04em] text-white/72 sm:text-base">{priceLabel}</p>
      ) : null}
    </div>
  )
}
