import React, { useMemo, useState } from 'react'
import { HERO_IMAGE } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { motion as Motion } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import DateRangePicker from './DateRangePicker'
import CitySelect from './CitySelect'
import toast from 'react-hot-toast'
import { booking } from './ui/bookingUi'
import { trackSearch } from '../analytics/ga4'
import { vehicleImage } from '../storefront/theme'
import { buildCategoryShowcase, categoryCurrency, formatFromAmount } from '../storefront/categoryShowcase'
import {
  CategoryCaption,
  CategoryTabs,
  CategoryVehicle,
  useCategoryAutoplay,
} from './HeroCategoryStage'

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState('')
  const [returnLocation, setReturnLocation] = useState('')
  const { t } = useI18n()
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
  } = useAppContext()

  const displayBrand = storefrontProfile?.name || ''
  const heroHeadline = storefrontProfile?.hero?.headline || t('storefront.journeyHeadline')
  const heroSub = storefrontProfile?.hero?.subheadline || t('storefront.journeyFallback')
  const heroBadge = storefrontProfile?.hero?.badgeText || displayBrand
  const currency = categoryCurrency(storefrontProfile)

  const cities = useMemo(
    () => [...new Set(pickupLocations.map((location) => location.city).filter(Boolean))].sort(),
    [pickupLocations],
  )
  const hasAirport = pickupLocations.some(
    (location) => String(location.locationType || '').toLowerCase() === 'airport',
  )

  const slides = useMemo(() => buildCategoryShowcase(cars), [cars])
  const { index, paused, reduced, select, pause, resume } = useCategoryAutoplay(slides.length)
  const active = slides[index] || null
  const nextSlide = slides.length > 1 ? slides[(index + 1) % slides.length] : null

  const fallbackSrc = storefrontProfile?.hero?.imageUrl
    || vehicleImage(cars.find((car) => vehicleImage(car)))
    || HERO_IMAGE.webp

  const catalogFrom = useMemo(() => {
    const prices = cars.map((car) => Number(car.pricePerDay)).filter((n) => n > 0)
    return prices.length ? Math.min(...prices) : null
  }, [cars])

  const facts = useMemo(() => {
    const items = []
    if (cars.length) items.push(t('hero.statVehicles', { count: String(cars.length) }))
    if (catalogFrom != null) {
      items.push(t('storefront.fromPrice', { price: formatFromAmount(catalogFrom, currency) }))
    }
    if (hasAirport) items.push(t('storefront.trustAirportTitle'))
    else if (cities.length) items.push(cities.slice(0, 3).join(' · '))
    return items.slice(0, 3)
  }, [cars.length, catalogFrom, currency, hasAirport, cities, t])

  const startISO = typeof pickupDate === 'string' ? pickupDate.slice(0, 10) : ''
  const endISO = typeof returnDate === 'string' ? returnDate.slice(0, 10) : ''
  const carsPath = publicPath?.('/cars') || '/cars'

  const openVehicle = () => {
    if (!active?.lead?._id) return
    navigate(publicPath?.(`/car-details/${active.lead._id}`) || `/car-details/${active.lead._id}`)
    window.scrollTo(0, 0)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const pickup = pickupLocation || cities[0] || ''
    if (!pickup) {
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
      location: pickup,
      has_dates: true,
      source: 'hero',
      category: active?.category || undefined,
    })
    const params = {
      pickupLocation: pickup,
      pickupDate: startISO,
      returnDate: endISO,
    }
    if (returnLocation) params.returnLocation = returnLocation
    if (active?.category) params.category = active.category
    navigate(`${carsPath}?${new URLSearchParams(params).toString()}`)
  }

  return (
    <section className="sf-hero relative min-h-[100svh] overflow-x-clip bg-[var(--sf-night,#0c0b0a)] text-[#f7f3ee]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_8%,var(--sf-wash,rgba(143,31,31,0.26)),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/80" />
        <div className="sf-trails sf-motion" aria-hidden />
        <div className="sf-road sf-motion" aria-hidden>
          <span className="sf-centerline" />
        </div>
      </div>

      <div className="relative z-10 page-pad page-shell flex min-h-[100svh] flex-col gap-6 pb-8 pt-[max(5.25rem,calc(env(safe-area-inset-top)+4.25rem))] sm:gap-7 sm:pb-10 lg:gap-8">
        <Motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {storefrontProfile?.logoUrl ? (
            <img
              src={storefrontProfile.logoUrl}
              alt={displayBrand}
              width={180}
              height={48}
              decoding="async"
              className="mb-5 h-10 w-auto max-h-10 object-contain sm:h-12 sm:max-h-12"
            />
          ) : displayBrand ? (
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">{displayBrand}</p>
          ) : null}

          {heroBadge ? (
            <p className="mb-4 inline-flex items-center border border-white/15 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
              {heroBadge}
            </p>
          ) : null}

          <h1 className="max-w-3xl font-display text-[2.4rem] font-medium leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.15rem]">
            {heroHeadline}
          </h1>
          <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-white/68 sm:mt-5 sm:text-base md:text-lg">
            {heroSub}
          </p>
        </Motion.header>

        <div className="grid flex-1 grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-6">
          <Motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="order-1 min-w-0 lg:order-none lg:col-span-5 lg:col-start-1 lg:row-start-1"
            onPointerEnter={pause}
            onPointerLeave={resume}
          >
            <CategoryTabs
              slides={slides}
              index={index}
              paused={paused}
              reduced={reduced}
              onSelect={select}
              currency={currency}
              t={t}
            />
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 min-w-0 lg:order-none lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1"
            onPointerEnter={pause}
            onPointerLeave={resume}
          >
            <CategoryVehicle
              slide={active}
              fallbackSrc={fallbackSrc}
              preloadSrc={nextSlide?.image}
              reduced={reduced}
            />
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="order-3 min-w-0 space-y-5 lg:order-none lg:col-span-5 lg:col-start-1 lg:row-start-2"
          >
            <CategoryCaption slide={active} currency={currency} t={t} onView={active?.lead?._id ? openVehicle : undefined} />

            {facts.length ? (
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] uppercase tracking-[0.14em] text-white/50">
                {facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            ) : null}

            <button
              type="button"
              onClick={() => navigate(carsPath)}
              className="text-sm font-medium text-white/70 underline-offset-4 hover:text-white hover:underline"
            >
              {t('hero.exploreFleet')} →
            </button>
          </Motion.div>
        </div>

        <Motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={handleSearch}
          className="sf-hero-search"
        >
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            {t('hero.bookingLabel')}
          </p>
          <div className="overflow-visible border border-white/12 bg-[rgba(10,9,8,0.62)] backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row lg:items-stretch">
              <div className="sf-hero-field min-w-0 border-b border-white/10 lg:flex-1 lg:border-b-0 lg:border-r">
                <CitySelect
                  value={pickupLocation}
                  onChange={(value) => {
                    setPickupLocation(value)
                    if (!returnLocation) setReturnLocation(value)
                  }}
                  options={cities}
                  label={t('hero.pickupLocation')}
                  placeholder={t('hero.selectLocation')}
                />
              </div>
              <div className="sf-hero-field min-w-0 border-b border-white/10 lg:flex-1 lg:border-b-0 lg:border-r">
                <CitySelect
                  value={returnLocation || pickupLocation}
                  onChange={setReturnLocation}
                  options={cities}
                  label={t('hero.returnLocation')}
                  placeholder={t('hero.selectLocation')}
                />
              </div>
              <div className="sf-hero-field min-w-0 border-b border-white/10 lg:flex-[1.45] lg:border-b-0 lg:border-r">
                <DateRangePicker
                  startDate={startISO}
                  endDate={endISO}
                  onChange={({ startDate, endDate }) => {
                    setPickupDate(startDate)
                    setReturnDate(endDate)
                  }}
                />
              </div>
              <div className="flex items-stretch p-3 lg:p-2.5">
                <button type="submit" className={`${booking.btnPrimary} booking-tap h-14 w-full gap-2 lg:h-full lg:min-h-[4.5rem] lg:w-[12.5rem]`}>
                  <span>{t('hero.searchVehicles')}</span>
                  <span aria-hidden>→</span>
                </button>
              </div>
            </div>
          </div>
          <p className="mt-3 px-1 text-center text-xs tracking-wide text-white/45 sm:text-left sm:text-sm">
            {t('hero.trustLine')}
          </p>
        </Motion.form>
      </div>
    </section>
  )
}

export default Hero
