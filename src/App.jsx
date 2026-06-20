import { useRef } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'
import Navigation from './components/layout/Navigation'
import Overview from './components/overview/Overview'
import ChecklistView from './components/checklist/ChecklistView'
import BudgetView from './components/budget/BudgetView'
import GuestsView from './components/guests/GuestsView'
import SeatingView from './components/seating/SeatingView'
import VendorsView from './components/vendors/VendorsView'
import TimelineView from './components/timeline/TimelineView'
import ExportView from './components/export/ExportView'
import SettingsView from './components/settings/SettingsView'
import SetupView from './components/setup/SetupView'
import { useState } from 'react'
import TierToggle from './components/dev/TierToggle'

const views = {
  overview:  Overview,
  checklist: ChecklistView,
  budget:    BudgetView,
  guests:    GuestsView,
  seating:   SeatingView,
  vendors:   VendorsView,
  timeline:  TimelineView,
  export:    ExportView,
  settings:  SettingsView,
}

const NAV_ORDER = ['overview', 'checklist', 'budget', 'guests', 'seating', 'vendors', 'timeline', 'export', 'settings']

function getVariants(direction) {
  return {
    initial: { opacity: 0, x: direction * 20 },
    enter:   { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: direction * -20 },
  }
}

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 1v1M8 14v1M1 8h1M14 8h1M3.05 3.05l.707.707M12.243 12.243l.707.707M3.05 12.95l.707-.707M12.243 3.757l.707-.707" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M13.5 9A6 6 0 017 2.5a6 6 0 100 11A6 6 0 0113.5 9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
)

function MobileTopBar() {
  const { state, dispatch } = useApp()
  return (
    <header className="sm:hidden sticky top-0 z-20 flex items-center justify-between
                       px-5 h-[50px] shrink-0
                       bg-[#EFECE7]/95 dark:bg-[#1A1815]/95 backdrop-blur-sm
                       border-b border-stone-200/60 dark:border-stone-800/40">
      <span className="font-display italic font-light text-[1.75rem] leading-none tracking-[-0.02em]
                       text-stone-900 dark:text-stone-100">
        Vow
      </span>
      <button
        onClick={() => dispatch({ type: 'TOGGLE_DARK' })}
        aria-label={state.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        className="w-8 h-8 flex items-center justify-center rounded-[5px]
                   text-stone-400 dark:text-stone-500
                   hover:text-stone-700 dark:hover:text-stone-300
                   transition-colors duration-150"
      >
        {state.darkMode ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  )
}

function AppInner() {
  const { state } = useApp()
  const [currentView, setCurrentView] = useState('overview')
  const [setupDone, setSetupDone]     = useState(!!state.wedding.coupleNames)
  const directionRef = useRef(0)

  const navigate = (next) => {
    const from = NAV_ORDER.indexOf(currentView)
    const to   = NAV_ORDER.indexOf(next)
    directionRef.current = to > from ? 1 : -1
    setCurrentView(next)
  }

  // Show onboarding when no couple name has been set
  if (!setupDone) {
    return (
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait">
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SetupView onComplete={() => setSetupDone(true)} />
          </motion.div>
        </AnimatePresence>
      </MotionConfig>
    )
  }

  const CurrentView = views[currentView]
  const variants = getVariants(directionRef.current)

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-dvh w-full transition-colors duration-200">
        <Navigation currentView={currentView} onNavigate={navigate} />

        {/* DEV ONLY — remove before production */}
        <TierToggle />

        <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
          {/* Mobile-only top bar with brand + dark mode toggle */}
          <MobileTopBar />

          <main
            className="max-w-[660px] mx-auto w-full px-5 py-6 pb-28 sm:py-10 sm:pb-12"
            id="main-content"
            tabIndex={-1}
          >
            <AnimatePresence mode="wait" custom={directionRef.current}>
              <motion.div
                key={currentView}
                variants={variants}
                initial="initial"
                animate="enter"
                exit="exit"
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                <CurrentView onNavigate={navigate} />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </MotionConfig>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
