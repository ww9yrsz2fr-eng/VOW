import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { LIMITS } from '../../context/SubscriptionConfig'

const GROUPS = ['Wedding Party', 'Family', 'Friends', 'Colleagues', 'Other']

const emptyForm = {
  firstName: '', lastName: '', side: 'mutual', group: 'Friends',
  rsvp: 'pending', plusOne: false, plusOneName: '', dietary: 'none',
}

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M9.5 2l2.5 2.5-7 7H2.5V9L9.5 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

export default function GuestsView() {
  const { state, dispatch } = useApp()
  const { guests, subscription } = state
  const guestLimit = LIMITS[subscription].guests
  const atLimit    = guests.length >= guestLimit

  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId]   = useState(null)
  const [editGuest, setEditGuest] = useState({})
  const [form, setForm]       = useState(emptyForm)

  const confirmed = guests.filter(g => g.rsvp === 'confirmed').length
  const pending   = guests.filter(g => g.rsvp === 'pending').length
  const declined  = guests.filter(g => g.rsvp === 'declined').length

  const filtered = useMemo(() => {
    let list = guests
    if (filter !== 'all') list = list.filter(g => g.rsvp === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(g =>
        `${g.firstName} ${g.lastName}`.toLowerCase().includes(q) ||
        g.group.toLowerCase().includes(q)
      )
    }
    return list
  }, [guests, filter, search])

  // Group alphabetically by first letter of last name (fallback: first name)
  const grouped = useMemo(() => {
    const map = {}
    filtered.forEach(g => {
      const key = ((g.lastName || g.firstName || '?')[0] || '?').toUpperCase()
      if (!map[key]) map[key] = []
      map[key].push(g)
    })
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  function startEdit(g) {
    setEditId(g.id)
    setEditGuest({ ...g })
  }

  function saveEdit() {
    dispatch({ type: 'UPDATE_GUEST', payload: { id: editId, ...editGuest } })
    setEditId(null)
  }

  function deleteGuest(id) {
    dispatch({ type: 'DELETE_GUEST', payload: id })
    if (editId === id) setEditId(null)
  }

  function addGuest() {
    if (!form.firstName.trim()) return
    if (atLimit) return
    dispatch({
      type: 'ADD_GUEST',
      payload: { id: `g${Date.now()}`, tableId: null, ...form },
    })
    setForm(emptyForm)
    setShowAdd(false)
  }

  function initials(g) {
    return `${(g.firstName || '')[0] || ''}${(g.lastName || '')[0] || ''}`.toUpperCase()
  }

  const rsvpBadge = {
    confirmed: { bg: 'rgba(74,107,88,0.1)',  color: '#3D5A48', label: 'Going'    },
    pending:   { bg: 'rgba(156,149,137,0.12)', color: '#6B6560', label: 'Awaiting' },
    declined:  { bg: 'rgba(255,90,95,0.08)',  color: '#CC4448', label: 'Declined' },
  }

  return (
    <div className="pb-4">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mb-0 pt-5 pb-0">
        <h1 className="view-title">Guests</h1>
      </div>

      {/* ── RSVP stat strip ────────────────────────────────────── */}
      <div className="grid grid-cols-4 mt-3 mb-0 rounded-xl overflow-hidden
                      bg-stone-200/60 dark:bg-stone-800/30"
           style={{ gap: '1px' }}>
        {[
          { label: 'Total',    value: guests.length, cls: 'text-stone-900 dark:text-stone-100',  filter: 'all'       },
          { label: 'Going',    value: confirmed,     cls: 'text-[#4A6B58] dark:text-[#6A9B78]', filter: 'confirmed' },
          { label: 'Awaiting', value: pending,       cls: 'text-stone-400 dark:text-stone-500',  filter: 'pending'   },
          { label: 'Declined', value: declined,      cls: 'text-[#FF5A5F]',                      filter: 'declined'  },
        ].map(({ label, value, cls, filter: f }) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex flex-col items-center py-3 transition-all duration-150 ring-inset
              ${filter === f
                ? 'bg-accent/5 dark:bg-accent-dark/10 ring-1 ring-accent/20 dark:ring-accent-dark/25'
                : 'bg-[#F7F5F1] dark:bg-[#131110] hover:bg-stone-100 dark:hover:bg-stone-900/70 hover:ring-1 hover:ring-stone-300 dark:hover:ring-stone-700'}`}
          >
            <span className={`font-display font-light leading-none tabular-nums ${cls}`}
                  style={{ fontSize: '1.5rem' }}>
              {value}
            </span>
            <span className="text-[9px] uppercase tracking-[0.12em] text-stone-400 dark:text-stone-500 mt-1 font-medium">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* ── Search ─────────────────────────────────────────────── */}
      <div className="relative mb-4 mt-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 pointer-events-none">
          <SearchIcon />
        </span>
        <input
          className="aisle-input pl-[34px]"
          placeholder="Search guests…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search guests"
        />
      </div>

      {/* ── Add guest form / CTA ───────────────────────────────── */}
      <AnimatePresence>
        {showAdd ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border border-stone-200/60 dark:border-stone-800/40 rounded-lg p-5 mb-6"
          >
            <h3 className="font-display italic font-light text-[1.5rem] leading-none tracking-[-0.01em]
                           text-stone-900 dark:text-stone-100 mb-5">
              Add guest
            </h3>
            <div className="flex flex-col gap-[10px]">
              <div className="flex gap-2">
                <input className="aisle-input flex-1" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} placeholder="First name" autoFocus />
                <input className="aisle-input flex-1" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} placeholder="Last name" />
              </div>
              <div className="flex gap-2">
                <select className="aisle-input flex-1" value={form.side} onChange={e => setForm(p => ({ ...p, side: e.target.value }))}>
                  <option value="bride">Bride's side</option>
                  <option value="groom">Groom's side</option>
                  <option value="mutual">Mutual</option>
                </select>
                <select className="aisle-input flex-1" value={form.group} onChange={e => setForm(p => ({ ...p, group: e.target.value }))}>
                  {GROUPS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <select className="aisle-input flex-1" value={form.rsvp} onChange={e => setForm(p => ({ ...p, rsvp: e.target.value }))}>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="declined">Declined</option>
                </select>
                <input className="aisle-input flex-1" value={form.dietary === 'none' ? '' : form.dietary} onChange={e => setForm(p => ({ ...p, dietary: e.target.value || 'none' }))} placeholder="Dietary (optional)" />
              </div>
              <label className="flex items-center gap-2 text-[13px] text-stone-500 dark:text-stone-400 cursor-pointer">
                <input type="checkbox" checked={form.plusOne} onChange={e => setForm(p => ({ ...p, plusOne: e.target.checked }))} />
                Has plus-one
              </label>
              {form.plusOne && (
                <input className="aisle-input" value={form.plusOneName} onChange={e => setForm(p => ({ ...p, plusOneName: e.target.value }))} placeholder="Plus-one name (optional)" />
              )}
              <div className="flex gap-2 flex-wrap mt-1">
                <button className="inline-btn-primary" onClick={addGuest}>Add guest</button>
                <button className="inline-btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </div>
          </motion.div>
        ) : atLimit ? (
          <div className="mb-6 flex items-center gap-2 text-[13px] text-stone-400 dark:text-stone-500
                          border border-stone-200/60 dark:border-stone-700/40 rounded-lg px-4 py-3">
            <span>
              {subscription === 'free'
                ? `Free plan: ${guestLimit} guests max.`
                : `Guest limit reached (${guestLimit}).`}
            </span>
            {subscription === 'free' && (
              <span
                className="ml-auto text-accent dark:text-accent-dark cursor-pointer font-medium"
                onClick={() => dispatch({ type: 'SET_SUBSCRIPTION', payload: 'couple' })}
              >
                Upgrade →
              </span>
            )}
          </div>
        ) : (
          <button className="add-row-btn mb-6" onClick={() => setShowAdd(true)}>
            <PlusIcon />
            Add guest
          </button>
        )}
      </AnimatePresence>

      {/* ── Empty state ────────────────────────────────────────── */}
      {grouped.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-display italic font-light text-[1.75rem] leading-none tracking-[-0.01em]
                         text-stone-300 dark:text-stone-700">
            No guests found
          </p>
          <p className="text-[12.5px] text-stone-400 dark:text-stone-500 mt-3">
            Try a different filter or add guests here.
          </p>
        </div>
      )}

      {/* ── Guest groups ───────────────────────────────────────── */}
      {grouped.map(([group, members]) => (
        <div key={group} className="mb-2">
          {/* Alpha label */}
          <div className="pt-4 pb-2">
            <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500 font-medium">
              {group}
            </span>
          </div>

          {members.map(g => (
            <div key={g.id} className="border-b border-stone-200/40 dark:border-stone-800/40 last:border-b-0">
              {editId === g.id ? (
                <div className="flex flex-col gap-[10px] py-3">
                  <div className="flex gap-2">
                    <input className="aisle-input flex-1" value={editGuest.firstName} onChange={e => setEditGuest(p => ({ ...p, firstName: e.target.value }))} placeholder="First name" />
                    <input className="aisle-input flex-1" value={editGuest.lastName} onChange={e => setEditGuest(p => ({ ...p, lastName: e.target.value }))} placeholder="Last name" />
                  </div>
                  <div className="flex gap-2">
                    <select className="aisle-input flex-1" value={editGuest.side} onChange={e => setEditGuest(p => ({ ...p, side: e.target.value }))}>
                      <option value="bride">Bride's side</option>
                      <option value="groom">Groom's side</option>
                      <option value="mutual">Mutual</option>
                    </select>
                    <select className="aisle-input flex-1" value={editGuest.group} onChange={e => setEditGuest(p => ({ ...p, group: e.target.value }))}>
                      {GROUPS.map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <select className="aisle-input flex-1" value={editGuest.rsvp} onChange={e => setEditGuest(p => ({ ...p, rsvp: e.target.value }))}>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="declined">Declined</option>
                    </select>
                    <input className="aisle-input flex-1" value={editGuest.dietary === 'none' ? '' : editGuest.dietary} onChange={e => setEditGuest(p => ({ ...p, dietary: e.target.value || 'none' }))} placeholder="Dietary requirements" />
                  </div>
                  <label className="flex items-center gap-2 text-[13px] text-stone-500 dark:text-stone-400 cursor-pointer">
                    <input type="checkbox" checked={editGuest.plusOne} onChange={e => setEditGuest(p => ({ ...p, plusOne: e.target.checked }))} />
                    Has plus-one
                  </label>
                  {editGuest.plusOne && (
                    <input className="aisle-input" value={editGuest.plusOneName} onChange={e => setEditGuest(p => ({ ...p, plusOneName: e.target.value }))} placeholder="Plus-one name (optional)" />
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <button className="inline-btn-primary inline-btn-sm" onClick={saveEdit}>Save</button>
                    <button className="inline-btn-ghost inline-btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                    <button className="inline-btn-danger inline-btn-sm" onClick={() => deleteGuest(g.id)}>Remove</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 py-[10px]
                                hover:bg-stone-50 dark:hover:bg-stone-900/20
                                -mx-5 px-5 transition-colors duration-100 group">
                  {/* Initials avatar */}
                  <div className="w-[32px] h-[32px] rounded-[5px]
                                  bg-stone-200/70 dark:bg-stone-800/70
                                  text-stone-500 dark:text-stone-400
                                  text-[11px] font-medium tracking-[0.03em]
                                  flex items-center justify-center shrink-0 select-none">
                    {initials(g)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      {g.firstName} {g.lastName}
                      {g.plusOne && (
                        <span className="text-[9.5px] px-[5px] py-[1px]
                                         border border-stone-300/60 dark:border-stone-700/60
                                         text-stone-400 dark:text-stone-500 rounded-[3px]
                                         tracking-[0.04em] uppercase">
                          +1
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-stone-400 dark:text-stone-500">
                        {g.side === 'bride' ? "Bride's" : g.side === 'groom' ? "Groom's" : 'Mutual'}
                      </span>
                      {g.dietary && g.dietary !== 'none' && (
                        <>
                          <span className="w-px h-3 bg-stone-200 dark:bg-stone-700" />
                          <span className="text-[11px] text-stone-400 dark:text-stone-500">
                            {g.dietary}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* RSVP badge */}
                  {(() => {
                    const b = rsvpBadge[g.rsvp] || rsvpBadge.pending
                    return (
                      <span className="text-[9px] uppercase tracking-[0.08em] px-2 py-[3px] shrink-0 font-medium"
                            style={{ background: b.bg, color: b.color }}>
                        {b.label}
                      </span>
                    )
                  })()}

                  {/* Edit */}
                  <button
                    onClick={() => startEdit(g)}
                    aria-label="Edit guest"
                    className="text-stone-300 dark:text-stone-700
                               opacity-0 group-hover:opacity-100
                               hover:text-accent dark:hover:text-accent-dark
                               p-[4px] rounded-[4px] transition-all duration-150 shrink-0"
                  >
                    <EditIcon />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

    </div>
  )
}
