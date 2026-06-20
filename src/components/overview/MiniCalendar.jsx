import { useState } from 'react'

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function MiniCalendar({ wedding, tasks }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weddingDate = new Date(wedding.date)

  const [displayDate, setDisplayDate] = useState(() => {
    const d = new Date(today)
    d.setDate(1)
    return d
  })

  const year  = displayDate.getFullYear()
  const month = displayDate.getMonth()
  const monthLabel = displayDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const firstDow    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Index tasks by due day for this month
  const tasksByDay = {}
  tasks.forEach(t => {
    if (!t.dueDate) return
    const d = new Date(t.dueDate)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!tasksByDay[day]) tasksByDay[day] = []
      tasksByDay[day].push(t)
    }
  })

  const isWeddingMonth = weddingDate.getFullYear() === year && weddingDate.getMonth() === month
  const weddingDay     = isWeddingMonth ? weddingDate.getDate() : null

  const isToday = d =>
    d && today.getFullYear() === year && today.getMonth() === month && today.getDate() === d

  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const prev = () => setDisplayDate(d => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n })
  const next = () => setDisplayDate(d => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n })

  return (
    <div className="bg-stone-100 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-700/50 rounded-[10px] overflow-hidden">

      {/* Month navigation */}
      <div className="flex items-center justify-between px-4 pt-[14px] pb-[10px] border-b border-stone-200/60 dark:border-stone-800/60">
        <button
          onClick={prev}
          className="w-7 h-7 flex items-center justify-center rounded-[6px]
                     text-stone-400 hover:text-stone-700 hover:bg-stone-200/60
                     dark:hover:text-stone-300 dark:hover:bg-stone-800/50
                     transition-colors duration-150"
          aria-label="Previous month"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="font-display text-[16px] font-normal text-stone-800 dark:text-stone-200">
          {monthLabel}
        </span>
        <button
          onClick={next}
          className="w-7 h-7 flex items-center justify-center rounded-[6px]
                     text-stone-400 hover:text-stone-700 hover:bg-stone-200/60
                     dark:hover:text-stone-300 dark:hover:bg-stone-800/50
                     transition-colors duration-150"
          aria-label="Next month"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 11l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-[3px] px-3 pb-3 pt-[10px]">
        {/* Day-of-week headers */}
        {DOW.map(d => (
          <div
            key={d}
            className="text-[10px] font-medium tracking-[0.06em] uppercase text-center
                       text-stone-400 dark:text-stone-500 pb-[6px]"
          >
            {d}
          </div>
        ))}

        {/* Day cells */}
        {cells.map((d, i) => {
          const dayTasks  = d ? (tasksByDay[d] || []) : []
          const isWedding = d === weddingDay
          const isTodayCell = isToday(d)
          const hasTasks  = dayTasks.length > 0

          return (
            <div
              key={i}
              className={[
                'flex flex-col items-start rounded-[6px] px-[3px] pt-1 pb-[5px] min-h-[38px]',
                !d ? 'opacity-0 pointer-events-none' : '',
                isWedding ? 'bg-stone-200/60 dark:bg-stone-800/50' : '',
                isTodayCell && !isWedding ? 'bg-stone-200/50 dark:bg-stone-800/40' : '',
              ].filter(Boolean).join(' ')}
            >
              {d && (
                <span
                  className={[
                    'text-[11.5px] w-5 h-5 flex items-center justify-center rounded-full shrink-0 leading-none',
                    isWedding
                      ? 'bg-accent dark:bg-accent-dark text-white font-semibold text-[11px]'
                      : isTodayCell
                        ? 'font-bold text-stone-900 dark:text-stone-100'
                        : hasTasks
                          ? 'text-stone-700 dark:text-stone-300 font-medium'
                          : 'text-stone-400 dark:text-stone-500',
                  ].join(' ')}
                >
                  {d}
                </span>
              )}

              {d && dayTasks.slice(0, 2).map((t, idx) => (
                <span
                  key={idx}
                  className={[
                    'text-[9.5px] leading-[1.25] w-full mt-[2px]',
                    'overflow-hidden',
                    isWedding
                      ? 'text-accent/80 dark:text-accent-dark/80'
                      : t.done
                        ? 'text-stone-300 dark:text-stone-600 line-through'
                        : 'text-stone-600 dark:text-stone-400',
                  ].join(' ')}
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                >
                  {t.task}
                </span>
              ))}
            </div>
          )
        })}
      </div>

      {/* Wedding day footer */}
      {isWeddingMonth && weddingDay && (
        <div className="border-t border-stone-200/60 dark:border-stone-800/60 px-4 py-3 bg-stone-50 dark:bg-stone-950/20">
          <div className="flex items-center gap-[10px]">
            <span className="text-[12px] font-semibold tabular-nums text-accent dark:text-accent-dark
                             bg-stone-200/80 dark:bg-stone-800/80 rounded-[4px] px-[8px] py-[2px]">
              {weddingDay}
            </span>
            <span className="font-display text-[15px] text-accent dark:text-accent-dark">
              Wedding Day
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
