import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Phone, Mail, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import FeatureGate from '../ui/FeatureGate'
import SimpleProgress from '../ui/SimpleProgress'

const fadeList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}
const fadeItem = {
  hidden: { opacity: 0, y: 6 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0, 0.15, 1] } },
}

const CATEGORIES = [
  'Venue', 'Catering', 'Photography', 'Florals', 'Music',
  'Stationery', 'Cake', 'Attire', 'Hair & Makeup', 'Transport', 'Other',
]

const STATUS_OPTIONS = [
  { value: 'pending',      label: 'Pending' },
  { value: 'contracted',   label: 'Contracted' },
  { value: 'deposit-paid', label: 'Deposit Paid' },
  { value: 'fully-paid',   label: 'Fully Paid' },
]

const STATUS_COLORS = {
  pending:      'text-stone-400 dark:text-stone-600',
  contracted:   'text-amber-600 dark:text-amber-500',
  'deposit-paid': 'text-accent dark:text-accent-dark',
  'fully-paid': 'text-emerald-600 dark:text-emerald-500',
}

const emptyForm = {
  name: '', category: 'Venue', contact: '', email: '', phone: '',
  status: 'pending', depositPaid: '', totalCost: '', note: '',
}

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)

// Inline progress bar — no component library needed
function PayBar({ paid, total }) {
  if (!total) return null
  const pct = Math.min(100, Math.round((paid / total) * 100))
  return (
    <div className="h-[2px] bg-stone-100 dark:bg-stone-800 mt-3 rounded-full overflow-hidden">
      <div
        className="h-full bg-accent dark:bg-accent-dark rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// Inline form used for both add and edit
function VendorForm({ initial, onSave, onCancel, onDelete, isEditing }) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (form.totalCost === '' || isNaN(Number(form.totalCost))) e.totalCost = 'Enter a valid amount'
    return e
  }

  const handleSave = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave({
      name: form.name.trim(), category: form.category,
      contact: form.contact.trim(), email: form.email.trim(), phone: form.phone.trim(),
      status: form.status,
      depositPaid: Number(form.depositPaid) || 0,
      totalCost: Number(form.totalCost) || 0,
      note: form.note.trim(),
    })
  }

  const labelCls = 'block text-[10.5px] uppercase tracking-[0.12em] text-stone-400 dark:text-stone-600 mb-1.5'
  const fieldCls = 'aisle-input w-full'

  return (
    <div className="border-t border-stone-200/60 dark:border-stone-800/40 pt-6 pb-2 space-y-4">
      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <div className="col-span-2">
          <label className={labelCls}>Vendor name {errors.name && <span className="text-[#B83A3A] normal-case tracking-normal ml-1">{errors.name}</span>}</label>
          <input className={fieldCls} placeholder="e.g. Claire Moreau Studio"
            value={form.name} onChange={set('name')} autoFocus />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <select className={fieldCls} value={form.category} onChange={set('category')}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select className={fieldCls} value={form.status} onChange={set('status')}>
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Total cost ($) {errors.totalCost && <span className="text-[#B83A3A] normal-case tracking-normal ml-1">{errors.totalCost}</span>}</label>
          <input className={fieldCls} type="number" min="0" placeholder="0"
            value={form.totalCost} onChange={set('totalCost')} />
        </div>
        <div>
          <label className={labelCls}>Amount paid ($)</label>
          <input className={fieldCls} type="number" min="0" placeholder="0"
            value={form.depositPaid} onChange={set('depositPaid')} />
        </div>
        <div>
          <label className={labelCls}>Contact name</label>
          <input className={fieldCls} placeholder="Sarah Mitchell"
            value={form.contact} onChange={set('contact')} />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input className={fieldCls} type="tel" placeholder="+1 555 000 0000"
            value={form.phone} onChange={set('phone')} />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Email</label>
          <input className={fieldCls} type="email" placeholder="hello@vendor.com"
            value={form.email} onChange={set('email')} />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Notes</label>
          <textarea className={`${fieldCls} resize-none`} rows={2}
            placeholder="Contract details, key dates, reminders…"
            value={form.note} onChange={set('note')} />
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
            {isEditing ? 'Save changes' : 'Add vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function VendorsView() {
  const { state, dispatch } = useApp()
  const { vendors } = state

  const [filter, setFilter]   = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const totalCost     = vendors.reduce((s, v) => s + (v.totalCost    || 0), 0)
  const totalPaid     = vendors.reduce((s, v) => s + (v.depositPaid  || 0), 0)
  const balanceDue    = totalCost - totalPaid
  const contracted    = vendors.filter(v => v.status !== 'pending').length

  const filtered = filter === 'all'
    ? vendors
    : vendors.filter(v => v.status === filter)

  const handleSaveNew = (payload) => {
    dispatch({ type: 'ADD_VENDOR', payload: { id: `v${Date.now()}`, ...payload } })
    setShowAdd(false)
  }

  const handleSaveEdit = (id, payload) => {
    dispatch({ type: 'UPDATE_VENDOR', payload: { id, ...payload } })
    setEditingId(null)
  }

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_VENDOR', payload: id })
    setEditingId(null)
  }

  const FILTER_OPTS = [
    { label: `All (${vendors.length})`, value: 'all' },
    { label: 'Pending',      value: 'pending' },
    { label: 'Contracted',   value: 'contracted' },
    { label: 'Deposit paid', value: 'deposit-paid' },
    { label: 'Fully paid',   value: 'fully-paid' },
  ]

  return (
    <FeatureGate minTier="couple" feature="Vendor Tracker">
    <div className="space-y-5 pb-4">

      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="view-title">Vendors</h1>
          <p className="label-luxury mt-1">
            {contracted} of {vendors.length} contracted
          </p>
        </div>
        {!showAdd && (
          <button
            onClick={() => { setShowAdd(true); setEditingId(null) }}
            className="inline-btn bg-stone-900 dark:bg-stone-100
                       text-stone-100 dark:text-stone-900
                       hover:bg-stone-700 dark:hover:bg-stone-300
                       transition-colors duration-150 gap-1.5"
          >
            <Plus size={13} />
            Add
          </button>
        )}
      </div>

      {/* Stat strip — 3 cols matching mockup */}
      <div className="grid grid-cols-3 mb-0 rounded-xl overflow-hidden
                      bg-stone-200/60 dark:bg-stone-800/30"
           style={{ gap: '1px' }}>
        {[
          { label: 'Booked',  value: contracted,                                         cls: 'text-[#4A6B58] dark:text-[#6A9B78]' },
          { label: 'Pending', value: vendors.filter(v => v.status === 'pending').length, cls: 'text-[#A08050] dark:text-[#C4994A]' },
          { label: 'Total',   value: fmt(totalCost),                                     cls: 'text-stone-900 dark:text-stone-100' },
        ].map(({ label, value, cls }) => (
          <div key={label} className="flex flex-col px-4 py-4 bg-[#F7F5F1] dark:bg-[#131110]
                                     transition-all duration-150 ring-inset
                                     hover:bg-stone-100 dark:hover:bg-stone-900/70
                                     hover:ring-1 hover:ring-stone-300 dark:hover:ring-stone-700">
            <span className={`font-display font-light leading-none tabular-nums ${cls}`}
                  style={{ fontSize: '1.5rem' }}>
              {value}
            </span>
            <span className="text-[9px] uppercase tracking-[0.12em] text-stone-400 dark:text-stone-500 mt-1.5 font-medium">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Overall payment progress */}
      {totalCost > 0 && (
        <div className="space-y-1.5 mt-4">
          <div className="flex justify-between">
            <span className="label-luxury">Payment progress</span>
            <span className="label-luxury">{Math.round((totalPaid / totalCost) * 100)}%</span>
          </div>
          <SimpleProgress pct={Math.min(100, (totalPaid / totalCost) * 100)} height={22} />
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <VendorForm
          initial={emptyForm}
          onSave={handleSaveNew}
          onCancel={() => setShowAdd(false)}
          isEditing={false}
        />
      )}

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_OPTS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`filter-pill${filter === value ? ' active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Vendor list */}
      {vendors.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <p className="font-display italic text-[1.4rem] font-light text-stone-300 dark:text-stone-700">
            No vendors yet
          </p>
          <p className="text-sm text-stone-400 dark:text-stone-600">
            Add your first vendor to start tracking contracts and payments.
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="add-row-btn justify-center"
          >
            <Plus size={13} /> Add vendor
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-stone-400 dark:text-stone-600">
          No vendors with this status.
        </p>
      ) : (
        <motion.div
          className="space-y-0"
          variants={fadeList}
          initial="hidden"
          animate="show"
        >
          {filtered.map((vendor, idx) => {
            const isExpanded = editingId === vendor.id
            const balance    = (vendor.totalCost || 0) - (vendor.depositPaid || 0)

            return (
              <motion.div
                key={vendor.id}
                variants={fadeItem}
                className={`${idx > 0 ? 'border-t border-stone-100 dark:border-stone-800/60' : ''}`}
              >
                {isExpanded ? (
                  <VendorForm
                    initial={{
                      name: vendor.name, category: vendor.category,
                      contact: vendor.contact, email: vendor.email, phone: vendor.phone,
                      status: vendor.status,
                      depositPaid: vendor.depositPaid,
                      totalCost: vendor.totalCost,
                      note: vendor.note || '',
                    }}
                    onSave={(payload) => handleSaveEdit(vendor.id, payload)}
                    onCancel={() => setEditingId(null)}
                    onDelete={() => handleDelete(vendor.id)}
                    isEditing={true}
                  />
                ) : (
                  <div
                    className="flex items-center gap-3 py-4 group cursor-pointer"
                    onClick={() => { setEditingId(vendor.id); setShowAdd(false) }}
                  >
                    {/* Category icon square */}
                    <div
                      className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-medium tracking-[0.03em]"
                      style={{
                        background: vendor.status === 'pending'
                          ? 'rgba(0,0,0,0.04)'
                          : 'rgba(74,107,88,0.1)',
                        color: vendor.status === 'pending' ? '#9C9589' : '#3D5A48',
                      }}
                    >
                      {(vendor.category || '?').slice(0, 2)}
                    </div>

                    {/* Name + status */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-stone-800 dark:text-stone-200 font-medium truncate">
                        {vendor.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-stone-400 dark:text-stone-500">{vendor.category}</span>
                        <span className="w-px h-3 bg-stone-200 dark:bg-stone-700" />
                        <span className={`text-[11px] tracking-[0.04em] ${STATUS_COLORS[vendor.status]}`}>
                          {STATUS_OPTIONS.find(s => s.value === vendor.status)?.label}
                        </span>
                      </div>
                    </div>

                    {/* Cost */}
                    <div className="text-right shrink-0">
                      <p className="text-[13px] tabular-nums text-stone-700 dark:text-stone-300">
                        {fmt(vendor.totalCost)}
                      </p>
                      {balance > 0 && vendor.status !== 'pending' && (
                        <p className="text-[11px] text-stone-400 dark:text-stone-500 tabular-nums">
                          {fmt(balance)} due
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}

          {/* Add row */}
          {!showAdd && (
            <button
              onClick={() => { setShowAdd(true); setEditingId(null) }}
              className="add-row-btn"
            >
              <Plus size={13} /> Add vendor
            </button>
          )}
        </motion.div>
      )}
    </div>
    </FeatureGate>
  )
}
