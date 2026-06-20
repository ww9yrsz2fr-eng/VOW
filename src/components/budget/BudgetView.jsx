import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { LIMITS } from '../../context/SubscriptionConfig'
import SimpleProgress from '../ui/SimpleProgress'

const CATEGORIES = [
  'Venue', 'Catering', 'Photography', 'Florals', 'Music',
  'Stationery', 'Cake', 'Attire', 'Hair & Makeup', 'Honeymoon', 'Other',
]

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M9.5 2l2.5 2.5-7 7H2.5V9L9.5 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
)

const ChevronIcon = ({ open }) => (
  <svg
    width="12" height="12" viewBox="0 0 12 12" fill="none"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}
  >
    <path d="M2.5 4.5l3.5 3 3.5-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const WarnIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M7 1L13 13H1L7 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M7 6v3M7 10.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

const emptyForm = { category: 'Venue', note: '', planned: '', actual: '', status: 'upcoming' }

export default function BudgetView() {
  const { state, dispatch } = useApp()
  const { budgetItems, wedding, subscription } = state
  const itemLimit = LIMITS[subscription].budgetItems
  const atLimit   = budgetItems.length >= itemLimit

  const [expandedCat, setExpandedCat] = useState({})
  const [editId,  setEditId]  = useState(null)
  const [editItem, setEditItem] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState(emptyForm)
  const [flashing, setFlashing] = useState(new Set())

  // Budget cap — edit inline in header
  const [editingBudget, setEditingBudget] = useState(false)
  const [budgetInput, setBudgetInput]     = useState('')

  const flashItem = useCallback((id) => {
    setFlashing(prev => new Set([...prev, id]))
    setTimeout(() => setFlashing(prev => {
      const next = new Set(prev); next.delete(id); return next
    }), 560)
  }, [])

  const totalPlanned = budgetItems.reduce((s, b) => s + (b.planned || 0), 0)
  const totalActual  = budgetItems.reduce((s, b) => s + (b.actual  || 0), 0)
  const totalPaid    = budgetItems.filter(b => b.status === 'paid').reduce((s, b) => s + (b.actual || 0), 0)
  const budgetCap    = wedding.budget || 0
  const remaining    = budgetCap > 0 ? budgetCap - totalActual : totalPlanned - totalActual
  const spentPct     = budgetCap > 0 ? Math.min(100, (totalActual / budgetCap) * 100) : 0

  const grouped = useMemo(() => {
    return CATEGORIES.map(cat => ({
      cat,
      items: budgetItems.filter(b => b.category === cat),
      planned: budgetItems.filter(b => b.category === cat).reduce((s, b) => s + (b.planned || 0), 0),
      actual:  budgetItems.filter(b => b.category === cat).reduce((s, b) => s + (b.actual  || 0), 0),
    })).filter(g => g.items.length > 0)
  }, [budgetItems])

  const overBudgetCats = grouped.filter(g => g.actual > g.planned && g.planned > 0).map(g => g.cat)
  const overTotalBudget = budgetCap > 0 && totalActual > budgetCap

  const paidPct   = totalPlanned > 0 ? Math.min(100, (totalPaid   / totalPlanned) * 100) : 0
  const actualPct = totalPlanned > 0 ? Math.min(100, (totalActual / totalPlanned) * 100) : 0

  function saveBudgetCap() {
    const val = parseFloat(budgetInput.replace(/[^0-9.]/g, '')) || 0
    dispatch({ type: 'UPDATE_WEDDING', payload: { budget: val } })
    setEditingBudget(false)
  }

  function togglePaid(item) {
    if (item.status !== 'paid') flashItem(item.id) // flash when marking paid, not unpaid
    dispatch({
      type: 'UPDATE_BUDGET_ITEM',
      payload: { id: item.id, status: item.status === 'paid' ? 'upcoming' : 'paid' },
    })
  }

  function startEdit(item) {
    setEditId(item.id)
    setEditItem({ ...item, planned: item.planned, actual: item.actual })
  }

  function saveEdit() {
    dispatch({
      type: 'UPDATE_BUDGET_ITEM',
      payload: {
        id: editId,
        category: editItem.category,
        note: editItem.note,
        planned: parseFloat(editItem.planned) || 0,
        actual:  parseFloat(editItem.actual)  || 0,
        status:  editItem.status,
      },
    })
    setEditId(null)
  }

  function deleteItem(id) {
    dispatch({ type: 'DELETE_BUDGET_ITEM', payload: id })
    if (editId === id) setEditId(null)
  }

  function addItem() {
    if (!newItem.note.trim() && !newItem.planned) return
    if (atLimit) return
    dispatch({
      type: 'ADD_BUDGET_ITEM',
      payload: {
        id: `b${Date.now()}`,
        category: newItem.category,
        note: newItem.note,
        planned: parseFloat(newItem.planned) || 0,
        actual:  parseFloat(newItem.actual)  || 0,
        status:  newItem.status,
      },
    })
    setNewItem(emptyForm)
    setShowAdd(false)
  }

  function toggleGroup(cat) {
    setExpandedCat(p => ({ ...p, [cat]: p[cat] === false ? true : false }))
  }

  return (
    <div className="pb-4">

      {/* ── Hero card ──────────────────────────────────────────── */}
      <div className="rounded-2xl px-5 py-6 mb-0" style={{ background: '#1C1917' }}>
        <p className="text-[10px] uppercase tracking-[0.18em] font-medium mb-2"
           style={{ color: 'rgba(247,245,241,0.4)' }}>
          Total budget
        </p>

        {/* Big number */}
        <div className="mb-4">
          <span className="font-display italic font-light leading-none tabular-nums"
                style={{ fontSize: 'clamp(3rem, 12vw, 4.5rem)', letterSpacing: '-0.02em', color: '#F7F5F1' }}>
            {fmt(budgetCap > 0 ? budgetCap : totalPlanned)}
          </span>
        </div>

        {/* Spent / Remaining row */}
        <div className="flex justify-between mb-4">
          <div>
            <div className="text-[13px] font-light" style={{ color: '#F7F5F1' }}>{fmt(totalActual)}</div>
            <div className="text-[9px] uppercase tracking-[0.12em] mt-0.5" style={{ color: 'rgba(247,245,241,0.4)' }}>Spent</div>
          </div>
          <div className="text-right">
            <div className="text-[13px] font-light" style={{ color: overTotalBudget ? '#FF5A5F' : '#F7F5F1' }}>
              {fmt(Math.abs(budgetCap > 0 ? budgetCap - totalActual : totalPlanned - totalActual))}
            </div>
            <div className="text-[9px] uppercase tracking-[0.12em] mt-0.5" style={{ color: 'rgba(247,245,241,0.4)' }}>
              {overTotalBudget ? 'Over' : 'Remaining'}
            </div>
          </div>
        </div>

        {/* Thin progress bar */}
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: 'rgba(247,245,241,0.4)' }}>Used</span>
            <span className="text-[10px] tabular-nums" style={{ color: 'rgba(247,245,241,0.55)' }}>{Math.round(spentPct)}%</span>
          </div>
          <SimpleProgress pct={Math.min(100, spentPct)} height={22} onDark ringBg="#1C1917" stroke={overTotalBudget ? '#FF5A5F' : undefined} />
        </div>

        {/* Edit budget cap */}
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {editingBudget ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: 'rgba(247,245,241,0.4)' }}>Budget cap</span>
              <input
                className="aisle-input flex-1 text-right"
                type="number"
                min="0"
                placeholder="0"
                value={budgetInput}
                onChange={e => setBudgetInput(e.target.value)}
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') saveBudgetCap(); if (e.key === 'Escape') setEditingBudget(false) }}
              />
              <button onClick={saveBudgetCap}
                className="text-[11px] text-accent-dark hover:opacity-70 transition-opacity">
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setBudgetInput(budgetCap || ''); setEditingBudget(true) }}
              className="flex items-center gap-1.5 text-[11px] transition-opacity hover:opacity-70"
              style={{ color: 'rgba(247,245,241,0.45)' }}
            >
              <EditIcon />
              {budgetCap > 0 ? `Edit budget cap` : 'Set budget cap'}
            </button>
          )}
        </div>
      </div>

      {/* ── Stat strip ─────────────────────────────────────────── */}
      <div className="stat-strip mb-6">
        <div className="stat-cell">
          <p className="label-luxury mb-3">Planned</p>
          <p className="font-display font-light text-[2rem] leading-none tracking-tight
                         text-stone-900 dark:text-stone-100 tabular-nums">
            {fmt(totalPlanned)}
          </p>
        </div>

        <div className="stat-cell">
          <p className="label-luxury mb-3">Spent</p>
          <p className="font-display font-light text-[2rem] leading-none tracking-tight
                         text-stone-900 dark:text-stone-100 tabular-nums">
            {fmt(totalActual)}
          </p>
        </div>

        <div className="stat-cell">
          <p className="label-luxury mb-3">Paid</p>
          <p className="font-display font-light text-[2rem] leading-none tracking-tight
                         text-accent dark:text-accent-dark tabular-nums">
            {fmt(totalPaid)}
          </p>
        </div>

        <div className="stat-cell">
          <p className="label-luxury mb-3">Remaining</p>
          <p className={`font-display font-light text-[2rem] leading-none tracking-tight tabular-nums
            ${remaining < 0 ? 'text-urgent dark:text-urgent-dark' : 'text-stone-900 dark:text-stone-100'}`}>
            {fmt(Math.abs(remaining))}
          </p>
          {remaining < 0 && (
            <p className="text-[11px] text-urgent dark:text-urgent-dark mt-1.5 uppercase tracking-[0.08em]">Over</p>
          )}
        </div>
      </div>

      {/* ── Payment split bar ──────────────────────────────────── */}
      {totalPlanned > 0 && (
        <div className="mb-6">
          <div className="relative mb-2" style={{ height: 5 }}>
            {/* Committed layer */}
            <SimpleProgress variant="bar" pct={actualPct} height={5} fillClass="bg-accent/30 dark:bg-accent-dark/30" animate={false} />
            {/* Paid layer on top */}
            <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
              <SimpleProgress variant="bar" pct={paidPct} height={5} trackClass="bg-transparent" animate={false} />
            </div>
          </div>
          <div className="flex gap-5 text-[11px] text-stone-400 dark:text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-[5px] h-[5px] rounded-full bg-accent dark:bg-accent-dark" />
              Paid — {fmt(totalPaid)}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-[5px] h-[5px] rounded-full bg-accent/30 dark:bg-accent-dark/30" />
              Committed — {fmt(totalActual - totalPaid)}
            </span>
          </div>
        </div>
      )}

      {/* ── Over budget alert ──────────────────────────────────── */}
      {overBudgetCats.length > 0 && (
        <div className="flex items-center gap-2.5 text-urgent dark:text-urgent-dark
                        border border-urgent/20 dark:border-urgent-dark/20
                        bg-urgent-light dark:bg-urgent/5
                        rounded-[6px] px-4 py-[10px] text-[12.5px] mb-5">
          <WarnIcon />
          Over planned in {overBudgetCats.join(', ')}
        </div>
      )}

      {/* ── Add expense form / CTA ────────────────────────────── */}
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
              New expense
            </h3>
            <div className="flex flex-col gap-[10px]">
              <select
                className="aisle-input"
                value={newItem.category}
                onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <input
                className="aisle-input"
                value={newItem.note}
                onChange={e => setNewItem(p => ({ ...p, note: e.target.value }))}
                placeholder="Description"
                autoFocus
              />
              <div className="flex gap-2">
                <input
                  className="aisle-input flex-1"
                  type="number"
                  value={newItem.planned}
                  onChange={e => setNewItem(p => ({ ...p, planned: e.target.value }))}
                  placeholder="Planned ($)"
                />
                <input
                  className="aisle-input flex-1"
                  type="number"
                  value={newItem.actual}
                  onChange={e => setNewItem(p => ({ ...p, actual: e.target.value }))}
                  placeholder="Actual ($)"
                />
              </div>
              <div className="flex gap-2 flex-wrap mt-1">
                <button className="inline-btn-primary" onClick={addItem}>Add expense</button>
                <button className="inline-btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </div>
          </motion.div>
        ) : atLimit ? (
          <div className="mb-6 flex items-center gap-2 text-[13px] text-stone-400 dark:text-stone-500
                          border border-stone-200/60 dark:border-stone-700/40 rounded-lg px-4 py-3">
            <span>
              {subscription === 'free'
                ? `Free plan: ${itemLimit} budget items max.`
                : `Budget item limit reached (${itemLimit}).`}
            </span>
            {subscription === 'free' && (
              <span
                className="ml-auto text-accent dark:text-accent-dark cursor-pointer font-medium text-[13px]"
                onClick={() => dispatch({ type: 'SET_SUBSCRIPTION', payload: 'couple' })}
              >
                Upgrade →
              </span>
            )}
          </div>
        ) : (
          <button className="add-row-btn mb-6" onClick={() => setShowAdd(true)}>
            <PlusIcon />
            Add expense
          </button>
        )}
      </AnimatePresence>

      {/* ── Category groups ────────────────────────────────────── */}
      <div className="flex flex-col">
        {grouped.map(({ cat, items, planned, actual }, idx) => {
          const isOpen = expandedCat[cat] !== false
          const over   = actual > planned && planned > 0

          return (
            <div
              key={cat}
              className={`border-b border-stone-200/60 dark:border-stone-800/40 ${
                idx === 0 ? 'border-t' : ''
              }`}
            >
              {/* Group header */}
              <button
                className="w-full py-4 text-left hover:bg-stone-50 dark:hover:bg-stone-900/30
                           transition-colors duration-150"
                onClick={() => toggleGroup(cat)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2.5">
                    <span className="text-[13px] text-stone-800 dark:text-stone-200 tracking-[0.005em]">
                      {cat}
                    </span>
                    {over && (
                      <span className="text-[9px] uppercase tracking-[0.08em] px-[6px] py-[2px]"
                            style={{ background: 'rgba(255,90,95,0.08)', color: '#FF5A5F' }}>
                        Over
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-2.5 text-[11.5px] text-stone-400 dark:text-stone-500">
                    <span className="tabular-nums">
                      <span className={over ? 'text-[#FF5A5F]' : 'text-stone-700 dark:text-stone-300'}>
                        {fmt(actual)}
                      </span>
                      <span className="text-stone-300 dark:text-stone-700"> / {fmt(planned)}</span>
                    </span>
                    <ChevronIcon open={isOpen} />
                  </span>
                </div>
                {/* Mini bar */}
                {planned > 0 && (
                  <div className="rounded-full overflow-hidden"
                       style={{ height: 3, background: 'rgba(0,0,0,0.06)' }}>
                    <div
                      className="h-full rounded-full transition-[width] duration-500"
                      style={{
                        width: `${Math.min(100, (actual / planned) * 100)}%`,
                        background: over ? '#FF5A5F' : '#4A6B58',
                      }}
                    />
                  </div>
                )}
              </button>

              {/* Group items */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-2">
                      {items.map(item => (
                        <div
                          key={item.id}
                          className="border-t border-stone-100 dark:border-stone-800/40 first:border-t-0"
                        >
                          {editId === item.id ? (
                            <div className="flex flex-col gap-[10px] py-3 pl-4">
                              <input
                                className="aisle-input"
                                value={editItem.note}
                                onChange={e => setEditItem(p => ({ ...p, note: e.target.value }))}
                                placeholder="Description"
                              />
                              <div className="flex gap-2">
                                <input
                                  className="aisle-input flex-1"
                                  type="number"
                                  value={editItem.planned}
                                  onChange={e => setEditItem(p => ({ ...p, planned: e.target.value }))}
                                  placeholder="Planned ($)"
                                />
                                <input
                                  className="aisle-input flex-1"
                                  type="number"
                                  value={editItem.actual}
                                  onChange={e => setEditItem(p => ({ ...p, actual: e.target.value }))}
                                  placeholder="Actual ($)"
                                />
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                <button className="inline-btn-primary inline-btn-sm" onClick={saveEdit}>Save</button>
                                <button className="inline-btn-ghost inline-btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                                <button className="inline-btn-danger inline-btn-sm" onClick={() => deleteItem(item.id)}>Delete</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 py-[9px] pl-4
                                            hover:bg-stone-50 dark:hover:bg-stone-900/20
                                            -mx-0 transition-colors duration-100 group">
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] text-stone-700 dark:text-stone-300 truncate">
                                  {item.note || item.category}
                                </p>
                                <div className="flex gap-3 mt-0.5">
                                  <span className="text-[11.5px] text-stone-400 dark:text-stone-500 tabular-nums">
                                    Planned {fmt(item.planned)}
                                  </span>
                                  {item.actual > 0 && (
                                    <span className={`text-[11.5px] font-medium tabular-nums ${
                                      item.actual > item.planned
                                        ? 'text-urgent dark:text-urgent-dark'
                                        : 'text-green dark:text-green-dark'
                                    }`}>
                                      Actual {fmt(item.actual)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => togglePaid(item)}
                                  className={`text-[11px] px-[9px] py-[3px] rounded-[4px] border
                                              transition-colors duration-200 cursor-pointer tracking-[0.03em] ${
                                    flashing.has(item.id)
                                      ? 'coral-pop bg-[#FF5A5F]/10 text-[#FF5A5F] border-[#FF5A5F]/40'
                                      : item.status === 'paid'
                                        ? 'bg-green/8 dark:bg-green-dark/10 text-green dark:text-green-dark border-green/20 dark:border-green-dark/20'
                                        : 'border-stone-200/80 dark:border-stone-700/50 text-stone-400 dark:text-stone-500 hover:border-green/40 dark:hover:border-green-dark/40 hover:text-green dark:hover:text-green-dark'
                                  }`}
                                >
                                  {flashing.has(item.id) ? 'Paid ✓' : item.status === 'paid' ? 'Paid ✓' : 'Unpaid'}
                                </button>
                                <button
                                  onClick={() => startEdit(item)}
                                  aria-label="Edit"
                                  className="text-stone-300 dark:text-stone-700
                                             opacity-0 group-hover:opacity-100
                                             hover:text-accent dark:hover:text-accent-dark
                                             p-1 rounded-[4px] transition-all duration-150"
                                >
                                  <EditIcon />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add item to this category */}
                      {atLimit ? (
                        <p className="text-[12px] text-stone-400 dark:text-stone-500 py-2 pl-4">
                          Limit reached.{' '}
                          <span
                            className="text-accent dark:text-accent-dark cursor-pointer"
                            onClick={() => dispatch({ type: 'SET_SUBSCRIPTION', payload: 'couple' })}
                          >
                            Upgrade →
                          </span>
                        </p>
                      ) : (
                        <button
                          className="text-[12px] text-stone-400 dark:text-stone-500 py-2 pl-4 w-full text-left
                                     hover:text-accent dark:hover:text-accent-dark transition-colors duration-150"
                          onClick={() => { setShowAdd(true); setNewItem(p => ({ ...p, category: cat })) }}
                        >
                          + Add item
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

    </div>
  )
}
