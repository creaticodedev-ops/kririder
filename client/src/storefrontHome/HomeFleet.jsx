import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useI18n } from '../i18n/I18nContext'

const HomeFleet = ({ vehicles }) => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { publicPath, currency } = useAppContext()
  if (!vehicles.length) return null

  const [lead, ...rest] = vehicles
  const open = (car) => {
    const path = publicPath?.(`/car-details/${car._id}`) || `/car-details/${car._id}`
    navigate(path)
    window.scrollTo(0, 0)
  }

  return (
    <section id="fleet" className="sf-section sf-fleet" aria-labelledby="sf-fleet-title">
      <div className="page-pad page-shell">
        <p className="sf-eyebrow">{t('featured.eyebrow')}</p>
        <h2 id="sf-fleet-title">{t('featured.title')}</h2>

        <div className="sf-feature mt-10 md:mt-14">
          <button type="button" className="sf-feature-visual" onClick={() => open(lead)}>
            <img
              src={lead.image || lead.images?.[0]}
              alt={`${lead.brand} ${lead.model}`}
              width={1200}
              height={750}
              loading="lazy"
              decoding="async"
            />
          </button>
          <div className="sf-feature-copy">
            <p className="sf-eyebrow">{lead.category}</p>
            <h3 className="sf-feature-name">
              {lead.brand} {lead.model}
            </h3>
            <p className="text-sm font-light text-white/65">
              {lead.year ? `${lead.year} · ` : ''}
              {t('hero.fromPerDay', { price: `${currency}${lead.pricePerDay}` })}
            </p>
            <div className="sf-actions">
              <button type="button" className="sf-btn sf-btn-primary" onClick={() => open(lead)}>
                {t('home.viewVehicle')}
              </button>
              <button
                type="button"
                className="sf-btn sf-btn-ghost"
                onClick={() => {
                  navigate(publicPath?.('/cars') || '/cars')
                  window.scrollTo(0, 0)
                }}
              >
                {t('featured.exploreAll')}
              </button>
            </div>
          </div>
        </div>

        {rest.length ? (
          <div className="sf-strip">
            {rest.map((car) => (
              <button
                key={car._id}
                type="button"
                className="sf-strip-card"
                onClick={() => open(car)}
              >
                <img
                  src={car.image || car.images?.[0]}
                  alt={`${car.brand} ${car.model}`}
                  width={480}
                  height={300}
                  loading="lazy"
                  decoding="async"
                />
                <p className="font-display text-xl">{car.brand} {car.model}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/50">
                  {car.category} · {t('hero.fromPerDay', { price: `${currency}${car.pricePerDay}` })}
                </p>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default HomeFleet
