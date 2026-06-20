import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { LIMITS } from '../../context/SubscriptionConfig'
import SimpleProgress from '../ui/SimpleProgress'

const PHASES = [
  { id: '12+ months',  label: '12+ Months',  sublabel: 'Foundation' },
  { id: '6–12 months', label: '6–12 Months', sublabel: 'Key bookings' },
  { id: '3–6 months',  label: '3–6 Months',  sublabel: 'Details' },
  { id: '1–3 months',  label: '1–3 Months',  sublabel: 'Final prep' },
  { id: 'Final weeks', label: 'Final Weeks', sublabel: 'Last touches' },
]

const emptyForm = { task: '', phase: '3–6 months', dueDate: '' }

function formatDateShort(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M9.5 2l2.5 2.5-7 7H2.5V9L9.5 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
)

let taskCounter = 1000

export default function ChecklistView() {
  const { state, dispatch } = useApp()
  const { tasks, subscription } = state
  const canAddTasks = LIMITS[subscription].canAddChecklistTasks

  const [filterPhase, setFilterPhase]   = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAdd, setShowAdd]           = useState(false)
  const [editId, setEditId]             = useState(null)
  const [editTask, setEditTask]         = useState({})
  const [form, setForm]                 = useState(emptyForm)
  const [flashing, setFlashing]         = useState(new Set())

  const flashItem = useCallback((id) => {
    setFlashing(prev => new Set([...prev, id]))
    setTimeout(() => setFlashing(prev => {
      const next = new Set(prev); next.delete(id); return next
    }), 560)
  }, [])

  const done  = tasks.filter(t => t.done).length
  const total = tasks.length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  const filtered = tasks.filter(t => {
    if (filterPhase !== 'all' && t.phase !== filterPhase) return false
    if (filterStatus === 'pending' && t.done) return false
    if (filterStatus === 'done'    && !t.done) return false
    return true
  })

  const grouped = PHASES.map(p => ({
    ...p,
    tasks: filtered.filter(t => t.phase === p.id),
  })).filter(p => p.tasks.length > 0)

  function handleToggle(id) {
    const task = tasks.find(t => t.id === id)
    if (task && !task.done) flashItem(id) // only flash when completing, not un-completing
    dispatch({ type: 'TOGGLE_TASK', payload: id })
  }

  function handleDelete(id) {
    dispatch({ type: 'DELETE_TASK', payload: id })
    if (editId === id) setEditId(null)
  }

  function startEdit(task) {
    setEditId(task.id)
    setEditTask({ task: task.task, dueDate: task.dueDate || '', phase: task.phase })
  }

  function saveEdit(id) {
    dispatch({ type: 'UPDATE_TASK', payload: { id, task: editTask.task, dueDate: editTask.dueDate || null, phase: editTask.phase } })
    setEditId(null)
  }

  function addTask() {
    if (!form.task.trim()) return
    dispatch({
      type: 'ADD_TASK',
      payload: {
        id: `c${++taskCounter}`,
        task: form.task.trim(),
        phase: form.phase,
        done: false,
        dueDate: form.dueDate || null,
      },
    })
    setForm(emptyForm)
    setShowAdd(false)
  }

  return (
    <div className="pb-4">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mb-7 pt-5 pb-6 border-b border-stone-200/60 dark:border-stone-800/40">
        <h1 className="view-title">Checklist</h1>
        <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1 tracking-[0.03em]">
          {done} done · {total - done} remaining
        </p>

        {/* Overall progress */}
        {total > 0 && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-[0.1em] text-stone-400 dark:text-stone-500">
                Progress
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 tabular-nums">
                {pct}%
              </span>
            </div>
            <SimpleProgress pct={pct} height={22} />
          </div>
        )}
      </div>

      {/* ── Filters ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5 mb-7">
        <div className="flex flex-wrap gap-[6px]">
          <button
            className={`filter-pill ${filterPhase === 'all' ? 'active' : ''}`}
            onClick={() => setFilterPhase('all')}
          >
            All phases
          </button>
          {PHASES.map(p => (
            <button
              key={p.id}
              className={`filter-pill ${filterPhase === p.id ? 'active' : ''}`}
              onClick={() => setFilterPhase(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-[6px]">
          {[['all', 'All'], ['pending', 'Pending'], ['done', 'Done']].map(([val, label]) => (
            <button
              key={val}
              className={`filter-pill ${filterStatus === val ? 'active' : ''}`}
              onClick={() => setFilterStatus(val)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Add task form / CTA ───────────────────────────────── */}
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
              New task
            </h3>
            <div className="flex flex-col gap-[10px]">
              <input
                className="aisle-input"
                value={form.task}
                onChange={e => setForm(p => ({ ...p, task: e.target.value }))}
                placeholder="Task title"
                autoFocus
                onKeyDown={e => e.key === 'Enter' && addTask()}
              />
              <div className="flex gap-2">
                <select
                  className="aisle-input flex-1"
                  value={form.phase}
                  onChange={e => setForm(p => ({ ...p, phase: e.target.value }))}
                >
                  {PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
                <input
                  className="aisle-input flex-1"
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                />
              </div>
              <div className="flex gap-2 flex-wrap mt-1">
                <button className="inline-btn-primary" onClick={addTask}>Add task</button>
                <button className="inline-btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </div>
          </motion.div>
        ) : canAddTasks ? (
          <button className="add-row-btn mb-6" onClick={() => setShowAdd(true)}>
            <PlusIcon />
            Add task
          </button>
        ) : (
          <div className="mb-6 flex items-center gap-2 text-[13px] text-stone-400 dark:text-stone-500
                          border border-stone-200/60 dark:border-stone-700/40 rounded-lg px-4 py-3">
            <span>Custom tasks require the Couple plan.</span>
            <span
              className="ml-auto text-accent dark:text-accent-dark cursor-pointer font-medium"
              onClick={() => dispatch({ type: 'SET_SUBSCRIPTION', payload: 'couple' })}
            >
              Upgrade →
            </span>
          </div>
        )}
      </AnimatePresence>

      {/* ── Empty state ────────────────────────────────────────── */}
      {grouped.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-display italic font-light text-[1.75rem] leading-none tracking-[-0.01em]
                         text-stone-300 dark:text-stone-700">
            No tasks found
          </p>
          <p className="text-[12.5px] text-stone-400 dark:text-stone-500 mt-3">
            Adjust your filters or add a task here.
          </p>
        </div>
      )}

      {/* ── Phase groups ───────────────────────────────────────── */}
      {grouped.map(phase => {
        const totalInPhase = tasks.filter(t => t.phase === phase.id).length
        const doneInPhase  = tasks.filter(t => t.phase === phase.id && t.done).length

        return (
          <div key={phase.id} className="mb-8">
            {/* Phase header */}
            <div className="flex items-baseline justify-between mb-0 pb-3
                            border-b border-stone-200/80 dark:border-stone-800/50">
              <div className="flex items-baseline gap-2.5">
                <span className="font-display italic font-light text-[1.2rem] leading-none tracking-[-0.01em]
                                 text-stone-800 dark:text-stone-200">
                  {phase.label}
                </span>
                <span className="eyebrow" style={{ letterSpacing: '0.14em' }}>{phase.sublabel}</span>
              </div>
              <span className="text-[11.5px] text-stone-400 dark:text-stone-500 tabular-nums">
                {doneInPhase}/{totalInPhase}
              </span>
            </div>

            {/* Tasks */}
            <div>
              {phase.tasks.map(task => (
                <div
                  key={task.id}
                  className="border-b border-stone-200/40 dark:border-stone-800/40 last:border-b-0"
                >
                  {editId === task.id ? (
                    <div className="flex flex-col gap-[10px] py-3">
                      <input
                        className="aisle-input"
                        value={editTask.task}
                        onChange={e => setEditTask(p => ({ ...p, task: e.target.value }))}
                        placeholder="Task title"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <input
                          className="aisle-input flex-1"
                          type="date"
                          value={editTask.dueDate}
                          onChange={e => setEditTask(p => ({ ...p, dueDate: e.target.value }))}
                        />
                        <select
                          className="aisle-input flex-1"
                          value={editTask.phase}
                          onChange={e => setEditTask(p => ({ ...p, phase: e.target.value }))}
                        >
                          {PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                        </select>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button className="inline-btn-primary inline-btn-sm" onClick={() => saveEdit(task.id)}>Save</button>
                        <button className="inline-btn-ghost inline-btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                        <button className="inline-btn-danger inline-btn-sm" onClick={() => handleDelete(task.id)}>Delete</button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex items-start gap-3 py-3
                                 hover:bg-stone-50 dark:hover:bg-stone-900/20
                                 -mx-5 px-5 transition-colors duration-100 group"
                    >
                      {/* Check button */}
                      <button
                        onClick={() => handleToggle(task.id)}
                        aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
                        className={`w-[16px] h-[16px] rounded-[3px] border flex items-center justify-center
                                    shrink-0 mt-[3px] transition-colors duration-200
                                    ${flashing.has(task.id)
                                      ? 'coral-pop text-white border-[#FF5A5F]'
                                      : task.done
                                        ? 'bg-accent dark:bg-accent-dark border-accent dark:border-accent-dark text-white'
                                        : 'border-stone-300 dark:border-stone-600 hover:border-accent dark:hover:border-accent-dark'
                                    }`}
                        style={{ minWidth: 16 }}
                      >
                        {(task.done || flashing.has(task.id)) && <CheckIcon />}
                      </button>

                      {/* Task body */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13.5px] leading-[1.45] ${
                          task.done
                            ? 'line-through text-stone-400 dark:text-stone-600'
                            : 'text-stone-800 dark:text-stone-200'
                        }`}>
                          {task.task}
                        </p>
                        {task.dueDate && (() => {
                          const today = new Date(); today.setHours(0,0,0,0)
                          const due = new Date(task.dueDate)
                          const daysLeft = Math.ceil((due - today) / 86400000)
                          const overdue = !task.done && daysLeft < 0
                          const urgent  = !task.done && daysLeft >= 0 && daysLeft <= 7
                          return (
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className={`text-[11.5px] tabular-nums ${
                                overdue ? 'text-[#FF5A5F]'
                                : urgent ? 'text-[#FF5A5F]'
                                : 'text-stone-400 dark:text-stone-500'
                              }`}>
                                {overdue
                                  ? `${Math.abs(daysLeft)}d overdue`
                                  : `Due ${formatDateShort(task.dueDate)}`}
                              </p>
                              {(overdue || urgent) && (
                                <span className="text-[9px] uppercase tracking-[0.08em] px-[7px] py-[2px]"
                                      style={{ background: 'rgba(255,90,95,0.1)', color: '#FF5A5F' }}>
                                  Urgent
                                </span>
                              )}
                            </div>
                          )
                        })()}
                      </div>

                      {/* Edit button — visible on hover */}
                      <button
                        onClick={() => startEdit(task)}
                        aria-label="Edit task"
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
          </div>
        )
      })}

    </div>
  )
}
