import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useLocation, useNavigate } from "react-router-dom";
import { getErrorMessage } from '../utils/apiError';
import { resolveOwnerPermissions, ownerHasPermission } from '../utils/ownerPermissions';
import { parseStorefrontSlug, storefrontPath } from '../utils/storefront';

import { resolveApiBaseUrl } from '../utils/apiBase';

const API_BASE_URL = resolveApiBaseUrl();
axios.defaults.baseURL = API_BASE_URL

const DEFAULT_PRIMARY = '#8F1F1F'

export const AppContext = createContext();

const isLicenseLocked = (license) => {
  if (!license) return false
  if (license.allowed === false) return true
  return license.licenseStatus === 'expired'
}

const clearOwnerSession = () => {
  localStorage.removeItem('token')
  delete axios.defaults.headers.common['Authorization']
}

const applyAgencySlugHeader = (slug) => {
  if (slug) {
    axios.defaults.headers.common['X-Agency-Slug'] = slug
  } else {
    delete axios.defaults.headers.common['X-Agency-Slug']
  }
}

export const AppProvider = ({ children })=>{

    const navigate = useNavigate()
    const location = useLocation()
    const currency = import.meta.env.VITE_CURRENCY || 'MAD '

    const storefrontSlug = useMemo(() => {
      const fromPath = parseStorefrontSlug(location.pathname)
      if (fromPath) return fromPath
      try {
        return String(new URLSearchParams(location.search).get('agency') || '')
          .trim()
          .toLowerCase()
      } catch {
        return ''
      }
    }, [location.pathname, location.search])

    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [onboardingRequired, setOnboardingRequired] = useState(false)
    const [license, setLicense] = useState(null)
    const [authReady, setAuthReady] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [pickupDate, setPickupDate] = useState('')
    const [returnDate, setReturnDate] = useState('')

    const [cars, setCars] = useState([])
    const [carsLoading, setCarsLoading] = useState(true)
    const [pickupLocations, setPickupLocations] = useState([])
    const [storefrontProfile, setStorefrontProfile] = useState(null)
    const [storefrontError, setStorefrontError] = useState('')
    const [storefrontReady, setStorefrontReady] = useState(false)

    const applyLicense = useCallback((nextLicense, nextUser) => {
      const resolved = nextLicense || nextUser?.license || null
      setLicense(resolved)
      return resolved
    }, [])

    const resetOwnerAuth = useCallback(() => {
      clearOwnerSession()
      setToken(null)
      setUser(null)
      setIsOwner(false)
      setOnboardingRequired(false)
      setLicense(null)
    }, [])

    const fetchPickupLocations = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/pickup-locations')
            if (data.success) setPickupLocations(data.locations || [])
            else setPickupLocations([])
        } catch (error) {
            console.error(getErrorMessage(error))
            setPickupLocations([])
            if (!error.response || error.response.status >= 500) {
              toast.error('Failed to load pickup locations')
            }
        }
    }, [])

    const fetchUser = useCallback(async ()=>{
        try {
           const {data} = await axios.get('/api/user/data')
           if (data.success && data.user?.role === 'owner') {
            const needsOnboarding = Boolean(data.onboardingRequired)
            const normalizedUser = {
              ...data.user,
              permissions: needsOnboarding
                ? []
                : resolveOwnerPermissions(data.user.permissions || []),
            }
            setUser(normalizedUser)
            setOnboardingRequired(needsOnboarding)
            setIsOwner(!needsOnboarding)
            applyLicense(data.license, data.user)
           } else {
            resetOwnerAuth()
           }
        } catch (error) {
            const code = error.response?.data?.code
            if (code === 'ONBOARDING_REQUIRED') {
              setOnboardingRequired(true)
              setIsOwner(false)
              setAuthReady(true)
              return
            }
            if (error.response?.status === 401 || error.response?.status === 403) {
              resetOwnerAuth()
            }
        } finally {
            setAuthReady(true)
        }
    }, [applyLicense, resetOwnerAuth])

    const fetchCars = useCallback(async () =>{
        setCarsLoading(true)
        try {
            const {data} = await axios.get('/api/user/cars')
            if (data.success) setCars(data.cars || [])
            else {
              setCars([])
              toast.error(data.message)
            }
        } catch (error) {
            setCars([])
            const code = error.response?.data?.code
            if (code === 'PUBLIC_AGENCY_NOT_FOUND') {
              setStorefrontError(error.response?.data?.message || 'Storefront not found')
            } else {
              toast.error(getErrorMessage(error, 'Failed to load cars'))
            }
        } finally {
            setCarsLoading(false)
        }
    }, [])

    const fetchStorefrontProfile = useCallback(async (slug) => {
      if (!slug) {
        setStorefrontProfile(null)
        setStorefrontError('')
        setStorefrontReady(true)
        return
      }
      setStorefrontReady(false)
      setStorefrontError('')
      try {
        const { data } = await axios.get('/api/public/storefront', {
          params: { agency: slug },
          headers: { 'X-Agency-Slug': slug },
        })
        if (data.success) {
          setStorefrontProfile(data.storefront || null)
        } else {
          setStorefrontProfile(null)
          setStorefrontError(data.message || 'Storefront not found')
        }
      } catch (error) {
        setStorefrontProfile(null)
        setStorefrontError(getErrorMessage(error, 'Storefront not found'))
      } finally {
        setStorefrontReady(true)
      }
    }, [])

    const publicPath = useCallback(
      (path = '/') => storefrontPath(storefrontSlug, path),
      [storefrontSlug],
    )

    const logout = useCallback(()=>{
        resetOwnerAuth()
        toast.success('You have been logged out')
        navigate(storefrontPath(storefrontSlug, '/'))
    }, [navigate, resetOwnerAuth, storefrontSlug])

    const hasPermission = useCallback((permission) => {
      return ownerHasPermission(user, permission)
    }, [user])

    useEffect(()=>{
        const interceptor = axios.interceptors.response.use(
          (response) => response,
          (error) => {
            const status = error.response?.status
            const code = error.response?.data?.code

            if (status === 403 && code === 'ACCOUNT_LOCKED') {
              resetOwnerAuth()
              toast.error(error.response?.data?.message || 'Account locked')
              if (window.location.pathname.startsWith('/owner')) {
                navigate('/')
              }
              return Promise.reject(error)
            }

            if (status === 403 && (code === 'ONBOARDING_REQUIRED' || code === 'PASSWORD_NOT_SET')) {
              setOnboardingRequired(true)
              setIsOwner(false)
              if (window.location.pathname.startsWith('/owner')) {
                navigate('/agency-setup', { replace: true })
              }
              return Promise.reject(error)
            }

            if (status === 403 && code === 'AGENCY_LOCKED') {
              resetOwnerAuth()
              toast.error(error.response?.data?.message || 'Agency suspended')
              if (window.location.pathname.startsWith('/owner')) {
                navigate('/')
              }
              return Promise.reject(error)
            }

            if (status === 403 && code === 'LICENSE_EXPIRED') {
              const next = error.response?.data?.license
              if (next) setLicense(next)
              else setLicense((prev) => ({ ...(prev || {}), licenseStatus: 'expired', allowed: false, daysRemaining: 0 }))
              return Promise.reject(error)
            }

            if (status === 401 && token) {
              resetOwnerAuth()
              toast.error('Session expired. Please log in again.')
              if (window.location.pathname.startsWith('/owner')) {
                navigate('/')
              }
            }
            return Promise.reject(error)
          }
        )
        return () => axios.interceptors.response.eject(interceptor)
    }, [token, navigate, resetOwnerAuth])

    // Scope every public API call to the current agency storefront slug
    useEffect(() => {
      applyAgencySlugHeader(storefrontSlug)
      if (storefrontSlug) {
        fetchStorefrontProfile(storefrontSlug)
      } else {
        setStorefrontProfile(null)
        setStorefrontError('')
        setStorefrontReady(true)
        document.documentElement.style.setProperty('--color-primary', DEFAULT_PRIMARY)
      }
      fetchCars()
      fetchPickupLocations()
    }, [storefrontSlug, fetchCars, fetchPickupLocations, fetchStorefrontProfile])

    useEffect(() => {
      const color = storefrontProfile?.primaryBrandColor
      if (color && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color)) {
        document.documentElement.style.setProperty('--color-primary', color)
      } else if (!storefrontSlug) {
        document.documentElement.style.setProperty('--color-primary', DEFAULT_PRIMARY)
      }
    }, [storefrontProfile, storefrontSlug])

    useEffect(()=>{
        const storedToken = localStorage.getItem('token')
        if(storedToken){
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
            setToken(storedToken)
        } else {
            setAuthReady(true)
        }
    },[])

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            fetchUser()
        }
    },[token, fetchUser])

    const licenseLocked = isLicenseLocked(license)

    const value = useMemo(() => ({
        navigate, currency, axios, user, setUser,
        token, setToken, isOwner, setIsOwner, onboardingRequired, setOnboardingRequired,
        authReady, fetchUser, showLogin, setShowLogin, logout, fetchCars, cars, setCars, carsLoading,
        pickupDate, setPickupDate, returnDate, setReturnDate,
        pickupLocations, fetchPickupLocations,
        license, setLicense, licenseLocked, applyLicense, hasPermission,
        storefrontSlug, storefrontProfile, storefrontError, storefrontReady, publicPath,
    }), [
      navigate, currency, user, token, isOwner, onboardingRequired, authReady, fetchUser, showLogin, logout, fetchCars, cars, carsLoading,
      pickupDate, returnDate, pickupLocations, fetchPickupLocations, license, licenseLocked, applyLicense, hasPermission,
      storefrontSlug, storefrontProfile, storefrontError, storefrontReady, publicPath,
    ])

    return (
    <AppContext.Provider value={value}>
        { children }
    </AppContext.Provider>
    )
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}
