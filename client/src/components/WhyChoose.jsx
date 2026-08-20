import React, { useMemo } from 'react'
import { motion as Motion } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import { useAppContext } from '../context/AppContext'
import { buildWaMeUrl } from '../utils/whatsapp'
import { buildTrustPoints } from '../storefront/trustPoints'

const WhyChoose = () => {
  const { t } = useI18n()
  const { storefrontProfile, pickupLocations, cars } = useAppContext()
  const brand = storefrontProfile?.name || t('storefront.thisAgency')
  const points = useMemo(
    () => buildTrustPoints({ profile: storefrontProfile, locations: pickupLocations, cars, t }),
    [storefrontProfile, pickupLocations, cars, t],
  )
  const dial = String(storefrontProfile?.whatsapp || storefrontProfile?.phone || '').replace(/\D/g, '')
  const whatsappUrl = dial
    ? buildWaMeUrl(t('whyChoose.whatsappMessage', { brand }), dial)
    : ''

  if (!points.length) return null

  return (
    <section className="bg-[var(--sf-night,#0c0b0a)] py-16 text-[#f7f3ee] sm:py-20 md:py-24">
      <div className="page-pad page-shell">
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl font-medium leading-tight sm:text-4xl md:text-[2.75rem]">
            {t('storefront.whyTitle', { brand })}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm font-light leading-relaxed text-white/60">
            {t('storefront.whySubtitle')}
          </p>
        </Motion.div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((item, index) => (
            <Motion.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.06 }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 text-[15px] font-semibold leading-snug">{item.title}</h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-white/60">{item.description}</p>
            </Motion.div>
          ))}
        </div>

        {whatsappUrl ? (
          <div className="mt-12 flex justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-source="why_choose"
              className="text-sm font-medium text-white/80 underline-offset-4 hover:text-white hover:underline"
            >
              {t('storefront.contactCta')}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default WhyChoose
