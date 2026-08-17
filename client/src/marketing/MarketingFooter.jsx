import { Link } from 'react-router-dom'
import BrandMark from './BrandMark'
import { BRAND } from './config'
import { useMktI18n } from './i18n/MarketingI18n'

export const MarketingFooter = () => {
  const { t } = useMktI18n()
  return (
    <footer className="mkt-foot">
      <div className="mkt-wrap">
        <div className="mkt-foot-grid">
          <div>
            <BrandMark variant="dark" size="foot" />
            <p className="mkt-lead" style={{ marginTop: '1rem', fontSize: '0.92rem' }}>
              {t('footer.blurb')}
            </p>
          </div>
          <div>
            <h2>{t('footer.product')}</h2>
            <Link to="/#features">{t('nav.features')}</Link>
            <Link to="/#pricing">{t('nav.pricing')}</Link>
            <Link to="/#product">{t('footer.workspace')}</Link>
          </div>
          <div>
            <h2>{t('footer.company')}</h2>
            <Link to="/about">{t('nav.about')}</Link>
            <Link to="/contact">{t('footer.contact')}</Link>
          </div>
          <div>
            <h2>{t('footer.legal')}</h2>
            <Link to="/privacy">{t('footer.privacy')}</Link>
            <Link to="/terms">{t('footer.terms')}</Link>
          </div>
        </div>
        <div className="mkt-foot-legal">
          <p>
            © {new Date().getFullYear()} {BRAND}. {t('footer.rights')}
          </p>
          <p>{t('footer.built')}</p>
        </div>
      </div>
    </footer>
  )
}

export default MarketingFooter
