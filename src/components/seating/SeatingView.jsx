import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import FeatureGate from '../ui/FeatureGate'

const fadeList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const fadeItem = {
  hidden: { opacity: 0, y: 6 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0, 0.15, 1] } },
}

// ── Seat Dots — keep this excellent UX ───────────────────────────────────────
function SeatDots({ capacity, occupied }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: Math.min(capacity, 20) }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
            i < occupied
              ? 'bg-accent dark:bg-accent-dark'
              : 'border border-stone-300 dark:border-stone-600'
          }`}
        />
      ))}
      {capacity > 20 && (
        <span className="text-[10px] text-stone-400 self-center">+{capacity - 20}</span>
      )}
    </div>
  )
}

// ── Inline table form ─────────────────────────────────────────────────────────
function TableForm({ initial, onSave, onCancel, onDelete, isEditing }) {
  const [name, setName]         = useState(initial?.name || '')
  const [capacity, setCapacity] = useState(initial?.capacity || 8)
  const [errors, setErrors]     = useState({})

  const handleSave = () => {
    const e = {}
    if (!name.trim()) e.name = 'Required'
    if (!capacity || capacity < 1) e.capacity = 'Min 1'
    if (Object.keys(e).length) { setErrors(e); return }
    onSave({ name: name.trim(), capacity: Number(capacity) })
  }

  const labelCls = 'block text-[10.5px] uppercase tracking-[0.12em] text-stone-400 dark:text-stone-600 mb-1.5'

  return (
    <div className="border-t border-stone-200/60 dark:border-stone-800/40 pt-5 pb-1 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>
            Table name {errors.name && <span className="text-[#B83A3A] normal-case tracking-normal ml-1">{errors.name}</span>}
          </label>
          <input className="aisle-input w-full" placeholder="e.g. The Rose Table"
            value={name} onChange={e => setName(e.target.value)} autoFocus />
        </div>
        <div>
          <label className={labelCls}>
            Seats {errors.capacity && <span className="text-[#B83A3A] normal-case tracking-normal ml-1">{errors.capacity}</span>}
          </label>
          <input className="aisle-input w-full" type="number" min="1" max="30" placeholder="8"
            value={capacity} onChange={e => setCapacity(e.target.value)} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          {isEditing && onDelete && (
            <button onClick={onDelete} className="inline-btn-danger">Delete table</button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onCancel}
            className="text-[12.5px] text-stone-400 dark:text-stone-600
                       hover:text-stone-600 dark:hover:text-stone-400 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave}
            className="inline-btn bg-stone-900 dark:bg-stone-100
                       text-stone-100 dark:text-stone-900
                       hover:bg-stone-700 dark:hover:bg-stone-300
                       transition-colors duration-150">
            {isEditing ? 'Save' : 'Add table'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Guest assign panel — inline dropdown below a card ────────────────────────
function AssignPanel({ table, unassigned, onAssign, onClose }) {
  return (
    <div className="mt-2 border border-stone-200/60 dark:border-stone-800/40 bg-stone-50/80 dark:bg-stone-900/60">
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <p className="text-[10.5px] uppercase tracking-[0.14em] text-stone-400 dark:text-stone-600">
          Assign to {table.name}
        </p>
        <button onClick={onClose} className="text-stone-300 dark:text-stone-700 hover:text-stone-500 transition-colors">
          <X size={12} />
        </button>
      </div>
      {unassigned.length === 0 ? (
        <p className="px-4 py-4 text-sm text-stone-400 dark:text-stone-600">All confirmed guests have been seated.</p>
      ) : (
        <div className="divide-y divide-stone-100 dark:divide-stone-800/60 max-h-48 overflow-y-auto">
          {unassigned.map(guest => (
            <button
              key={guest.id}
              onClick={() => onAssign(guest.id)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-left
                         hover:bg-stone-100/70 dark:hover:bg-stone-800/40 transition-colors group"
            >
              <div>
                <span className="text-[13px] text-stone-800 dark:text-stone-200">
                  {guest.firstName} {guest.lastName}
                </span>
                <span className="text-[11px] text-stone-400 dark:text-stone-600 capitalize ml-2">
                  {guest.side} · {guest.group}
                  {guest.dietary !== 'none' ? ` · ${guest.dietary}` : ''}
                </span>
              </div>
              <span className="text-[11px] text-accent dark:text-accent-dark opacity-0 group-hover:opacity-100 transition-opacity">
                Assign
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main view ─────────────────────────────────────────────────────────────────
export default function SeatingView() {
  const { state, dispatch } = useApp()
  const { tables, guests } = state

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTableId, setEditingTableId] = useState(null)
  const [assigningTableId, setAssigningTableId] = useState(null)

  const getTableGuests = (tableId) => guests.filter(g => g.tableId === tableId)
  const unassigned     = guests.filter(g => !g.tableId && g.rsvp !== 'declined')
  const confirmed      = guests.filter(g => g.rsvp === 'confirmed')

  const totalSeated    = guests.filter(g => g.tableId).length
  const totalCapacity  = tables.reduce((s, t) => s + t.capacity, 0)

  const allSeated = unassigned.length === 0 && tables.length > 0 && confirmed.length > 0

  const handleSaveNewTable = (payload) => {
    dispatch({ type: 'ADD_TABLE', payload: { id: `t${Date.now()}`, ...payload } })
    setShowAddForm(false)
  }

  const handleSaveEditTable = (id, payload) => {
    dispatch({ type: 'UPDATE_TABLE', payload: { id, ...payload } })
    setEditingTableId(null)
  }

  const handleDeleteTable = (id) => {
    dispatch({ type: 'DELETE_TABLE', payload: id })
    setEditingTableId(null)
  }

  const handleAssign = (guestId) => {
    dispatch({ type: 'ASSIGN_GUEST_TO_TABLE', payload: { guestId, tableId: assigningTableId } })
    setAssigningTableId(null)
  }

  const handleUnassign = (guestId) =>
    dispatch({ type: 'UNASSIGN_GUEST', payload: guestId })

  return (
    <FeatureGate minTier="couple" feature="Seating Chart">
    <div className="space-y-5 pb-4">

      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="view-title">Seating</h1>
          <p className="label-luxury mt-1">
            {tables.length} table{tables.length !== 1 ? 's' : ''} · {totalSeated} / {totalCapacity} seats filled
          </p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => { setShowAddForm(true); setEditingTableId(null) }}
            className="inline-btn bg-stone-900 dark:bg-stone-100
                       text-stone-100 dark:text-stone-900
                       hover:bg-stone-700 dark:hover:bg-stone-300
                       transition-colors duration-150 gap-1.5"
          >
            <Plus size={13} /> Table
          </button>
        )}
      </div>

      {/* Stat strip */}
      <div className="stat-strip grid-cols-4">
        {[
          { label: 'Tables',    value: tables.length },
          { label: 'Seated',    value: totalSeated },
          { label: 'Capacity',  value: totalCapacity },
          { label: 'Unplaced',  value: unassigned.length },
        ].map(({ label, value }) => (
          <div key={label} className="stat-cell">
            <p className="label-luxury mb-1">{label}</p>
            <p className="num-anchor text-[1.35rem] text-stone-900 dark:text-stone-100">{value}</p>
          </div>
        ))}
      </div>

      {/* Status banner */}
      {allSeated ? (
        <div className="flex items-center gap-2.5 py-3 border-t border-b border-accent/20 dark:border-accent-dark/20">
          <span className="w-1.5 h-1.5 rounded-full bg-accent dark:bg-accent-dark shrink-0" />
          <p className="text-xs text-accent dark:text-accent-dark">
            All confirmed guests are seated — seating plan complete.
          </p>
        </div>
      ) : unassigned.length > 0 && tables.length > 0 ? (
        <div className="flex items-center gap-2.5 py-3 border-t border-b border-stone-200/60 dark:border-stone-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          <p className="text-xs text-stone-500 dark:text-stone-400">
            <span className="font-medium text-stone-700 dark:text-stone-300">
              {unassigned.length} guest{unassigned.length !== 1 ? 's' : ''}
            </span>
            {' '}confirmed but not yet assigned to a table.
          </p>
        </div>
      ) : null}

      {/* Add table form */}
      {showAddForm && (
        <TableForm
          initial={null}
          onSave={handleSaveNewTable}
          onCancel={() => setShowAddForm(false)}
          isEditing={false}
        />
      )}

      {/* Tables grid */}
      {tables.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <p className="font-display italic text-[1.4rem] font-light text-stone-300 dark:text-stone-700">
            No tables yet
          </p>
          <p className="text-sm text-stone-400 dark:text-stone-600">
            Add your first table to start arranging the seating plan.
          </p>
          <button onClick={() => setShowAddForm(true)} className="add-row-btn justify-center">
            <Plus size={13} /> Add table
          </button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          variants={fadeList}
          initial="hidden"
          animate="show"
        >
          {tables.map(table => {
            const seated   = getTableGuests(table.id)
            const isFull   = seated.length >= table.capacity
            const isEmpty  = seated.length === 0
            const isEditing  = editingTableId === table.id
            const isAssigning = assigningTableId === table.id

            return (
              <motion.div key={table.id} variants={fadeItem} className="space-y-0">
                <div className={`border border-stone-200/50 dark:border-stone-700/40
                                bg-white dark:bg-stone-900
                                ${isFull ? 'border-accent/25 dark:border-accent-dark/20' : ''}
                                ${isEmpty ? 'border-dashed' : ''}`}>

                  {/* Full bar */}
                  {isFull && (
                    <div className="h-[2px] bg-accent dark:bg-accent-dark" />
                  )}

                  <div className="p-4">
                    {/* Table header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-display italic text-[1.15rem] font-light
                                       text-stone-900 dark:text-stone-100 leading-tight">
                          {table.name}
                        </h3>
                        <p className="label-luxury mt-0.5">
                          {seated.length} / {table.capacity} seats
                          {isFull && <span className="ml-1.5 text-accent dark:text-accent-dark">· Full</span>}
                          {isEmpty && <span className="ml-1.5 normal-case tracking-normal text-stone-400">· Empty</span>}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingTableId(isEditing ? null : table.id)
                          setAssigningTableId(null)
                        }}
                        aria-label={`Edit ${table.name}`}
                        className="text-stone-300 dark:text-stone-700
                                   hover:text-stone-500 dark:hover:text-stone-500
                                   transition-colors -mt-0.5 -mr-0.5 p-1"
                      >
                        <Pencil size={12} />
                      </button>
                    </div>

                    {/* Edit form inline */}
                    {isEditing ? (
                      <TableForm
                        initial={{ name: table.name, capacity: table.capacity }}
                        onSave={(payload) => handleSaveEditTable(table.id, payload)}
                        onCancel={() => setEditingTableId(null)}
                        onDelete={() => handleDeleteTable(table.id)}
                        isEditing={true}
                      />
                    ) : (
                      <>
                        {/* Seat dots */}
                        <div className="mb-3">
                          <SeatDots capacity={table.capacity} occupied={seated.length} />
                        </div>

                        {/* Seated guests */}
                        {seated.length > 0 && (
                          <div className="border-t border-stone-100 dark:border-stone-800/50 pt-2.5 space-y-1.5 mb-3">
                            {seated.map(g => (
                              <div key={g.id}
                                   className="flex items-center justify-between group/row">
                                <span className="text-[12.5px] text-stone-700 dark:text-stone-300">
                                  {g.firstName} {g.lastName}
                                  {g.dietary !== 'none' && (
                                    <span className="text-[10px] text-stone-400 dark:text-stone-500 ml-1.5 uppercase tracking-wide">
                                      · {g.dietary}
                                    </span>
                                  )}
                                </span>
                                <button
                                  onClick={() => handleUnassign(g.id)}
                                  className="opacity-0 group-hover/row:opacity-100
                                             text-stone-300 hover:text-[#B83A3A]
                                             dark:text-stone-700 dark:hover:text-[#E07070]
                                             transition-[color,opacity]"
                                  aria-label={`Remove ${g.firstName}`}
                                >
                                  <X size={11} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Assign CTA */}
                        {!isFull && (
                          <button
                            onClick={() => {
                              setAssigningTableId(isAssigning ? null : table.id)
                              setEditingTableId(null)
                            }}
                            className="text-[11px] uppercase tracking-[0.12em]
                                       text-accent dark:text-accent-dark
                                       hover:text-accent/70 dark:hover:text-accent-dark/70
                                       transition-colors"
                          >
                            + Assign guest
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Assign panel — slides in below card */}
                {isAssigning && !isEditing && (
                  <AssignPanel
                    table={table}
                    unassigned={unassigned}
                    onAssign={handleAssign}
                    onClose={() => setAssigningTableId(null)}
                  />
                )}
              </motion.div>
            )
          })}

        </motion.div>
      )}
    </div>
    </FeatureGate>
  )
}
