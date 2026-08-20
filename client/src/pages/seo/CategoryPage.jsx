import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import SeoPageShell from './SeoPageShell'
import { getCategoryBySlug } from '../../seo/data/categories'
import { getPublishedCities } from '../../seo/data/cities'
import { useAppContext } from '../../context/AppContext'
import { breadcrumbJsonLd, faqJsonLd } from '../../seo/jsonLd'
import { SITE_ORIGIN } from '../../seo/constants'

const CategoryPage = () => {
  const { slug } = useParams()
  const data = getCategoryBySlug(slug)
  const { cars, publicPath, storefrontProfile, storefrontSlug } = useAppContext()
  const isTenant = Boolean(storefrontSlug || storefrontProfile?.agencyId)
  const brand = storefrontProfile?.name || ''
  const origin = storefrontProfile?.storefrontUrl
    ? storefrontProfile.storefrontUrl.replace(/\/s\/[^/]+\/?$/, '') || SITE_ORIGIN
    : SITE_ORIGIN
  const carsPath = publicPath?.('/cars') || '/cars'

  const matched = useMemo(() => {
    if (!data) return []
    return (cars || []).filter((car) => {
      if (data.filterType === 'transmission') {
        return String(car.transmission || '').toLowerCase() === String(data.filterValue).toLowerCase()
      }
      return String(car.category || '').toLowerCase() === String(data.filterValue).toLowerCase()
    })
  }, [cars, data])

  if (!data) return <Navigate to={carsPath} replace />

  const path = publicPath?.(`/cars/${data.slug}`) || `/cars/${data.slug}`
  const breadcrumbs = [
    { name: 'Accueil', path: publicPath?.('/') || '/' },
    { name: 'Véhicules', path: carsPath },
    { name: data.name, path },
  ]

  const ctaTo =
    data.filterType === 'transmission'
      ? carsPath
      : `${carsPath}?category=${encodeURIComponent(data.filterValue)}`

  const title = isTenant && brand ? `${data.name} — ${brand}` : data.title
  const description = isTenant && brand
    ? `${matched.length} ${data.name}. ${brand}.`
    : data.description

  return (
    <SeoPageShell
      title={title}
      description={description}
      path={path}
      h1={isTenant ? data.name : data.h1}
      intro={isTenant ? brand : data.intro}
      sections={isTenant ? [] : data.sections}
      faqs={isTenant ? [] : data.faqs}
      breadcrumbs={breadcrumbs}
      ctaTo={ctaTo}
      ctaLabel={`${data.name}`}
      siteName={brand || undefined}
      origin={origin}
      jsonLd={[breadcrumbJsonLd(breadcrumbs, origin), isTenant ? null : faqJsonLd(data.faqs)]}
      related={
        isTenant
          ? []
          : [
              {
                title: 'Villes',
                links: getPublishedCities()
                  .filter((c) => (data.relatedCities || []).includes(c.slug))
                  .map((c) => ({ to: `/location-voiture/${c.slug}`, label: c.name })),
              },
              {
                title: 'Guides',
                links: (data.relatedGuides || []).map((g) => ({
                  to: `/guide/${g}`,
                  label: g.replace(/-/g, ' '),
                })),
              },
            ]
      }
    >
      {matched.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ink">{data.name}</h2>
          <ul className="mt-3 space-y-2">
            {matched.slice(0, 12).map((car) => (
                <li key={car._id}>
                  <Link className="text-primary hover:underline" to={publicPath?.(`/car-details/${car._id}`) || `/car-details/${car._id}`}>
                    {car.brand} {car.model}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      )}
    </SeoPageShell>
  )
}

export default CategoryPage
