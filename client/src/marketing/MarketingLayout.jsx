import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MarketingNav } from './MarketingNav'
import { MarketingFooter } from './MarketingFooter'
import './marketing.css'

export const MarketingLayout = ({ children, footer = true }) => {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const id = hash.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash, pathname])

  return (
    <div className="mkt">
      <MarketingNav />
      {children}
      {footer ? <MarketingFooter /> : null}
    </div>
  )
}

export default MarketingLayout
