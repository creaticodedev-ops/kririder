import SeoHead from '../../seo/SeoHead'
import MarketingLayout from '../../marketing/MarketingLayout'
import { BRAND, CLIENTS } from '../../marketing/config'
import { DemoCta, PrimaryCta } from '../../marketing/Ctas'

export const AboutPage = () => (
  <MarketingLayout>
    <SeoHead
      title="About KRIRIDER"
      description="KRIRIDER is car rental management software built for agencies that need one operational system."
      path="/about"
      lang="en"
      locale="en_GB"
      siteName={BRAND}
    />
    <section className="mkt-wrap mkt-section">
      <p className="mkt-kicker">Company</p>
      <h1 className="mkt-h1" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
        Software for rental companies — not a rental company website.
      </h1>
      <p className="mkt-lead" style={{ marginTop: '1.2rem' }}>
        KRIRIDER is the platform. Rental businesses run their operations on it: reservations, fleet, customers, contracts, signatures and reporting.
      </p>
      <p className="mkt-lead" style={{ marginTop: '1rem' }}>
        Agencies such as {CLIENTS.map((c) => c.name).join(' and ')} use KRIRIDER as clients. Their brands remain theirs. KRIRIDER stays the product.
      </p>
      <div className="mkt-actions" style={{ marginTop: '1.8rem' }}>
              <PrimaryCta>Start free trial</PrimaryCta>
        <DemoCta />
      </div>
    </section>
  </MarketingLayout>
)

export default AboutPage
