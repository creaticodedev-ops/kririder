import React, { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom'
import { useSuperAdmin } from '../../context/SuperAdminContext'
import { useI18n } from '../../i18n/I18nContext'
import { BRAND_NAME } from '../../constants/brand'
import { SaThemeProvider, useSaTheme } from './SaThemeContext'
import { sa } from './saUi'

const Icon = ({ d, className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
)

const ICONS = {
  dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
  agencies: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1',
  billing: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  staff: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  activity: 'M13 10V3L4 14h7v7l9-11h-7z',
  audit: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  requests: 'M3 7a2 2 0 012-2h10a2 2 0 012 2v9a2 2 0 01-2 2H8l-3 3v-3H5a2 2 0 01-2-2V7z',
  settings: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  sun: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  moon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  collapse: 'M11 19l-7-7 7-7m8 14l-7-7 7-7',
}

const NAV_GROUPS = [
  {
    label: 'Platform',
    links: [
      { to: '/superadmin', end: true, label: 'Dashboard', icon: ICONS.dashboard },
      { to: '/superadmin/requests', label: 'Requests', icon: ICONS.requests },
      { to: '/superadmin/agencies', label: 'Agencies', icon: ICONS.agencies },
      { to: '/superadmin/billing', label: 'Billing', icon: ICONS.billing },
    ],
  },
  {
    label: 'People',
    links: [
      { to: '/superadmin/admins', label: 'Staff', icon: ICONS.staff },
      { to: '/superadmin/permissions', labelKey: 'superadmin.perms.nav', fallback: 'Settings', icon: ICONS.settings },
    ],
  },
  {
    label: 'System',
    links: [
      { to: '/superadmin/activity', label: 'Activity', icon: ICONS.activity },
      { to: '/superadmin/audit', label: 'Audit', icon: ICONS.audit },
    ],
  },
]

const PAGE_TITLES = [
  { match: /^\/superadmin\/requests/, title: 'Agency requests' },
  { match: /^\/superadmin\/agencies\/[^/]+$/, title: 'Agency detail' },
  { match: /^\/superadmin\/agencies/, title: 'Agencies' },
  { match: /^\/superadmin\/admins\/[^/]+$/, title: 'Staff profile' },
  { match: /^\/superadmin\/admins/, title: 'Staff' },
  { match: /^\/superadmin\/billing/, title: 'Billing' },
  { match: /^\/superadmin\/permissions/, title: 'Settings' },
  { match: /^\/superadmin\/activity/, title: 'Activity' },
  { match: /^\/superadmin\/audit/, title: 'Audit logs' },
  { match: /^\/superadmin\/?$/, title: 'Dashboard' },
]

const Shell = () => {
  const { authReady, isSuperAdmin, user, logout, navigate } = useSuperAdmin()
  const { t } = useI18n()
  const { theme, toggleTheme } = useSaTheme()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sa_sidebar') === '1')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const pageTitle = useMemo(() => {
    const hit = PAGE_TITLES.find(({ match }) => match.test(location.pathname))
    return hit?.title || 'Super Admin'
  }, [location.pathname])

  const navGroups = useMemo(
    () =>
      NAV_GROUPS.map((group) => ({
        ...group,
        links: group.links.map((link) => ({
          ...link,
          label: link.labelKey ? t(link.labelKey) || link.fallback : link.label,
        })),
      })),
    [t],
  )

  useEffect(() => {
    if (authReady && !isSuperAdmin) navigate('/superadmin/login', { replace: true })
  }, [authReady, isSuperAdmin, navigate])

  useEffect(() => {
    setMobileOpen(false)
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    try {
      localStorage.setItem('sa_sidebar', collapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [collapsed])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onPointer = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  if (!authReady) {
    return (
      <div className="min-h-svh flex items-center justify-center text-sm text-[var(--sa-text-muted)]">
        Loading Super Admin…
      </div>
    )
  }

  if (!isSuperAdmin) return <Navigate to="/superadmin/login" replace />

  const NavItems = ({ compact }) =>
    navGroups.map((group) => (
      <div key={group.label} className="mb-2 last:mb-0">
        {!compact ? <p className={sa.sectionLabel}>{group.label}</p> : null}
        <div className="space-y-0.5">
          {group.links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              title={link.label}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-[var(--sa-radius-sm)] px-2.5 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[var(--sa-accent-soft)] text-[var(--sa-accent)]'
                    : 'text-[var(--sa-text-secondary)] hover:bg-[var(--sa-surface-2)] hover:text-[var(--sa-text)]'
                } ${compact ? 'justify-center px-2' : ''}`
              }
            >
              <Icon d={link.icon} className="w-[18px] h-[18px] shrink-0" />
              {!compact ? <span className="truncate">{link.label}</span> : null}
            </NavLink>
          ))}
        </div>
      </div>
    ))

  return (
    <div className="min-h-svh flex bg-[var(--sa-bg)] text-[var(--sa-text)]">
      <aside
        className={`hidden lg:flex flex-col border-r border-[var(--sa-border)] bg-[var(--sa-sidebar)] sticky top-0 h-svh transition-[width] duration-200 ${
          collapsed ? 'w-[4.25rem]' : 'w-60'
        }`}
      >
        <div className={`flex items-center gap-2 border-b border-[var(--sa-border)] px-3 py-4 ${collapsed ? 'justify-center' : ''}`}>
          {!collapsed ? (
            <div className="min-w-0 flex-1">
              <p className="font-semibold tracking-tight truncate">{BRAND_NAME}</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--sa-accent)]">Super Admin</p>
            </div>
          ) : (
            <span className="text-[var(--sa-accent)] font-bold text-sm" title={BRAND_NAME}>
              SA
            </span>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto sa-scrollbar p-2">
          <NavItems compact={collapsed} />
        </nav>
        <div className="border-t border-[var(--sa-border)] p-2">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className={`${sa.btnGhost} w-full ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon d={ICONS.collapse} className="w-4 h-4" />
            {!collapsed ? <span>Collapse</span> : null}
          </button>
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[var(--sa-overlay)]"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 h-full w-72 max-w-[85vw] bg-[var(--sa-sidebar)] border-r border-[var(--sa-border)] flex flex-col shadow-[var(--sa-shadow)]">
            <div className="px-4 py-4 border-b border-[var(--sa-border)]">
              <p className="font-semibold">{BRAND_NAME}</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--sa-accent)]">Super Admin</p>
            </div>
            <nav className="flex-1 p-2 overflow-y-auto sa-scrollbar">
              <NavItems compact={false} />
            </nav>
          </aside>
        </div>
      ) : null}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 border-b border-[var(--sa-border)] bg-[var(--sa-bg-elevated)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--sa-bg-elevated)]/80">
          <div className="flex items-center justify-between gap-3 px-3 sm:px-5 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                className={`${sa.btnGhost} lg:hidden`}
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
              >
                <Icon d={ICONS.menu} />
              </button>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate text-[var(--sa-text)]">{pageTitle}</p>
                <p className="text-[11px] text-[var(--sa-text-muted)] truncate lg:hidden">{BRAND_NAME}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className={sa.btnGhost}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle theme"
              >
                <Icon d={theme === 'dark' ? ICONS.sun : ICONS.moon} className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className={`${sa.btnSecondary} !min-h-9 !px-2.5`}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <span className="max-w-[9rem] truncate text-xs sm:text-sm">{user?.email || 'Account'}</span>
                </button>
                {menuOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 mt-1.5 w-52 rounded-[var(--sa-radius)] border border-[var(--sa-border)] bg-[var(--sa-surface)] shadow-[var(--sa-shadow)] py-1 z-50"
                  >
                    <p className="px-3 py-2 text-[11px] text-[var(--sa-text-muted)] truncate border-b border-[var(--sa-border)]">
                      {user?.name || 'Super Admin'}
                    </p>
                    <button
                      type="button"
                      role="menuitem"
                      className="w-full text-left px-3 py-2.5 text-sm text-[var(--sa-danger)] hover:bg-[var(--sa-danger-soft)] focus-visible:outline-none"
                      onClick={logout}
                    >
                      Sign out
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-3 sm:px-5 lg:px-8 py-5 sm:py-7 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

const SuperAdminLayout = () => (
  <SaThemeProvider>
    <Shell />
  </SaThemeProvider>
)

export default SuperAdminLayout
