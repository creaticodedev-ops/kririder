import React, { lazy, Suspense } from 'react'
import Hero from '../components/Hero'
import SeoHead from '../seo/SeoHead'
import { localBusinessJsonLd, organizationJsonLd, websiteJsonLd } from '../seo/jsonLd'
import { useAppContext } from '../context/AppContext'
import { SITE_ORIGIN } from '../seo/constants'

const FeaturedSection = lazy(() => import('../components/FeaturedSection'))
const Banner = lazy(() => import('../components/Banner'))
const Testimonial = lazy(() => import('../components/Testimonial'))
const WhyChoose = lazy(() => import('../components/WhyChoose'))
const SeoHomeModule = lazy(() => import('../components/SeoHomeModule'))

const SectionFallback = () => (
  <div className="min-h-[12rem] w-full" aria-hidden />
)

const Home = () => {
  const { storefrontProfile, storefrontSlug, publicPath } = useAppContext()
  const isTenant = Boolean(storefrontSlug || storefrontProfile?.agencyId)
  const brandName = storefrontProfile?.name || ''
  const title = storefrontProfile?.seo?.title ||
    (brandName ? `${brandName} — Car rental` : 'Car rental')
  const description = storefrontProfile?.seo?.description ||
    (brandName ? `Book a car with ${brandName}.` : 'Book a car online.')
  const path = publicPath?.('/') || (storefrontSlug ? `/s/${storefrontSlug}` : '/')
  const origin = storefrontProfile?.storefrontUrl
    ? storefrontProfile.storefrontUrl.replace(/\/s\/[^/]+\/?$/, '') || SITE_ORIGIN
    : (typeof window !== 'undefined' ? window.location.origin : SITE_ORIGIN)
  const ogImage = storefrontProfile?.seo?.ogImageUrl || storefrontProfile?.logoUrl || undefined

  return (
    <>
      <SeoHead
        title={title}
        description={description}
        path={path}
        image={ogImage}
        siteName={brandName || undefined}
        origin={origin}
        faviconUrl={storefrontProfile?.faviconUrl || storefrontProfile?.logoUrl || ''}
        jsonLd={
          isTenant || storefrontProfile
            ? [
                organizationJsonLd(storefrontProfile),
                websiteJsonLd(storefrontProfile),
                localBusinessJsonLd(storefrontProfile),
              ]
            : [
                organizationJsonLd(null),
                websiteJsonLd(null),
                localBusinessJsonLd(null),
              ]
        }
      />
      <Hero />
      <Suspense fallback={<SectionFallback />}>
        <FeaturedSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Banner />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Testimonial />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <WhyChoose />
      </Suspense>
      {!isTenant ? (
        <Suspense fallback={<SectionFallback />}>
          <SeoHomeModule />
        </Suspense>
      ) : null}
    </>
  )
}

export default Home
