import { useMemo } from 'react'
import { Link, Navigate } from 'react-router-dom'
import SeoPageShell from './SeoPageShell'
import { useAppContext } from '../../context/AppContext'
import { uniqueCarSlug } from '../../seo/slugify'
import { SEO_CATEGORIES } from '../../seo/data/categories'
import { breadcrumbJsonLd, vehicleProductJsonLd } from '../../seo/jsonLd'
import { SITE_ORIGIN } from '../../seo/constants'

const VehicleSeoPage = ({ slug }) => {
  const { cars, carsLoading, publicPath, storefrontProfile, storefrontSlug } = useAppContext()
  const isTenant = Boolean(storefrontSlug || storefrontProfile?.agencyId)
  const brand = storefrontProfile?.name || ''
  const origin = storefrontProfile?.storefrontUrl
    ? storefrontProfile.storefrontUrl.replace(/\/s\/[^/]+\/?$/, '') || SITE_ORIGIN
    : SITE_ORIGIN

  const car = useMemo(() => {
    if (!cars?.length) return null
    return cars.find((c) => uniqueCarSlug(c, cars) === slug) || null
  }, [cars, slug])

  if (carsLoading && !cars?.length) {
    return <div className="page-shell page-pad py-16 text-center text-muted">Chargement…</div>
  }

  const carsPath = publicPath?.('/cars') || '/cars'
  if (!car) return <Navigate to={carsPath} replace />

  const path = publicPath?.(`/cars/${slug}`) || `/cars/${slug}`
  const detailsPath = publicPath?.(`/car-details/${car._id}`) || `/car-details/${car._id}`
  const name = `${car.brand} ${car.model}`.trim()
  const cat = !isTenant
    ? SEO_CATEGORIES.find(
        (c) => c.filterType === 'category' && c.filterValue.toLowerCase() === String(car.category || '').toLowerCase(),
      )
    : null
  const title = brand ? `${name} — ${brand}` : `Location ${name}`
  const description = brand
    ? `${name}${car.category ? ` (${car.category})` : ''}. ${brand}.`
    : `${name}`
  const breadcrumbs = [
    { name: 'Accueil', path: publicPath?.('/') || '/' },
    { name: 'Véhicules', path: carsPath },
    ...(cat ? [{ name: cat.name, path: publicPath?.(`/cars/${cat.slug}`) || `/cars/${cat.slug}` }] : []),
    { name, path },
  ]

  const sections = [
    {
      heading: name,
      body: [
        car.transmission,
        car.fuel_type,
        car.seating_capacity,
        car.category,
      ]
        .filter(Boolean)
        .join(' · '),
    },
  ]

  return (
    <SeoPageShell
      title={title}
      description={description}
      path={path}
      h1={name}
      intro={brand ? `${brand}` : ''}
      sections={sections}
      breadcrumbs={breadcrumbs}
      ctaTo={detailsPath}
      ctaLabel={`Réserver — ${name}`}
      siteName={brand || undefined}
      origin={origin}
      image={car.image || undefined}
      jsonLd={[
        breadcrumbJsonLd(breadcrumbs, origin),
        vehicleProductJsonLd(car, path, storefrontProfile),
      ]}
      related={
        cat
          ? [
              {
                title: 'Catégories',
                links: [
                  { to: publicPath?.(`/cars/${cat.slug}`) || `/cars/${cat.slug}`, label: cat.name },
                ],
              },
            ]
          : []
      }
    >
      <section className="mt-8 border border-borderColor/80 bg-white p-4 text-sm text-muted">
        <p>
          {car.category ? <><strong className="text-ink">{car.category}</strong>{' · '}</> : null}
          {car.transmission ? <><strong className="text-ink">{car.transmission}</strong>{' · '}</> : null}
          {typeof car.pricePerDay === 'number' ? (
            <>
              <strong className="text-ink">{car.pricePerDay} {storefrontProfile?.currency || 'MAD'}</strong>/jour
            </>
          ) : null}
        </p>
        <p className="mt-2">
          <Link to={detailsPath} className="text-primary hover:underline">
            {name}
          </Link>
        </p>
      </section>
    </SeoPageShell>
  )
}

export default VehicleSeoPage
