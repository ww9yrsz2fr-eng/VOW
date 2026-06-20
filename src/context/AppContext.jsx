import { createContext, useContext, useReducer, useEffect } from 'react'
import { wedding, budgetItems, guests, tasks, tables, vendors, timelineEvents } from '../data/mockData'

const AppContext = createContext(null)

// ── Persistence ───────────────────────────────────────────────────────────────
const DATA_KEY = 'vow_data'

const mockDefaults = { wedding, budgetItems, guests, tasks, tables, vendors, timelineEvents }

function loadState() {
  try {
    const saved = localStorage.getItem(DATA_KEY)
    if (saved) return JSON.parse(saved)
  } catch (_) {}
  return mockDefaults
}

const persisted = loadState()

const initialState = {
  ...persisted,
  darkMode: localStorage.getItem('theme') === 'dark',
  // 'free' | 'couple' | 'premium'
  // In production: set this from your payment provider (Stripe, etc.)
  subscription: localStorage.getItem('vow_subscription') || 'free',
}

function reducer(state, action) {
  switch (action.type) {

    case 'UPDATE_WEDDING':
      return { ...state, wedding: { ...state.wedding, ...action.payload } }

    case 'TOGGLE_DARK':
      return { ...state, darkMode: !state.darkMode }

    case 'SET_SUBSCRIPTION':
      return { ...state, subscription: action.payload }

    case 'RESET_DATA':
      return {
        ...state,
        wedding:        { coupleNames: '', date: '', venue: '', city: '' },
        budgetItems:    [],
        guests:         [],
        tasks:          [],
        tables:         [],
        vendors:        [],
        timelineEvents: [],
      }

    // ── Tasks ─────────────────────────────────────────────────────
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }
    case 'TOGGLE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload ? { ...t, done: !t.done } : t) }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) }
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t) }

    // ── Budget ────────────────────────────────────────────────────
    case 'ADD_BUDGET_ITEM':
      return { ...state, budgetItems: [...state.budgetItems, action.payload] }
    case 'UPDATE_BUDGET_ITEM':
      return { ...state, budgetItems: state.budgetItems.map(b => b.id === action.payload.id ? { ...b, ...action.payload } : b) }
    case 'DELETE_BUDGET_ITEM':
      return { ...state, budgetItems: state.budgetItems.filter(b => b.id !== action.payload) }

    // ── Guests ────────────────────────────────────────────────────
    case 'ADD_GUEST':
      return { ...state, guests: [...state.guests, action.payload] }
    case 'UPDATE_GUEST':
      return { ...state, guests: state.guests.map(g => g.id === action.payload.id ? { ...g, ...action.payload } : g) }
    case 'DELETE_GUEST':
      return {
        ...state,
        guests: state.guests.filter(g => g.id !== action.payload),
        tables: state.tables.map(t => ({ ...t, guestIds: (t.guestIds || []).filter(id => id !== action.payload) })),
      }

    // ── Tables ────────────────────────────────────────────────────
    case 'ADD_TABLE':
      return { ...state, tables: [...state.tables, action.payload] }
    case 'UPDATE_TABLE':
      return { ...state, tables: state.tables.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t) }
    case 'DELETE_TABLE':
      return {
        ...state,
        tables: state.tables.filter(t => t.id !== action.payload),
        guests: state.guests.map(g => g.tableId === action.payload ? { ...g, tableId: null } : g),
      }
    case 'ASSIGN_GUEST_TO_TABLE':
      return { ...state, guests: state.guests.map(g => g.id === action.payload.guestId ? { ...g, tableId: action.payload.tableId } : g) }
    case 'UNASSIGN_GUEST':
      return { ...state, guests: state.guests.map(g => g.id === action.payload ? { ...g, tableId: null } : g) }

    // ── Vendors ───────────────────────────────────────────────────
    case 'ADD_VENDOR':
      return { ...state, vendors: [...state.vendors, action.payload] }
    case 'UPDATE_VENDOR':
      return { ...state, vendors: state.vendors.map(v => v.id === action.payload.id ? { ...v, ...action.payload } : v) }
    case 'DELETE_VENDOR':
      return { ...state, vendors: state.vendors.filter(v => v.id !== action.payload) }

    // ── Timeline Events ───────────────────────────────────────────
    case 'ADD_TIMELINE_EVENT':
      return { ...state, timelineEvents: [...state.timelineEvents, action.payload].sort((a, b) => a.time.localeCompare(b.time)) }
    case 'UPDATE_TIMELINE_EVENT':
      return {
        ...state,
        timelineEvents: state.timelineEvents
          .map(e => e.id === action.payload.id ? { ...e, ...action.payload } : e)
          .sort((a, b) => a.time.localeCompare(b.time)),
      }
    case 'DELETE_TIMELINE_EVENT':
      return { ...state, timelineEvents: state.timelineEvents.filter(e => e.id !== action.payload) }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Persist dark mode preference
  useEffect(() => {
    const root = document.documentElement
    if (state.darkMode) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [state.darkMode])

  // Persist subscription tier
  useEffect(() => {
    localStorage.setItem('vow_subscription', state.subscription)
  }, [state.subscription])

  // Persist all wedding data
  useEffect(() => {
    const { darkMode, subscription, ...data } = state
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(data))
    } catch (_) {}
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
