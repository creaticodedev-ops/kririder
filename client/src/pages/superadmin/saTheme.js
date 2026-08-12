/**
 * Super Admin theme tokens — scoped under .sa-app[data-theme].
 * Not inverted colors: distinct light/dark surfaces.
 */
export const SA_THEME_KEY = 'sa_theme'

export const getInitialSaTheme = () => {
  try {
    const saved = localStorage.getItem(SA_THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

export const saThemeStyles = `
.sa-app {
  --sa-font: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
  --sa-display: "Fraunces", "IBM Plex Serif", Georgia, serif;
  --sa-radius: 10px;
  --sa-radius-sm: 8px;
  --sa-focus: 0 0 0 3px color-mix(in srgb, var(--sa-accent) 35%, transparent);
  font-family: var(--sa-font);
  color: var(--sa-text);
  background: var(--sa-bg);
  min-height: 100svh;
}

.sa-app[data-theme="dark"] {
  --sa-bg: #0b0f14;
  --sa-bg-elevated: #0f141b;
  --sa-surface: #121821;
  --sa-surface-2: #171e29;
  --sa-border: rgba(255,255,255,0.08);
  --sa-border-strong: rgba(255,255,255,0.14);
  --sa-text: #e8edf5;
  --sa-text-secondary: #9aa8bc;
  --sa-text-muted: #6b7a90;
  --sa-accent: #2dd4bf;
  --sa-accent-hover: #5eead4;
  --sa-accent-soft: rgba(45,212,191,0.12);
  --sa-danger: #f87171;
  --sa-danger-soft: rgba(248,113,113,0.12);
  --sa-warn: #fbbf24;
  --sa-warn-soft: rgba(251,191,36,0.12);
  --sa-success: #34d399;
  --sa-success-soft: rgba(52,211,153,0.12);
  --sa-info: #38bdf8;
  --sa-info-soft: rgba(56,189,248,0.12);
  --sa-sidebar: #0a0e13;
  --sa-overlay: rgba(2,6,12,0.55);
  --sa-shadow: 0 12px 40px rgba(0,0,0,0.35);
  --sa-chart-1: #2dd4bf;
  --sa-chart-2: #38bdf8;
  --sa-chart-3: #a78bfa;
  --sa-chart-4: #fbbf24;
  --sa-input-bg: #0c1118;
  --sa-on-accent: #042f2e;
}

.sa-app[data-theme="light"] {
  --sa-bg: #f4f6f9;
  --sa-bg-elevated: #ffffff;
  --sa-surface: #ffffff;
  --sa-surface-2: #f8fafc;
  --sa-border: rgba(15,23,42,0.08);
  --sa-border-strong: rgba(15,23,42,0.14);
  --sa-text: #0f172a;
  --sa-text-secondary: #475569;
  --sa-text-muted: #64748b;
  --sa-accent: #0f766e;
  --sa-accent-hover: #0d9488;
  --sa-accent-soft: rgba(15,118,110,0.1);
  --sa-danger: #dc2626;
  --sa-danger-soft: rgba(220,38,38,0.08);
  --sa-warn: #d97706;
  --sa-warn-soft: rgba(217,119,6,0.1);
  --sa-success: #059669;
  --sa-success-soft: rgba(5,150,105,0.1);
  --sa-info: #0284c7;
  --sa-info-soft: rgba(2,132,199,0.1);
  --sa-sidebar: #ffffff;
  --sa-overlay: rgba(15,23,42,0.4);
  --sa-shadow: 0 12px 40px rgba(15,23,42,0.08);
  --sa-chart-1: #0f766e;
  --sa-chart-2: #0284c7;
  --sa-chart-3: #7c3aed;
  --sa-chart-4: #d97706;
  --sa-input-bg: #ffffff;
  --sa-on-accent: #ffffff;
}

.sa-app * { box-sizing: border-box; }
.sa-app a { color: inherit; }
.sa-app button:focus-visible,
.sa-app a:focus-visible,
.sa-app input:focus-visible,
.sa-app select:focus-visible,
.sa-app textarea:focus-visible {
  outline: none;
  box-shadow: var(--sa-focus);
}
.sa-app input[type="checkbox"],
.sa-app input[type="radio"] {
  accent-color: var(--sa-accent);
}
.sa-scrollbar::-webkit-scrollbar-thumb {
  background: var(--sa-border-strong);
  border-radius: 999px;
}
`

export default { SA_THEME_KEY, getInitialSaTheme, saThemeStyles }
