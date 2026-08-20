import React, { useMemo } from 'react'
import { motion as Motion } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { vehicleImage } from '../storefront/theme'
import { bannerCopyAllowed } from '../storefront/trustPoints'
import { booking } from './ui/bookingUi'

const Banner = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { publicPath, cars, pickupLocations, storefrontProfile } = useAppContext()
  const { hasAirport, cities } = bannerCopyAllowed({ locations: pickupLocations })
  const heroCar = cars.find((c) => vehicleImage(c))
  const image = storefrontProfile?.hero?.imageUrl || vehicleImage(heroCar)
  const line = useMemo(() => {
    if (hasAirport) return t('storefront.ctaAirport')
    if (cities.length) return t('storefront.ctaBody')
    return t('storefront.ctaBody')
  }, [hasAirport, cities.length, t])

  if (!image) return null

  return (
    <section className="bg-[var(--sf-paper,#f4f1ec)] py-8 md:py-12">
      <div className="page-pad page-shell">
        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative min-h-[280px] overflow-hidden rounded-[1.5rem] bg-ink md:min-h-[340px]"
        >
          <img
            src={image}
            alt=""
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/25" />
          <div className="relative z-10 flex max-w-xl flex-col justify-center px-6 py-12 sm:px-10 md:py-16">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">{t('banner.eyebrow')}</p>
            <h2 className="font-display text-3xl font-medium leading-tight text-white md:text-5xl">
              {t('storefront.ctaTitle')}
            </h2>
            <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-white/65 md:text-base">{line}</p>
            <button
              type="button"
              onClick={() => navigate(publicPath?.('/cars') || '/cars')}
              className={`${booking.btnPrimary} booking-tap mt-7 self-start`}
            >
              {t('banner.cta')}
            </button>
          </div>
        </Motion.div>
      </div>
    </section>
  )
}

export default Banner
