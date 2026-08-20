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
import { buildCategoryShowcase, categoryCurrency } from '../storefront/categoryShowcase'
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
  const currency = categoryCurrency(storefrontProfile)

  const cities = useMemo(
    () => [...new Set(pickupLocations.map((location) => location.city).filter(Boolean))].sort(),
    [pickupLocations],
  )

  const slides = useMemo(() => buildCategoryShowcase(cars), [cars])
  const { index, paused, reduced, select, pause, resume } = useCategoryAutoplay(slides.length)
  const active = slides[index] || null
  const nextSlide = slides.length > 1 ? slides[(index + 1) % slides.length] : null

  const fallbackSrc = storefrontProfile?.hero?.imageUrl
    || vehicleImage(cars.find((car) => vehicleImage(car)))
    || HERO_IMAGE.webp

  const startISO = typeof pickupDate === 'string' ? pickupDate.slice(0, 10) : ''
  const endISO = typeof returnDate === 'string' ? returnDate.slice(0, 10) : ''

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
    const carsBase = publicPath?.('/cars') || '/cars'
    const params = {
      pickupLocation: pickup,
      pickupDate: startISO,
      returnDate: endISO,
    }
    if (returnLocation) params.returnLocation = returnLocation
    if (active?.category) params.category = active.category
    navigate(`${carsBase}?${new URLSearchParams(params).toString()}`)
  }

  return (
    <section className="sf-hero relative min-h-[100svh] overflow-x-clip bg-[var(--sf-night,#0c0b0a)] text-[#f7f3ee]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_12%,var(--sf-wash,rgba(143,31,31,0.32)),transparent_52%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/85" />
        <div className="sf-trails sf-motion" aria-hidden />
        <div className="sf-road sf-motion" aria-hidden>
          <span className="sf-centerline" />
        </div>
      </div>

      <div className="relative z-10 page-pad page-shell grid min-h-[100svh] grid-cols-1 content-start gap-5 pb-8 pt-[max(5.25rem,calc(env(safe-area-inset-top)+4.25rem))] sm:gap-6 sm:pb-10 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-4">
        <Motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-12 lg:row-start-1"
        >
          {storefrontProfile?.logoUrl ? (
            <img
              src={storefrontProfile.logoUrl}
              alt={displayBrand}
              width={180}
              height={48}
              decoding="async"
              className="mb-5 h-9 w-auto max-h-9 object-contain sm:h-11 sm:max-h-11"
            />
          ) : displayBrand ? (
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">{displayBrand}</p>
          ) : null}
          <h1 className="max-w-2xl font-display text-[2.15rem] font-medium leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.35rem]">
            {heroHeadline}
          </h1>
          <p className="mt-3 max-w-lg text-sm font-light leading-relaxed text-white/65 sm:text-base">
            {heroSub}
          </p>
        </Motion.header>

        <div
          className="order-1 min-w-0 lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:self-end"
          onPointerEnter={pause}
          onPointerLeave={resume}
        >
          <CategoryTabs
            slides={slides}
            index={index}
            paused={paused}
            reduced={reduced}
            onSelect={select}
          />
        </div>

        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 min-w-0 lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-2"
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
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="order-3 min-w-0 lg:col-span-4 lg:col-start-1 lg:row-start-3 lg:self-end lg:pb-2"
        >
          <CategoryCaption slide={active} currency={currency} t={t} />
        </Motion.div>

        <Motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={handleSearch}
          className="sf-hero-search order-4 min-w-0 lg:col-span-12 lg:row-start-4 lg:mt-1"
        >
          <div className="overflow-visible border border-white/12 bg-[rgba(12,11,10,0.78)] shadow-[0_28px_70px_-32px_rgba(0,0,0,0.75)] backdrop-blur-2xl">
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
        </Motion.form>
      </div>
    </section>
  )
}

export default Hero
