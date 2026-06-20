import { useApp } from '../../context/AppContext'
import SimpleProgress from '../ui/SimpleProgress'

const fmt = (n) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n)

function formatVenue(wedding) {
  const parts = [wedding.venue, wedding.city].filter(Boolean)
  return parts.join(' · ')
}

function formatDateLong(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function daysUntil(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return Math.ceil((new Date(dateStr) - today) / 86400000)
}

function isOverdue(task) {
  if (!task.dueDate || task.done) return false
  return new Date(task.dueDate) < new Date()
}

function daysUntilTask(task) {
  if (!task.dueDate) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return Math.ceil((new Date(task.dueDate) - today) / 86400000)
}

export default function Overview({ onNavigate }) {
  const { state } = useApp()
  const { wedding, tasks, budgetItems, guests } = state

  const days    = daysUntil(wedding.date)
  const isPast  = days < 0
  const absDays = Math.abs(days)

  const doneTasks  = tasks.filter(t => t.done).length
  const totalTasks = tasks.length
  const tasksPct   = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const totalPlanned = budgetItems.reduce((s, b) => s + (b.planned || 0), 0)
  const totalActual  = budgetItems.reduce((s, b) => s + (b.actual  || 0), 0)
  const budgetPct    = totalPlanned > 0 ? Math.min(100, Math.round((totalActual / totalPlanned) * 100)) : 0

  const confirmed = guests.filter(g => g.rsvp === 'confirmed').length
  const pending   = guests.filter(g => g.rsvp === 'pending').length
  const declined  = guests.filter(g => g.rsvp === 'declined').length

  const nextTasks = tasks
    .filter(t => !t.done && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4)

  return (
    <div className="pb-4">

      {/* ── HERO CARD ────────────────────────────────────────────── */}
      <div
        className="rounded-2xl px-5 py-6 mb-0"
        style={{ background: '#3D5A48' }}
      >
        {/* Venue */}
        {(wedding.venue || wedding.city) && (
          <p className="text-[10px] uppercase tracking-[0.18em] font-medium mb-2"
             style={{ color: 'rgba(247,245,241,0.5)' }}>
            {formatVenue(wedding)}
          </p>
        )}

        {/* Countdown */}
        <div className="flex items-baseline gap-2 mb-1">
          <span
            className="font-display italic font-light leading-none tabular-nums"
            style={{ fontSize: 'clamp(4.5rem, 18vw, 7rem)', letterSpacing: '-0.025em', color: '#F7F5F1' }}
          >
            {absDays}
          </span>
        </div>
        <p className="text-[11px] mb-1" style={{ color: 'rgba(247,245,241,0.55)', letterSpacing: '0.02em' }}>
          {isPast ? 'days since your wedding' : 'days until your wedding'}
        </p>
        <p className="text-[12px] font-light" style={{ color: 'rgba(247,245,241,0.6)', letterSpacing: '0.01em' }}>
          {formatDateLong(wedding.date)}
          {wedding.coupleNames ? ` · ${wedding.coupleNames}` : ''}
        </p>

        {/* Progress strip */}
        <div className="mt-5">
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: 'rgba(247,245,241,0.5)' }}>
              Planning progress
            </span>
            <span className="text-[10px] tabular-nums" style={{ color: 'rgba(247,245,241,0.6)' }}>
              {tasksPct}%
            </span>
          </div>
          <SimpleProgress pct={tasksPct} height={22} onDark ringBg="#3D5A48" />
        </div>
      </div>

      {/* ── STAT GRID ────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 mt-0 mb-0 rounded-xl overflow-hidden
                      bg-stone-200/60 dark:bg-stone-800/30"
           style={{ gap: '1px' }}>

        {/* Budget */}
        <button
          onClick={() => onNavigate('budget')}
          className="flex flex-col px-4 py-4 text-left transition-all duration-150
                     bg-[#F7F5F1] dark:bg-[#131110]
                     hover:bg-stone-100 dark:hover:bg-stone-900/70
                     ring-inset hover:ring-1 hover:ring-stone-300 dark:hover:ring-stone-700"
        >
          <span className="text-[9px] uppercase tracking-[0.14em] text-stone-400 dark:text-stone-500 mb-1.5 font-medium">Budget</span>
          <span className="font-display font-light leading-none tabular-nums text-stone-900 dark:text-stone-100"
                style={{ fontSize: '1.6rem', letterSpacing: '-0.01em' }}>
            {budgetPct}<span className="text-[1rem]">%</span>
          </span>
          <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-1 tabular-nums">
            {totalPlanned > 0 ? `${fmt(totalActual)} spent` : 'not set'}
          </span>
        </button>

        {/* Tasks */}
        <button
          onClick={() => onNavigate('checklist')}
          className="flex flex-col px-4 py-4 text-left transition-all duration-150
                     bg-[#F7F5F1] dark:bg-[#131110]
                     hover:bg-stone-100 dark:hover:bg-stone-900/70
                     ring-inset hover:ring-1 hover:ring-stone-300 dark:hover:ring-stone-700"
        >
          <span className="text-[9px] uppercase tracking-[0.14em] text-stone-400 dark:text-stone-500 mb-1.5 font-medium">Tasks</span>
          <span className="font-display font-light leading-none tabular-nums text-stone-900 dark:text-stone-100"
                style={{ fontSize: '1.6rem', letterSpacing: '-0.01em' }}>
            {doneTasks}
            <span className="text-[1rem] opacity-40">/{totalTasks}</span>
          </span>
          <span className={`text-[10px] mt-1 ${tasks.filter(isOverdue).length > 0 ? 'text-[#FF5A5F]' : 'text-stone-400 dark:text-stone-500'}`}>
            {tasks.filter(isOverdue).length > 0
              ? `${tasks.filter(isOverdue).length} overdue`
              : 'on track'}
          </span>
        </button>

        {/* RSVPs */}
        <button
          onClick={() => onNavigate('guests')}
          className="flex flex-col px-4 py-4 text-left transition-all duration-150
                     bg-[#F7F5F1] dark:bg-[#131110]
                     hover:bg-stone-100 dark:hover:bg-stone-900/70
                     ring-inset hover:ring-1 hover:ring-stone-300 dark:hover:ring-stone-700"
        >
          <span className="text-[9px] uppercase tracking-[0.14em] text-stone-400 dark:text-stone-500 mb-1.5 font-medium">RSVPs</span>
          <span className="font-display font-light leading-none tabular-nums text-[#4A6B58] dark:text-[#6A9B78]"
                style={{ fontSize: '1.6rem', letterSpacing: '-0.01em' }}>
            {confirmed}
          </span>
          <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-1 tabular-nums">
            {pending > 0 ? `${pending} pending` : `${declined} declined`}
          </span>
        </button>
      </div>

      {/* ── NEXT UP ──────────────────────────────────────────────── */}
      <div className="mt-7">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-medium">
            Next up
          </h2>
          <button
            onClick={() => onNavigate('checklist')}
            className="text-[11px] text-accent dark:text-accent-dark tracking-[0.04em]"
          >
            All tasks →
          </button>
        </div>

        {nextTasks.length === 0 ? (
          <p className="font-display italic font-light text-[1.25rem] text-stone-300 dark:text-stone-700">
            All tasks complete.
          </p>
        ) : (
          <div>
            {nextTasks.map(task => {
              const d = daysUntilTask(task)
              const urgent = d !== null && d <= 7
              return (
                <button
                  key={task.id}
                  onClick={() => onNavigate('checklist')}
                  className="flex items-center gap-3 w-full py-3 text-left
                             border-b border-stone-200/50 dark:border-stone-800/40
                             last:border-b-0"
                >
                  <span
                    className="w-[6px] h-[6px] rounded-full shrink-0"
                    style={{ background: urgent ? '#FF5A5F' : '#4A6B58' }}
                  />
                  <span className="flex-1 text-[13px] text-stone-800 dark:text-stone-200 leading-snug">
                    {task.task}
                  </span>
                  {d !== null && (
                    <span className="text-[11px] shrink-0 tabular-nums"
                          style={{ color: urgent ? '#FF5A5F' : '#9C9589' }}>
                      {d === 0 ? 'Today'
                       : d < 0 ? `${Math.abs(d)}d ago`
                       : d === 1 ? 'Tomorrow'
                       : `${d} days`}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
