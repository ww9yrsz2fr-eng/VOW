import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'

const STEPS = [
  {
    id: 'names',
    eyebrow: 'To begin',
    heading: 'Who\'s getting married?',
    sub: 'This is how your wedding will be named throughout the app.',
  },
  {
    id: 'date',
    eyebrow: 'The day',
    heading: 'When is the wedding?',
    sub: 'Your date anchors the timeline, checklist and countdown.',
  },
  {
    id: 'details',
    eyebrow: 'The venue',
    heading: 'Where will it take place?',
    sub: 'These details appear on your exports and printed documents.',
  },
  {
    id: 'budget',
    eyebrow: 'The budget',
    heading: 'What\'s the overall budget?',
    sub: 'You can always adjust this later. We\'ll track spending against it.',
  },
]

const lift = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0, 0.15, 1] } },
}
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const labelCls = 'block text-[10.5px] uppercase tracking-[0.14em] text-stone-400 dark:text-stone-600 mb-2'
const fieldCls = 'w-full border-0 border-b border-stone-300 dark:border-stone-700 bg-transparent pb-2 pt-1 text-[1.15rem] text-stone-900 dark:text-stone-100 placeholder-stone-300 dark:placeholder-stone-700 focus:outline-none focus:border-accent dark:focus:border-accent-dark transition-colors duration-200'

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)

export default function SetupView({ onComplete }) {
  const { dispatch } = useApp()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    coupleNames: '',
    date:        '',
    venue:       '',
    city:        '',
    budget:      '',
    guestCount:  '',
  })

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const canAdvance = () => {
    if (step === 0) return form.coupleNames.trim().length > 0
    if (step === 1) return !!form.date
    if (step === 2) return true   // venue optional
    if (step === 3) return true   // budget optional
    return true
  }

  const advance = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      finish()
    }
  }

  const finish = () => {
    dispatch({
      type: 'UPDATE_WEDDING',
      payload: {
        coupleNames: form.coupleNames.trim() || 'My Wedding',
        date:        form.date,
        venue:       form.venue.trim(),
        city:        form.city.trim(),
        budget:      parseFloat(form.budget.replace(/[^0-9.]/g, '')) || 0,
        guestCount:  parseInt(form.guestCount) || 0,
      },
    })
    onComplete()
  }

  const current = STEPS[step]

  return (
    <div className="min-h-dvh flex flex-col bg-[#F7F5F1] dark:bg-[#131110]">

      {/* Brand mark */}
      <div className="px-8 pt-8 sm:px-12 sm:pt-10">
        <span
          className="font-display italic font-light select-none text-stone-900 dark:text-stone-100"
          style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', lineHeight: 1 }}
        >
          Vow
        </span>
      </div>

      {/* Step indicator */}
      <div className="px-8 sm:px-12 mt-8 flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-[2px] flex-1 rounded-full transition-all duration-500 ${
              i <= step
                ? 'bg-accent dark:bg-accent-dark'
                : 'bg-stone-200 dark:bg-stone-800'
            }`}
          />
        ))}
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 py-12">
        <motion.div
          key={step}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="w-full max-w-md space-y-10"
        >
          {/* Step label + heading */}
          <div className="space-y-2">
            <motion.p variants={lift} className="eyebrow">{current.eyebrow}</motion.p>
            <motion.h1
              variants={lift}
              className="font-display italic font-light text-stone-900 dark:text-stone-100 leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', letterSpacing: '-0.01em' }}
            >
              {current.heading}
            </motion.h1>
            <motion.p variants={lift} className="text-sm text-stone-400 dark:text-stone-600 leading-relaxed">
              {current.sub}
            </motion.p>
          </div>

          {/* Fields per step */}
          <motion.div variants={lift} className="space-y-8">
            {step === 0 && (
              <div>
                <label className={labelCls}>Your names</label>
                <input
                  className={fieldCls}
                  placeholder="e.g. Elara & Marcus"
                  value={form.coupleNames}
                  onChange={set('coupleNames')}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && canAdvance() && advance()}
                />
              </div>
            )}

            {step === 1 && (
              <div>
                <label className={labelCls}>Wedding date</label>
                <input
                  className={fieldCls}
                  type="date"
                  value={form.date}
                  onChange={set('date')}
                  autoFocus
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <label className={labelCls}>Venue name</label>
                  <input
                    className={fieldCls}
                    placeholder="e.g. The Greenhouse Estate"
                    value={form.venue}
                    onChange={set('venue')}
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && advance()}
                  />
                </div>
                <div>
                  <label className={labelCls}>City / Location</label>
                  <input
                    className={fieldCls}
                    placeholder="e.g. Hudson Valley, NY"
                    value={form.city}
                    onChange={set('city')}
                    onKeyDown={e => e.key === 'Enter' && advance()}
                  />
                </div>
                <div>
                  <label className={labelCls}>Estimated guests</label>
                  <input
                    className={fieldCls}
                    type="number"
                    min="0"
                    placeholder="e.g. 120"
                    value={form.guestCount}
                    onChange={set('guestCount')}
                    onKeyDown={e => e.key === 'Enter' && advance()}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <label className={labelCls}>Total budget (USD)</label>
                <input
                  className={fieldCls}
                  type="number"
                  min="0"
                  placeholder="e.g. 50000"
                  value={form.budget}
                  onChange={set('budget')}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && finish()}
                />
                {form.budget && !isNaN(parseFloat(form.budget)) && (
                  <p className="mt-3 text-sm text-stone-400 dark:text-stone-600">
                    {fmt(parseFloat(form.budget))} total budget
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Navigation */}
          <motion.div variants={lift} className="flex items-center justify-between pt-2">
            {step > 0 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="text-[12.5px] text-stone-400 dark:text-stone-600
                           hover:text-stone-600 dark:hover:text-stone-400 transition-colors"
              >
                ← Back
              </button>
            ) : (
              <span />
            )}

            <button
              onClick={advance}
              disabled={!canAdvance()}
              className={`inline-btn transition-colors duration-150
                ${canAdvance()
                  ? 'bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-300'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
                }`}
            >
              {step === STEPS.length - 1
                ? 'Begin planning'
                : step === STEPS.length - 2
                  ? 'Almost there'
                  : 'Continue →'}
            </button>
          </motion.div>

          {/* Skip on optional steps */}
          {(step === 2 || step === 3) && (
            <motion.div variants={lift} className="text-center -mt-4">
              <button
                onClick={step === STEPS.length - 1 ? finish : advance}
                className="text-[11.5px] text-stone-300 dark:text-stone-700
                           hover:text-stone-500 dark:hover:text-stone-500
                           transition-colors tracking-[0.04em]"
              >
                Skip for now
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Decorative bottom rule */}
      <div className="h-px bg-stone-200/60 dark:bg-stone-800/40" />
      <div className="px-8 sm:px-12 py-5">
        <p className="text-[11px] text-stone-300 dark:text-stone-700 tracking-[0.08em] uppercase">
          {step + 1} of {STEPS.length}
        </p>
      </div>
    </div>
  )
}
