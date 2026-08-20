import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import toast from 'react-hot-toast'
import CitySelect from '../components/CitySelect'
import DateRangePicker from '../components/DateRangePicker'
import { booking } from '../components/ui/bookingUi'
import { trackSearch } from '../analytics/ga4'
import { useAppContext } from '../context/AppContext'
import { useI18n } from '../i18n/I18nContext'
import { useInViewActive, usePrefersReducedMotion } from './usePrefersReducedMotion'

const HomeHero = ({ categories, activeIndex }) => {
  const { t } = useI18n()
  const reduceMotion = usePrefersReducedMotion()
  const stageRef = useRef(null)
  const inView = useInViewActive(stageRef)
  const [pickupLocation, setPickupLocation] = useState('')
  const [returnLocation, setReturnLocation] = useState('')
  const {
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    navigate,
    pickupLocations,
    publicPath,
    storefrontProfile,
    currency,
  } = useAppContext()

  const cities = [...new Set(pickupLocations.map((location) => location.city).filter(Boolean))].sort()
  const displayBrand = storefrontProfile?.name || ''
  const heroHeadline = storefrontProfile?.hero?.headline || ''
  const heroSub = storefrontProfile?.hero?.subheadline || ''
  const heroBadge = storefrontProfile?.hero?.badgeText || ''
  const active = categories[activeIndex] || null
  const startISO = typeof pickupDate === 'string' ? pickupDate.slice(0, 10) : ''
  const endISO = typeof returnDate === 'string' ? returnDate.slice(0, 10) : ''
  const motionOn = !reduceMotion && inView

  useEffect(() => {
    if (cities.length === 1 && !pickupLocation) {
      setPickupLocation(cities[0])
      setReturnLocation(cities[0])
    }
  }, [cities, pickupLocation])

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
    const dropoff = returnLocation || pickupLocation
    trackSearch({
      location: pickupLocation,
      has_dates: true,
      source: 'hero',
    })
    const carsBase = publicPath?.('/cars') || '/cars'
    const params = new URLSearchParams({
      pickupLocation,
      pickupDate: startISO,
      returnDate: endISO,
    })
    if (dropoff) params.set('returnLocation', dropoff)
    if (active?.category) params.set('category', active.category)
    navigate(`${carsBase}?${params.toString()}`)
  }

  return (
    <section
      ref={stageRef}
      className="sf-hero"
      data-motion={motionOn ? 'on' : 'off'}
      aria-label={displayBrand || t('hero.title')}
    >
      <div className="sf-hero-sky" aria-hidden="true" />
      <div className="sf-hero-grain" aria-hidden="true" />
      <div className="sf-hero-haze" aria-hidden="true" />
      <div className="sf-road" aria-hidden="true">
        <div className="sf-road-surface" />
        <div className="sf-road-edge" />
        <div className="sf-road-lines" />
      </div>
      <div className="sf-headlights" aria-hidden="true" />
      <div className="sf-ground-shadow" aria-hidden="true" />

      <div className="sf-hero-copy">
        <p className="sf-kicker">
          <i aria-hidden="true" />
          {heroBadge || displayBrand || t('hero.badge')}
        </p>
        <h1>{heroHeadline || t('hero.title')}</h1>
        <p className="sf-lead">{heroSub || t('hero.subtitle')}</p>
      </div>

      <div className="sf-stage">
        <AnimatePresence mode="wait">
          {active?.image ? (
            <Motion.div
              key={active.category + (active.car?._id || '')}
              className="sf-car-wrap"
              initial={reduceMotion ? false : { opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -36 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={active.image}
                alt={`${active.car?.brand || ''} ${active.car?.model || active.category}`.trim()}
                width={900}
                height={506}
                decoding="async"
                fetchPriority="high"
              />
              <div className="sf-trail" aria-hidden="true" />
            </Motion.div>
          ) : null}
        </AnimatePresence>
        {active ? (
          <p className="sf-car-meta">
            <span>{active.category}</span>
            {active.car?.brand ? (
              <span>
                <strong>
                  {active.car.brand} {active.car.model}
                </strong>
              </span>
            ) : null}
            <span>{t('hero.fromPerDay', { price: `${currency}${active.from}` })}</span>
          </p>
        ) : null}
      </div>

      <div className="sf-console-wrap">
        <form onSubmit={handleSearch} className="sf-console">
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            <div className="min-w-0 border-b border-borderColor/80 lg:flex-1 lg:border-b-0 lg:border-r">
              <CitySelect
                value={pickupLocation}
                onChange={(city) => {
                  setPickupLocation(city)
                  if (!returnLocation || returnLocation === pickupLocation) setReturnLocation(city)
                }}
                options={cities}
                label={t('hero.pickupPlace')}
                placeholder={t('hero.selectLocation')}
              />
            </div>
            <div className="min-w-0 border-b border-borderColor/80 lg:flex-1 lg:border-b-0 lg:border-r">
              <CitySelect
                value={returnLocation}
                onChange={setReturnLocation}
                options={cities}
                label={t('hero.returnPlace')}
                placeholder={t('hero.selectReturnPlace')}
              />
            </div>
            <div className="min-w-0 border-b border-borderColor/80 lg:flex-[1.45] lg:border-b-0 lg:border-r">
              <DateRangePicker
                startDate={startISO}
                endDate={endISO}
                pickupLabel={t('hero.pickupDate')}
                returnLabel={t('hero.returnDate')}
                onChange={({ startDate, endDate }) => {
                  setPickupDate(startDate)
                  setReturnDate(endDate)
                }}
              />
            </div>
            <div className="flex items-stretch p-3 md:p-2.5">
              <button
                type="submit"
                className={`${booking.btnPrimary} booking-tap w-full lg:w-[11rem] !rounded-xl`}
              >
                {t('hero.search')}
              </button>
            </div>
          </div>
        </form>
        <p className="sf-trust">{t('hero.trustLine')}</p>
      </div>
    </section>
  )
}

export default HomeHero
