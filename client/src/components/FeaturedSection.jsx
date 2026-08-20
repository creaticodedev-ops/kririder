import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { motion as Motion } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import CarCard from './CarCard'
import { groupCarsByCategory } from '../utils/vehicleCategories'
import { vehicleImage } from '../storefront/theme'
import { booking } from './ui/bookingUi'

const FeaturedSection = () => {
  const navigate = useNavigate()
  const { cars, publicPath, storefrontProfile } = useAppContext()
  const { t } = useI18n()
  const carsPath = publicPath?.('/cars') || '/cars'
  const currency = storefrontProfile?.currency || import.meta.env.VITE_CURRENCY || 'MAD '
  const [category, setCategory] = useState('')

  const categories = useMemo(() => {
    const grouped = groupCarsByCategory(cars)
    return grouped.map((s) => s.category)
  }, [cars])

  const visible = useMemo(() => {
    if (!category) return cars
    return cars.filter((c) => String(c.category || '').toLowerCase() === category.toLowerCase())
  }, [cars, category])

  const lead = visible[0]
  const rest = visible.slice(1)

  if (!cars.length) return null

  return (
    <section className="relative bg-[var(--sf-paper,#f4f1ec)] py-16 sm:py-20 md:py-28">
      <div className="page-pad page-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{t('featured.eyebrow')}</p>
            <h2 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl md:text-5xl">{t('featured.title')}</h2>
            <p className="mt-3 text-sm font-light leading-relaxed text-muted sm:text-base">{t('featured.subtitle')}</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setCategory('')}
              className={`${booking.chip} booking-tap shrink-0 ${!category ? booking.chipPrimaryActive : booking.chipIdle}`}
            >
              {t('cars.allCategories')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`${booking.chip} booking-tap shrink-0 ${
                  category.toLowerCase() === cat.toLowerCase() ? booking.chipPrimaryActive : booking.chipIdle
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {lead ? (
          <Motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            className="mt-10 grid overflow-hidden rounded-[1.5rem] bg-ink text-white lg:grid-cols-12"
          >
            <button
              type="button"
              onClick={() => {
                navigate(publicPath?.(`/car-details/${lead._id}`) || `/car-details/${lead._id}`)
                window.scrollTo(0, 0)
              }}
              className="relative aspect-[16/10] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[28rem]"
            >
              {vehicleImage(lead) ? (
              <img
                src={vehicleImage(lead)}
                alt={`${lead.brand} ${lead.model}`}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                loading="eager"
                decoding="async"
              />
              ) : (
                <div className="flex h-full min-h-[16rem] items-center justify-center text-sm uppercase tracking-[0.16em] text-white/40">
                  {lead.brand} {lead.model}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/40" />
            </button>
            <div className="flex flex-col justify-center px-6 py-8 sm:px-10 lg:col-span-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">{t('storefront.featuredLead')}</p>
              <h3 className="mt-3 font-display text-3xl font-medium sm:text-4xl">
                {lead.brand} {lead.model}
              </h3>
              <p className="mt-3 text-sm text-white/65">
                {[
                  lead.transmission,
                  lead.seating_capacity ? t('carDetails.seats', { count: lead.seating_capacity }) : null,
                  lead.fuel_type,
                ].filter(Boolean).join(' · ')}
              </p>
              <p className="mt-6 font-display text-2xl">
                {t('storefront.fromPrice', { price: `${currency}${lead.pricePerDay}` })}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  className={booking.btnPrimary}
                  onClick={() => {
                    navigate(publicPath?.(`/car-details/${lead._id}`) || `/car-details/${lead._id}`)
                    window.scrollTo(0, 0)
                  }}
                >
                  {t('storefront.viewVehicle')}
                </button>
                <button type="button" className={booking.btnSecondary} onClick={() => navigate(carsPath)}>
                  {t('featured.exploreAll')}
                </button>
              </div>
            </div>
          </Motion.article>
        ) : null}

        {rest.length ? (
          <div className="mt-10">
            <p className="mb-4 text-xs uppercase tracking-[0.16em] text-muted lg:hidden">{t('storefront.scrollFleet')}</p>
            <div className="sf-hscroll">
              {rest.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default FeaturedSection
