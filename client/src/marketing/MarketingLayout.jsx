import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MarketingNav } from './MarketingNav'
import { MarketingFooter } from './MarketingFooter'
import './marketing.css'

export const MarketingLayout = ({ children }) => {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const id = hash.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])

  return (
    <div className="mkt">
      <MarketingNav />
      {children}
      <MarketingFooter />
    </div>
  )
}

export default MarketingLayout
