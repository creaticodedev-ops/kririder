import SeoHead from '../../seo/SeoHead'
import BrandMark from '../../marketing/BrandMark'
import MarketingLayout from '../../marketing/MarketingLayout'
import { BRAND, CONTACT_EMAIL } from '../../marketing/config'

const PrivacyPage = () => (
  <MarketingLayout>
    <SeoHead
      title="Privacy"
      description="Privacy information for the KRIRIDER SaaS marketing website and platform."
      path="/privacy"
      lang="en"
      locale="en_GB"
      siteName={BRAND}
    />
    <section className="mkt-wrap mkt-section">
      <BrandMark variant="light" size="page" />
      <p className="mkt-kicker">Legal</p>
      <h1 className="mkt-h1" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
        Privacy
      </h1>
      <div className="mkt-lead" style={{ marginTop: '1.2rem', display: 'grid', gap: '1rem' }}>
        <p>
          This page describes how KRIRIDER uses information collected on this marketing website (kririder.com). Tenant storefronts operated by rental agencies have their own customer relationships.
        </p>
        <p>
          If you send a trial or demo request, we use the details you provide (name, email, company, fleet size and message) solely to respond to that request and evaluate whether KRIRIDER is a fit.
        </p>
        <p>
          The product application stores operational data for each agency under that agency’s account. Agency owners remain responsible for their customer data.
        </p>
        <p>
          Analytics may be collected on this site to understand how the marketing pages are used. You can control cookies in your browser.
        </p>
        {CONTACT_EMAIL ? (
          <p>
            Privacy questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        ) : (
          <p>For privacy questions, use the contact form on this website.</p>
        )}
      </div>
    </section>
  </MarketingLayout>
)

const TermsPage = () => (
  <MarketingLayout>
    <SeoHead
      title="Terms"
      description="Terms of use for the KRIRIDER marketing website."
      path="/terms"
      lang="en"
      locale="en_GB"
      siteName={BRAND}
    />
    <section className="mkt-wrap mkt-section">
      <BrandMark variant="light" size="page" />
      <p className="mkt-kicker">Legal</p>
      <h1 className="mkt-h1" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
        Terms of use
      </h1>
      <div className="mkt-lead" style={{ marginTop: '1.2rem', display: 'grid', gap: '1rem' }}>
        <p>
          These terms apply to the KRIRIDER marketing website. Access to the KRIRIDER application for an agency is governed by that agency’s subscription and onboarding agreement.
        </p>
        <p>
          The marketing pages describe current product capabilities. Plan names shown publicly (Starter, Professional, Business) correspond to the product catalog and may be updated. Limits and features of a live agency follow the plan assigned in the product.
        </p>
        <p>
          KRIRIDER is not a rental company. Vehicle hire contracts on tenant storefronts are between the renter and the rental agency.
        </p>
        <p>The website is provided as-is for informational purposes. Do not rely on placeholder or sample interface data as live business records.</p>
        {CONTACT_EMAIL ? (
          <p>
            Questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        ) : null}
      </div>
    </section>
  </MarketingLayout>
)

export { PrivacyPage, TermsPage }
export default PrivacyPage
