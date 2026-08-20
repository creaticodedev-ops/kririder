export const buildTrustPoints = ({ profile, locations = [], cars = [], t }) => {
  const points = []
  const brand = profile?.name || t('storefront.thisAgency')
  const cities = [...new Set(locations.map((l) => l.city).filter(Boolean))]
  const hasAirport = locations.some((l) => String(l.locationType || '').toLowerCase() === 'airport')
  const hasPrices = cars.some((c) => c.pricePerDay != null && c.pricePerDay !== '')

  if (cars.length) {
    points.push({
      id: 'fleet',
      title: t('storefront.trustFleetTitle'),
      description: t('storefront.trustFleetBody', { count: String(cars.length), brand }),
    })
  }

  if (hasPrices) {
    points.push({
      id: 'pricing',
      title: t('storefront.trustPriceTitle'),
      description: t('storefront.trustPriceBody'),
    })
  }

  points.push({
    id: 'booking',
    title: t('storefront.trustBookTitle'),
    description: t('storefront.trustBookBody'),
  })

  if (hasAirport) {
    points.push({
      id: 'airport',
      title: t('storefront.trustAirportTitle'),
      description: t('storefront.trustAirportBody'),
    })
  } else if (cities.length) {
    points.push({
      id: 'locations',
      title: t('storefront.trustCitiesTitle'),
      description: t('storefront.trustCitiesBody', { cities: cities.slice(0, 4).join(', ') }),
    })
  }

  if (profile?.whatsapp || profile?.phone) {
    points.push({
      id: 'support',
      title: t('storefront.trustSupportTitle'),
      description: t('storefront.trustSupportBody'),
    })
  }

  return points.slice(0, 4)
}

export const bannerCopyAllowed = ({ locations = [] }) => {
  const hasAirport = locations.some((l) => String(l.locationType || '').toLowerCase() === 'airport')
  const cities = [...new Set(locations.map((l) => l.city).filter(Boolean))]
  return { hasAirport, cities }
}
