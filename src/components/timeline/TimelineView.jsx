import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Clock, MapPin, Pencil } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import FeatureGate from '../ui/FeatureGate'

const fadeList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}
const fadeItem = {
  hidden: { opacity: 0, x: -6 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.38, ease: [0.25, 0, 0.15, 1] } },
}

const TYPE_OPTIONS = [
  { value: 'prep',      label: 'Preparation' },
  { value: 'photo',     label: 'Photography' },
  { value: 'ceremony',  label: 'Ceremony' },
  { value: 'reception', label: 'Reception' },
  { value: 'other',     label: 'Other' },
]

// Dot color per event type — editorial palette
const TYPE_DOT = {
  prep:      'bg-amber-400',
  photo:     'bg-blue-400',
  ceremony:  'bg-accent dark:bg-accent-dark',
  reception: 'bg-stone-500 dark:bg-stone-400',
  other:     'bg-stone-300 dark:bg-stone-600',
}

const TYPE_LABEL_COLOR = {
  prep:      'text-amber-600 dark:text-amber-500',
  photo:     'text-blue-500 dark:text-blue-400',
  ceremony:  'text-accent dark:text-accent-dark',
  reception: 'text-stone-500 dark:text-stone-400',
  other:     'text-stone-400 dark:text-stone-500',
}

const emptyForm = { time: '09:00', duration: 60, name: '', location: '', type: 'ceremony', notes: '' }

function formatDuration(mins) {
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function addMinutes(timeStr, mins) {
  const [h, m] = timeStr.split(':').map(Number)
  const total = h * 60 + m + mins
  const nh = Math.floor(total / 60) % 24
  const nm = total % 60
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`
}

// Inline form for add/edit
function EventForm({ initial, onSave, onCancel, onDelete, isEditing }) {
  const [form, setForm]   = useState(initial)
  const [errors, setErrors] = useState({})
  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.time)        e.time = 'Required'
    if (!form.duration || isNaN(Number(form.duration)) || Number(form.duration) < 1)
      e.duration = 'Enter minutes (min 1)'
    return e
  }

  const handleSave = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave({
      time: form.time,
      duration: Number(form.duration),
      name: form.name.trim(),
      location: form.location.trim(),
      type: form.type,
      notes: form.notes.trim(),
    })
  }

  const labelCls = 'block text-[10.5px] uppercase tracking-[0.12em] text-stone-400 dark:text-stone-600 mb-1.5'

  return (
    <div className="border-t border-stone-200/60 dark:border-stone-800/40 pt-5 pb-1 space-y-4">
      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <div className="col-span-2">
          <label className={labelCls}>
            Event name {errors.name && <span className="text-[#B83A3A] normal-case tracking-normal ml-1">{errors.name}</span>}
          </label>
          <input className="aisle-input w-full" placeholder="e.g. Wedding ceremony"
            value={form.name} onChange={set('name')} autoFocus />
        </div>
        <div>
          <label className={labelCls}>
            Start time {errors.time && <span className="text-[#B83A3A] normal-case tracking-normal ml-1">{errors.time}</span>}
          </label>
          <input className="aisle-input w-full" type="time"
            value={form.time} onChange={set('time')} />
        </div>
        <div>
          <label className={labelCls}>
            Duration (mins) {errors.duration && <span className="text-[#B83A3A] normal-case tracking-normal ml-1">{errors.duration}</span>}
          </label>
          <input className="aisle-input w-full" type="number" min="1" placeholder="60"
            value={form.duration} onChange={set('duration')} />
        </div>
        <div>
          <label className={labelCls}>Type</label>
          <select className="aisle-input w-full" value={form.type} onChange={set('type')}>
            {TYPE_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Location (optional)</label>
          <input className="aisle-input w-full" placeholder="e.g. Outdoor Ceremony Space"
            value={form.location} onChange={set('location')} />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Notes (optional)</label>
          <textarea className="aisle-input w-full resize-none" rows={2}
            placeholder="Coordinator cues, reminders…"
            value={form.notes} onChange={set('notes')} />
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <div>
          {isEditing && onDelete && (
            <button onClick={onDelete} className="inline-btn-danger">Delete</button>
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
            {isEditing ? 'Save' : 'Add event'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TimelineView() {
  const { state, dispatch } = useApp()
  const { timelineEvents, wedding } = state

  const [showAdd, setShowAdd]       = useState(false)
  const [editingId, setEditingId]   = useState(null)

  const weddingDateFmt = wedding.date
    ? new Date(wedding.date).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      })
    : 'Wedding day'

  const totalDuration = timelineEvents.reduce((s, e) => s + e.duration, 0)

  const handleSaveNew = (payload) => {
    dispatch({ type: 'ADD_TIMELINE_EVENT', payload: { id: `e${Date.now()}`, ...payload } })
    setShowAdd(false)
  }

  const handleSaveEdit = (id, payload) => {
    dispatch({ type: 'UPDATE_TIMELINE_EVENT', payload: { id, ...payload } })
    setEditingId(null)
  }

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TIMELINE_EVENT', payload: id })
    setEditingId(null)
  }

  return (
    <FeatureGate minTier="couple" feature="Day-of Timeline">
    <div className="space-y-5 pb-4">

      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="view-title">Day of</h1>
          <p className="label-luxury mt-1">{weddingDateFmt}</p>
          {timelineEvents.length > 0 && (
            <p className="label-luxury mt-0.5">
              {timelineEvents.length} event{timelineEvents.length !== 1 ? 's' : ''} · {formatDuration(totalDuration)} scheduled
            </p>
          )}
        </div>
        {!showAdd && (
          <button
            onClick={() => { setShowAdd(true); setEditingId(null) }}
            className="inline-btn bg-stone-900 dark:bg-stone-100
                       text-stone-100 dark:text-stone-900
                       hover:bg-stone-700 dark:hover:bg-stone-300
                       transition-colors duration-150 gap-1.5"
          >
            <Plus size={13} /> Event
          </button>
        )}
      </div>

      {/* Type legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {TYPE_OPTIONS.map(t => (
          <div key={t.value} className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${TYPE_DOT[t.value]}`} />
            <span className="text-[10px] text-stone-400 dark:text-stone-600 uppercase tracking-[0.14em]">
              {t.label}
            </span>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <EventForm
          initial={emptyForm}
          onSave={handleSaveNew}
          onCancel={() => setShowAdd(false)}
          isEditing={false}
        />
      )}

      {/* Timeline */}
      {timelineEvents.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <p className="font-display italic text-[1.4rem] font-light text-stone-300 dark:text-stone-700">
            No events yet
          </p>
          <p className="text-sm text-stone-400 dark:text-stone-600">
            Add your first event to build the wedding day schedule.
          </p>
          <button onClick={() => setShowAdd(true)} className="add-row-btn justify-center">
            <Plus size={13} /> Add event
          </button>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical spine */}
          <div className="absolute left-[52px] top-2 bottom-2 w-px bg-stone-200/70 dark:bg-stone-800/60" />

          <motion.div
            className="space-y-0"
            variants={fadeList}
            initial="hidden"
            animate="show"
          >
            {timelineEvents.map((ev, idx) => {
              const endTime  = addMinutes(ev.time, ev.duration)
              const isLast   = idx === timelineEvents.length - 1
              const isEditing = editingId === ev.id

              return (
                <motion.div key={ev.id} variants={fadeItem} className="flex gap-0 group/row relative">

                  {/* Time column */}
                  <div className="w-[52px] shrink-0 pt-3.5 text-right pr-4">
                    <span className="text-[10.5px] tabular-nums text-stone-400 dark:text-stone-500
                                     font-medium leading-none tracking-[0.02em]">
                      {ev.time}
                    </span>
                  </div>

                  {/* Dot on spine */}
                  <div className="relative flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full mt-4 shrink-0 z-10
                                     ring-2 ring-[#F7F5F1] dark:ring-[#131110]
                                     ${TYPE_DOT[ev.type]}`} />
                    {!isLast && <div className="flex-1 w-px bg-transparent" />}
                  </div>

                  {/* Event content */}
                  <div className="flex-1 ml-4 mb-4">
                    {isEditing ? (
                      <EventForm
                        initial={{
                          time: ev.time, duration: ev.duration,
                          name: ev.name, location: ev.location || '',
                          type: ev.type, notes: ev.notes || '',
                        }}
                        onSave={(payload) => handleSaveEdit(ev.id, payload)}
                        onCancel={() => setEditingId(null)}
                        onDelete={() => handleDelete(ev.id)}
                        isEditing={true}
                      />
                    ) : (
                      <div className="pt-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[13.5px] font-medium text-stone-800 dark:text-stone-200">
                                {ev.name}
                              </span>
                              <span className={`text-[10.5px] uppercase tracking-[0.1em] ${TYPE_LABEL_COLOR[ev.type]}`}>
                                {TYPE_OPTIONS.find(t => t.value === ev.type)?.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap mt-1">
                              <span className="flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500">
                                <Clock size={9} className="shrink-0" />
                                {ev.time} – {endTime} · {formatDuration(ev.duration)}
                              </span>
                              {ev.location && (
                                <span className="flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500">
                                  <MapPin size={9} className="shrink-0" />
                                  {ev.location}
                                </span>
                              )}
                            </div>
                            {ev.notes && (
                              <p className="text-xs text-stone-400 dark:text-stone-500 mt-1 leading-relaxed">
                                {ev.notes}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => { setEditingId(ev.id); setShowAdd(false) }}
                            aria-label={`Edit ${ev.name}`}
                            className="opacity-0 group-hover/row:opacity-100 transition-opacity
                                       text-stone-300 dark:text-stone-700
                                       hover:text-stone-500 dark:hover:text-stone-500 p-1 -mr-1"
                          >
                            <Pencil size={11} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}

            {/* End of day marker */}
            {timelineEvents.length > 0 && (() => {
              const last = timelineEvents[timelineEvents.length - 1]
              const endTime = addMinutes(last.time, last.duration)
              return (
                <div className="flex gap-0">
                  <div className="w-[52px] shrink-0 pt-1 text-right pr-4">
                    <span className="text-[10.5px] tabular-nums text-stone-300 dark:text-stone-700 font-medium">
                      {endTime}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-stone-200 dark:bg-stone-700 z-10
                                    ring-2 ring-[#F7F5F1] dark:ring-[#131110]" />
                  </div>
                  <div className="ml-4 pt-0.5">
                    <span className="text-[10px] text-stone-300 dark:text-stone-700
                                     uppercase tracking-[0.14em]">End of day</span>
                  </div>
                </div>
              )
            })()}
          </motion.div>

        </div>
      )}
    </div>
    </FeatureGate>
  )
}
