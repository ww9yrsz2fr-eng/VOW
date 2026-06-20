import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { TIER_LABELS, TIER_PRICING } from '../../context/SubscriptionConfig'

export default function SettingsView() {
  const { state, dispatch } = useApp()
  const { wedding, subscription } = state

  const [form, setForm] = useState({
    coupleNames: wedding.coupleNames || '',
    date:        wedding.date        || '',
    venue:       wedding.venue       || '',
    city:        wedding.city        || '',
    budget:      wedding.budget      || '',
    guestCount:  wedding.guestCount  || '',
  })
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    dispatch({ type: 'UPDATE_WEDDING', payload: form })
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  const handleReset = () => {
    dispatch({ type: 'RESET_DATA' })
    setForm({ coupleNames: '', date: '', venue: '', city: '', budget: '', guestCount: '' })
    setConfirmReset(false)
  }

  const pricing = TIER_PRICING[subscription]

  return (
    <div className="space-y-10 pb-4">

      {/* Header */}
      <div className="pt-2 border-b border-stone-200/60 dark:border-stone-800/40 pb-6">
        <h1 className="view-title">Settings</h1>
        <p className="label-luxury mt-1">Your wedding details</p>
      </div>

      {/* Wedding form */}
      <form onSubmit={handleSave} className="space-y-0">
        <p className="eyebrow mb-5">The wedding</p>

        {[
          { label: 'Names',       id: 'coupleNames', placeholder: 'e.g. Elara & Marcus',         type: 'text'   },
          { label: 'Date',        id: 'date',        placeholder: '',                              type: 'date'   },
          { label: 'Venue',       id: 'venue',       placeholder: 'e.g. The Greenhouse Estate',   type: 'text'   },
          { label: 'Location',    id: 'city',        placeholder: 'e.g. Hudson Valley, NY',       type: 'text'   },
          { label: 'Budget ($)',  id: 'budget',      placeholder: 'e.g. 50000',                   type: 'number' },
          { label: 'Est. guests', id: 'guestCount',  placeholder: 'e.g. 120',                     type: 'number' },
        ].map(({ label, id, placeholder, type }, i, arr) => (
          <div
            key={id}
            className={`flex items-center gap-4 py-4
                        ${i < arr.length - 1 ? 'border-b border-stone-100 dark:border-stone-800/50' : ''}`}
          >
            <label
              htmlFor={`s-${id}`}
              className="w-24 shrink-0 text-[11px] uppercase tracking-[0.14em] text-stone-400 dark:text-stone-600"
            >
              {label}
            </label>
            <input
              id={`s-${id}`}
              type={type}
              value={form[id]}
              placeholder={placeholder}
              onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
              className="aisle-input flex-1"
            />
          </div>
        ))}

        <div className="pt-6 flex items-center gap-4">
          <button type="submit" className="inline-btn bg-stone-900 dark:bg-stone-100
                                           text-stone-100 dark:text-stone-900
                                           hover:bg-stone-700 dark:hover:bg-stone-300
                                           transition-colors duration-150">
            Save changes
          </button>
          {saved && (
            <span className="text-[12px] text-accent dark:text-accent-dark tracking-[0.04em]">
              Saved
            </span>
          )}
        </div>
      </form>

      {/* Subscription section */}
      <div className="border-t border-stone-200/60 dark:border-stone-800/40 pt-8 space-y-4">
        <p className="eyebrow">Plan</p>
        <div className="flex items-center justify-between py-3 border-b border-stone-100 dark:border-stone-800/50">
          <span className="text-[13.5px] text-stone-700 dark:text-stone-300">Current plan</span>
          <span className="text-[13.5px] font-medium text-stone-900 dark:text-stone-100">
            {TIER_LABELS[subscription]}
          </span>
        </div>
        {pricing && subscription !== 'premium' && (
          <div className="flex items-center justify-between py-3 border-b border-stone-100 dark:border-stone-800/50">
            <span className="text-[13.5px] text-stone-500 dark:text-stone-400">Upgrade available</span>
            <span className="text-[12px] text-stone-400 dark:text-stone-600">
              See plans in any locked section
            </span>
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="border-t border-stone-200/60 dark:border-stone-800/40 pt-8 space-y-4">
        <p className="eyebrow">Data</p>
        <p className="text-[13px] text-stone-500 dark:text-stone-400 leading-relaxed">
          Clearing your data will remove all guests, budget items, tasks, vendors, tables, and timeline events.
          Your subscription status is not affected.
        </p>

        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="inline-btn-danger"
          >
            Clear all data
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="inline-btn bg-[#B83A3A] text-white hover:bg-[#9e2e2e] transition-colors duration-150"
            >
              Yes, clear everything
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="text-[12.5px] text-stone-400 dark:text-stone-600 hover:text-stone-600 dark:hover:text-stone-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
