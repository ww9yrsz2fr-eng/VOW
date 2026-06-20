import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { LIMITS, TIER_LABELS } from '../../context/SubscriptionConfig'

// ── Icons ────────────────────────────────────────────────────────────────────

const ICONS = {
  overview: (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
  checklist: (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="2.5" y="2.5" width="15" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
  budget: (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M10 6v1m0 6v1M8 9.5c0-.828.672-1.5 1.5-1.5h1c.828 0 1.5.672 1.5 1.5S11.328 11 10.5 11h-1c-.828 0-1.5.672-1.5 1.5S8.672 14 9.5 14h1c.828 0 1.5-.672 1.5-1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  guests: (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M14 10a3 3 0 000-6M18 17c0-2.761-1.79-5.11-4.25-5.854" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  seating: (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="10" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="10" cy="17" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="3" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="17" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  vendors: (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="8" width="15" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M6 8V6a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M2.5 12h15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  timeline: (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <path d="M3 10h14M10 3v14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="6" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="14" cy="14" r="1.8" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="14" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="6" cy="14" r="1.8" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  export: (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <path d="M10 3v10M6 9l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 14v1a2 2 0 002 2h10a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  settings: (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.05 4.05l1.41 1.41M14.54 14.54l1.41 1.41M4.05 15.95l1.41-1.41M14.54 5.46l1.41-1.41" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
}

const LockIcon = () => (
  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
    <rect x="2" y="5.5" width="8" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M4 5.5V4a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

const SunIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8 1v1M8 14v1M1 8h1M14 8h1M3.05 3.05l.707.707M12.243 12.243l.707.707M3.05 12.95l.707-.707M12.243 3.757l.707-.707" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M13.5 9A6 6 0 017 2.5a6 6 0 100 11A6 6 0 0113.5 9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
)

// ── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'overview',  label: 'Overview',  gatedBy: null       },
  { id: 'checklist', label: 'Checklist', gatedBy: null       },
  { id: 'budget',    label: 'Budget',    gatedBy: null       },
  { id: 'guests',    label: 'Guests',    gatedBy: null       },
  { id: 'seating',   label: 'Seating',   gatedBy: 'seating'  },
  { id: 'vendors',   label: 'Vendors',   gatedBy: 'vendors'  },
  { id: 'timeline',  label: 'Timeline',  gatedBy: 'timeline' },
  { id: 'export',    label: 'Export',    gatedBy: 'export'   },
]

const TIER_COLORS = {
  free:    '#4A4540',
  couple:  '#4A6B58',
  premium: '#A0813A',
}

// ── Component ────────────────────────────────────────────────────────────────

const MOBILE_NAV_ITEMS = [
  { id: 'overview',  label: 'Overview',  gatedBy: null      },
  { id: 'checklist', label: 'Tasks',     gatedBy: null      },
  { id: 'budget',    label: 'Budget',    gatedBy: null      },
  { id: 'guests',    label: 'Guests',    gatedBy: null      },
  { id: 'vendors',   label: 'Vendors',   gatedBy: 'vendors' },
]

export default function Navigation({ currentView, onNavigate }) {
  const { state, dispatch } = useApp()
  const { wedding, subscription } = state
  const limits = LIMITS[subscription]

  return (
    <>
      {/* ── Desktop: always-dark sidebar ─────────────────────────── */}
      <aside
        style={{ backgroundColor: '#1C1A17' }}
        className="hidden sm:flex flex-col w-[210px] shrink-0 sticky top-0 h-dvh
                   border-r border-[#2A2723]"
        aria-label="Main navigation"
      >
        {/* Brand mark */}
        <div className="px-6 pt-8 pb-5">
          <span
            className="block font-display italic font-light leading-none select-none"
            style={{
              fontSize: '3.25rem',
              letterSpacing: '-0.02em',
              color: '#F0EBE1',
            }}
          >
            Vow
          </span>
          <span
            className="block mt-2.5 text-[10px] uppercase font-medium tracking-[0.16em]"
            style={{ color: '#5A5550' }}
          >
            {wedding.coupleNames}
          </span>
        </div>

        {/* Divider */}
        <div className="mx-6 mb-3" style={{ height: 1, backgroundColor: '#2A2723' }} />

        {/* Nav items */}
        <nav className="flex-1 px-3 py-1 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, gatedBy }) => {
            const active = currentView === id
            const locked = gatedBy !== null && !limits[gatedBy]

            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                aria-current={active ? 'page' : undefined}
                style={{
                  borderLeftColor: active ? '#4A6B58' : 'transparent',
                  color: active
                    ? '#F0EBE1'
                    : locked
                      ? '#3A3630'
                      : '#7A7268',
                  backgroundColor: active ? 'rgba(74,107,88,0.12)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!active && !locked) {
                    e.currentTarget.style.backgroundColor = '#252220'
                    e.currentTarget.style.color = '#C8C2B8'
                  }
                }}
                onMouseLeave={e => {
                  if (!active && !locked) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#7A7268'
                  }
                }}
                className="group flex items-center gap-[9px] w-full
                           pl-3 pr-2 py-[8px] text-[13px] text-left
                           transition-colors duration-150 rounded-[4px]
                           border-l-2"
              >
                <span
                  className="shrink-0 transition-opacity duration-150"
                  style={{ opacity: active ? 1 : locked ? 0.25 : 0.55 }}
                >
                  {ICONS[id]}
                </span>
                <span className="flex-1">{label}</span>
                {locked && (
                  <span style={{ opacity: 0.3 }}>
                    <LockIcon />
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-5 pb-6 pt-4 space-y-3"
          style={{ borderTop: '1px solid #2A2723' }}
        >
          {/* Tier indicator */}
          <div className="flex items-center gap-2">
            <span
              className="w-[5px] h-[5px] rounded-full shrink-0"
              style={{ backgroundColor: TIER_COLORS[subscription] }}
            />
            <span
              className="text-[10.5px] uppercase tracking-[0.1em]"
              style={{ color: '#4A4540' }}
            >
              {TIER_LABELS[subscription]} plan
            </span>
          </div>

          {/* Settings link */}
          <button
            onClick={() => onNavigate('settings')}
            aria-current={currentView === 'settings' ? 'page' : undefined}
            className="flex items-center gap-2 w-full text-[12px]
                       transition-colors duration-150"
            style={{ color: currentView === 'settings' ? '#8A8278' : '#4A4540' }}
            onMouseEnter={e => e.currentTarget.style.color = '#8A8278'}
            onMouseLeave={e => e.currentTarget.style.color = currentView === 'settings' ? '#8A8278' : '#4A4540'}
          >
            {ICONS.settings}
            <span>Settings</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK' })}
            aria-label="Toggle theme"
            className="flex items-center gap-2 w-full text-[12px]
                       transition-colors duration-150"
            style={{ color: '#4A4540' }}
            onMouseEnter={e => e.currentTarget.style.color = '#8A8278'}
            onMouseLeave={e => e.currentTarget.style.color = '#4A4540'}
          >
            {state.darkMode ? <SunIcon /> : <MoonIcon />}
            <span>{state.darkMode ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile: bottom tab bar ────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 sm:hidden z-30
                   bg-[#F7F5F1]/96 dark:bg-[#1C1A17]/96
                   border-t border-stone-200/50 dark:border-[#2A2723]
                   backdrop-blur-sm safe-area-bottom"
        aria-label="Main navigation"
        style={{ height: 64 }}
      >
        <div className="flex h-full">
          {MOBILE_NAV_ITEMS.map(({ id, label, gatedBy }) => {
            const active = currentView === id
            const locked = gatedBy !== null && !limits[gatedBy]
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                aria-current={active ? 'page' : undefined}
                aria-label={label}
                className={`
                  relative flex flex-col items-center justify-center flex-1 gap-[4px]
                  transition-colors duration-150
                  ${active
                    ? 'text-accent dark:text-accent-dark'
                    : locked
                      ? 'text-stone-300 dark:text-stone-700'
                      : 'text-stone-400 dark:text-stone-500'
                  }
                `}
              >
                <span style={{ fontSize: 22 }}>{ICONS[id]}</span>
                <span className="text-[9px] tracking-[0.08em] uppercase font-medium">{label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
