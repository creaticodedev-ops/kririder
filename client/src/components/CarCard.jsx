import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'
import { useAppContext } from '../context/AppContext'
import { formatLocationsDisplay } from '../utils/carLocations'
import PromotionBadge, { PromotionPriceTag } from './PromotionBadge'
import { vehicleImage } from '../storefront/theme'

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY || 'MAD '
  const navigate = useNavigate()
  const { t } = useI18n()
  const { publicPath, storefrontProfile } = useAppContext()
  const money = storefrontProfile?.currency ? `${storefrontProfile.currency} ` : currency
  const promo = car?.displayPromotion || null
  const detailsPath = publicPath?.(`/car-details/${car._id}`) || `/car-details/${car._id}`
  const src = vehicleImage(car)

  const open = () => {
    navigate(detailsPath)
    window.scrollTo(0, 0)
  }

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          open()
        }
      }}
      className="group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#ece7e1]">
        {src ? (
          <img
            src={src}
            alt={`${car.brand} ${car.model}`}
            width={800}
            height={500}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.16em] text-muted">
            {car.brand} {car.model}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-x-8 bottom-[18%] h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          <div className="absolute bottom-[12%] left-[18%] h-8 w-8 rounded-full bg-white/25 blur-md" />
          <div className="absolute bottom-[12%] right-[18%] h-8 w-8 rounded-full bg-amber-100/35 blur-md" />
        </div>
        {promo ? <PromotionBadge promotion={promo} currency={money} /> : null}
        {car.isAvaliable ? (
          <p className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
            {t('storefront.available')}
          </p>
        ) : null}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-[1.35rem] font-medium leading-tight text-ink">
            {car.brand} {car.model}
          </h3>
          <p className="mt-1 truncate text-xs text-muted">
            {[
              car.category,
              car.transmission,
              car.seating_capacity ? t('carDetails.seats', { count: car.seating_capacity }) : null,
              car.fuel_type,
            ].filter(Boolean).join(' · ')}
          </p>
          <p className="mt-1 truncate text-xs text-muted/80">{formatLocationsDisplay(car)}</p>
        </div>
        {promo ? (
          <PromotionPriceTag promotion={promo} currency={money} perDayLabel={t('carCard.perDay')} />
        ) : (
          <div className="shrink-0 text-right">
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted">{t('carCard.perDay')}</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-ink">
              {money}
              {car.pricePerDay}
            </p>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs font-medium text-primary">{t('storefront.viewVehicle')} →</p>
    </article>
  )
}

export default CarCard
