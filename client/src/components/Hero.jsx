import React, { useEffect, useMemo, useState } from 'react'
import { HERO_IMAGE } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { motion as Motion } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import DateRangePicker from './DateRangePicker'
import CitySelect from './CitySelect'
import toast from 'react-hot-toast'
import { booking } from './ui/bookingUi'
import { trackSearch } from '../analytics/ga4'
import HeroHud from './hero/HeroHud'
import { usePointerLook } from './hero/usePointerLook'
import {
  countryDisplayKey,
  heroVehicleHint,
  resolveHeroCity,
  resolveHeroCountry,
} from './hero/heroTelemetry'
import './hero/heroStage.css'

const fade = (reduce, delay) =>
  reduce
    ? { initial: false, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
      }

const usePrefersReducedMotion = () => {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduce(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return reduce
}

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState('')
  const { t } = useI18n()
  const reduceMotion = usePrefersReducedMotion()
  const stageRef = usePointerLook(!reduceMotion)
  const {
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    navigate,
    pickupLocations,
    publicPath,
    storefrontProfile,
    cars,
    currency,
  } = useAppContext()
  const displayBrand = storefrontProfile?.name || ''
  const heroHeadline = storefrontProfile?.hero?.headline || ''
  const heroSub = storefrontProfile?.hero?.subheadline || ''
  const heroBadge = storefrontProfile?.hero?.badgeText || ''

  const cities = useMemo(() => {
    return [...new Set(pickupLocations.map((location) => location.city))].sort()
  }, [pickupLocations])

  const originCity = useMemo(
    () => resolveHeroCity(storefrontProfile, pickupLocations),
    [storefrontProfile, pickupLocations],
  )
  const originCountry = useMemo(() => resolveHeroCountry(storefrontProfile), [storefrontProfile])
  const countryLabel = countryDisplayKey(originCountry)
    ? t('hero.morocco')
    : originCountry
  const vehicleHint = useMemo(() => heroVehicleHint(cars), [cars])

  const startISO = typeof pickupDate === 'string' ? pickupDate.slice(0, 10) : ''
  const endISO = typeof returnDate === 'string' ? returnDate.slice(0, 10) : ''

  const handleSearch = (e) => {
    e.preventDefault()
    if (!pickupLocation) {
      toast.error(t('hero.selectLocation'))
      return
    }
    if (!startISO || !endISO) {
      toast.error(t('hero.selectDates'))
      return
    }
    if (endISO < startISO) {
      toast.error(t('hero.invalidRange'))
      return
    }
    trackSearch({
      location: pickupLocation,
      has_dates: true,
      source: 'hero',
    })
    const carsBase = publicPath?.('/cars') || '/cars'
    navigate(`${carsBase}?${new URLSearchParams({
      pickupLocation,
      pickupDate: startISO,
      returnDate: endISO,
    }).toString()}`)
  }

  const exploreFleet = () => {
    document.getElementById('fleet')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <section ref={stageRef} className="hero-stage">
      <div className="hero-atmosphere" aria-hidden="true">
        <Motion.div
          className="hero-atmosphere-inner"
          initial={reduceMotion ? false : { opacity: 0.2 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-atmosphere-wash" />
          <div className="hero-atmosphere-horizon" />
          <div className="hero-atmosphere-curves" />
          <div className="hero-atmosphere-haze" />
          <div className="hero-atmosphere-road" />
          <div className="hero-atmosphere-grain" />
        </Motion.div>
      </div>
      <div className="hero-cursor-light" aria-hidden="true" />

      <div className="relative z-10 page-pad page-shell flex flex-col items-center pb-10 pt-[max(5.5rem,calc(env(safe-area-inset-top)+4.5rem))] sm:pb-14 sm:pt-28 md:pb-16 md:pt-32">
        <Motion.div className="hero-copy" {...fade(reduceMotion, 0.85)}>
          <div className="mb-4 flex justify-center sm:mb-5 md:mb-6">
            <div
              className="inline-flex max-w-[min(100%,22rem)] items-center gap-2 rounded-full border border-borderColor/70 bg-white/80 px-3 py-1.5 shadow-[0_1px_2px_rgba(22,18,16,0.05)] backdrop-blur-md sm:max-w-none sm:gap-2.5 sm:px-3.5 sm:py-[0.4rem]"
              role="status"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted/70"
                aria-hidden="true"
              />
              <span className="min-w-0 truncate text-[10px] font-semibold uppercase leading-none tracking-[0.08em] text-ink sm:text-[11px] sm:tracking-[0.09em]">
                {heroBadge || t('hero.badge')}
              </span>
              <span
                className="inline-flex shrink-0 translate-y-[0.5px] items-center text-[11px] leading-none sm:text-[12px]"
                role="img"
                aria-label="Morocco"
              >
                🇲🇦
              </span>
            </div>
          </div>

          {displayBrand ? (
            <p className="font-display text-5xl font-medium leading-none tracking-tight text-primary sm:text-6xl md:text-7xl">
              {displayBrand}
            </p>
          ) : null}
          <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-ink sm:mt-4 sm:text-4xl md:text-5xl">
            {heroHeadline || t('hero.title')}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm font-light leading-relaxed text-muted sm:mt-4 sm:text-base md:text-lg">
            {heroSub || t('hero.subtitle')}
          </p>
        </Motion.div>

        <Motion.form
          onSubmit={handleSearch}
          className="mt-8 w-full max-w-4xl sm:mt-10 md:mt-12"
          {...fade(reduceMotion, 1.12)}
        >
          <div className="hero-console">
            <div className="flex flex-col md:flex-row md:items-stretch">
              <div
                data-filled={pickupLocation ? 'true' : 'false'}
                className="min-w-0 border-b border-borderColor/80 md:flex-[1.05] md:border-b-0 md:border-r"
              >
                <CitySelect
                  value={pickupLocation}
                  onChange={setPickupLocation}
                  options={cities}
                  label={t('hero.pickupLocation')}
                  placeholder={t('hero.selectLocation')}
                />
              </div>

              <div
                data-filled={startISO && endISO ? 'true' : 'false'}
                className="min-w-0 border-b border-borderColor/80 md:flex-[1.55] md:border-b-0 md:border-r"
              >
                <DateRangePicker
                  startDate={startISO}
                  endDate={endISO}
                  onChange={({ startDate, endDate }) => {
                    setPickupDate(startDate)
                    setReturnDate(endDate)
                  }}
                />
              </div>

              <div className="flex items-stretch p-3 md:p-2.5 md:pl-2">
                <button
                  type="submit"
                  className={`${booking.btnPrimary} booking-tap hero-find w-full md:w-[9.75rem]`}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.5-3.5" />
                  </svg>
                  {t('hero.search')}
                </button>
              </div>
            </div>
          </div>

          <p className="mt-3.5 px-2 text-center text-[11px] leading-relaxed tracking-[0.04em] text-muted sm:text-xs">
            {t('hero.trustLine')}
          </p>
        </Motion.form>

        <div className="hero-scene mt-8 px-2 sm:mt-10 md:mt-12">
          {originCity && countryLabel ? (
            <Motion.div className="hero-journey" {...fade(reduceMotion, 1.45)}>
              <div className="hero-journey-row">
                <span className="hero-journey-label">
                  <strong>{originCity}</strong>
                </span>
                <span className="hero-journey-line" />
                <span className="hero-journey-label">{countryLabel}</span>
              </div>
            </Motion.div>
          ) : null}

          <Motion.div className="hero-hud-slot" {...fade(reduceMotion, 1.4)}>
            <HeroHud
              city={originCity}
              timeZone={storefrontProfile?.timezone || 'Africa/Casablanca'}
            />
          </Motion.div>

          <div className="hero-car-frame">
            <Motion.div
              className="hero-car-intro"
              initial={reduceMotion ? false : { scale: 1.22 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="hero-car">
                <picture>
                  <source srcSet={HERO_IMAGE.webp} type="image/webp" />
                  <img
                    src={HERO_IMAGE.webp}
                    alt={`${displayBrand} premium rental`}
                    width={900}
                    height={506}
                    decoding="async"
                    fetchPriority="high"
                  />
                </picture>
                <div className="hero-car-shine" aria-hidden="true" />
              </div>
            </Motion.div>
          </div>
        </div>

        {vehicleHint ? (
          <Motion.div className="hero-vehicle-meta" {...fade(reduceMotion, 1.5)}>
            <p className="hero-vehicle-kicker">{vehicleHint.category}</p>
            <p className="hero-vehicle-price">
              {t('hero.fromPerDay', { price: `${currency}${vehicleHint.from}` })}
            </p>
          </Motion.div>
        ) : null}

        <Motion.button
          type="button"
          className="hero-explore"
          onClick={exploreFleet}
          aria-label={t('hero.exploreFleet')}
          {...fade(reduceMotion, 1.65)}
        >
          <span>{t('hero.exploreFleet')}</span>
          <i aria-hidden="true" />
        </Motion.button>
      </div>
    </section>
  )
}

export default Hero
