import { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { applyStorefrontBrand, clearStorefrontBrand } from './theme'

const StorefrontTheme = () => {
  const { storefrontProfile, storefrontSlug, hostTenant } = useAppContext()
  const isTenant = Boolean(storefrontSlug || storefrontProfile?.agencyId || hostTenant?.atRoot)

  useEffect(() => {
    const root = document.documentElement
    if (!isTenant) {
      root.classList.remove('sf-app')
      clearStorefrontBrand()
      return undefined
    }
    root.classList.add('sf-app')
    if (storefrontProfile) applyStorefrontBrand(storefrontProfile)
    return () => {
      root.classList.remove('sf-app')
      clearStorefrontBrand()
    }
  }, [isTenant, storefrontProfile])

  return null
}

export default StorefrontTheme
