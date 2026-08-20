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

  const cities = useMemo(() => {
    return [...new Set(pickupLocations.map((location) => location.city))].sort()
  }, [pickupLocations])

  const heroSrc = useMemo(() => {
    if (storefrontProfile?.hero?.imageUrl) return storefrontProfile.hero.imageUrl
    const featured = cars.find((c) => vehicleImage(c))
    return vehicleImage(featured) || HERO_IMAGE.webp
  }, [storefrontProfile, cars])

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
    })
    const carsBase = publicPath?.('/cars') || '/cars'
    const params = {
      pickupLocation: pickup,
      pickupDate: startISO,
      returnDate: endISO,
    }
    if (returnLocation) params.returnLocation = returnLocation
    navigate(`${carsBase}?${new URLSearchParams(params).toString()}`)
  }

  return (
    <section className="relative min-h-[100svh] overflow-x-clip bg-[var(--sf-night,#0c0b0a)] text-[#f7f3ee]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-8%,var(--sf-wash,rgba(143,31,31,0.28)),transparent_58%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
        <div className="sf-trails sf-motion" aria-hidden />
        <div className="sf-road sf-motion" aria-hidden>
          <span className="sf-centerline" />
        </div>
      </div>

      <div className="relative z-10 page-pad page-shell flex min-h-[100svh] flex-col pb-8 pt-[max(5.25rem,calc(env(safe-area-inset-top)+4.25rem))] sm:pb-12">
        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-4xl text-center"
        >
          {storefrontProfile?.logoUrl ? (
            <img
              src={storefrontProfile.logoUrl}
              alt={displayBrand}
              width={180}
              height={48}
              decoding="async"
              className="mx-auto mb-6 h-10 w-auto max-h-10 object-contain sm:h-12 sm:max-h-12"
            />
          ) : displayBrand ? (
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">{displayBrand}</p>
          ) : null}

          {heroBadge ? (
            <p className="mb-4 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
              {heroBadge}
            </p>
          ) : null}

          <h1 className="font-display text-[2.35rem] font-medium leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]">
            {heroHeadline}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm font-light leading-relaxed text-white/70 sm:mt-5 sm:text-base md:text-lg">
            {heroSub}
          </p>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-8 flex w-full max-w-5xl flex-1 items-end justify-center sm:mt-10"
        >
          <img
            src={heroSrc}
            alt={displayBrand ? `${displayBrand} fleet` : 'Rental vehicle'}
            width={1280}
            height={720}
            decoding="async"
            fetchPriority="high"
            className="sf-hero-car sf-motion max-h-[min(42vh,420px)] w-full select-none object-contain object-bottom"
            onError={(e) => {
              e.currentTarget.src = HERO_IMAGE.webp
            }}
          />
        </Motion.div>

        <Motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={handleSearch}
          className="sf-hero-search relative z-20 mx-auto mt-6 w-full max-w-5xl sm:mt-8"
        >
          <div className="overflow-visible rounded-[1.35rem] border border-white/12 bg-[rgba(18,16,14,0.72)] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.65)] backdrop-blur-xl md:rounded-[1.6rem]">
            <div className="flex flex-col lg:flex-row lg:items-stretch">
              <div className="min-w-0 border-b border-white/10 lg:flex-1 lg:border-b-0 lg:border-r">
                <CitySelect
                  value={pickupLocation}
                  onChange={(v) => {
                    setPickupLocation(v)
                    if (!returnLocation) setReturnLocation(v)
                  }}
                  options={cities}
                  label={t('hero.pickupLocation')}
                  placeholder={t('hero.selectLocation')}
                />
              </div>
              <div className="min-w-0 border-b border-white/10 lg:flex-1 lg:border-b-0 lg:border-r">
                <CitySelect
                  value={returnLocation || pickupLocation}
                  onChange={setReturnLocation}
                  options={cities}
                  label={t('hero.returnLocation')}
                  placeholder={t('hero.selectLocation')}
                />
              </div>
              <div className="min-w-0 border-b border-white/10 lg:flex-[1.35] lg:border-b-0 lg:border-r">
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
                <button type="submit" className={`${booking.btnPrimary} booking-tap w-full lg:w-[11.5rem]`}>
                  {t('hero.searchVehicles')}
                </button>
              </div>
            </div>
          </div>
          <p className="mt-3 px-2 text-center text-xs tracking-wide text-white/45 sm:text-sm">
            {t('hero.trustLine')}
          </p>
        </Motion.form>
      </div>
    </section>
  )
}

export default Hero
