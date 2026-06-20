import { motion } from 'framer-motion'
import { Download, Printer } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import FeatureGate from '../ui/FeatureGate'
import { LIMITS } from '../../context/SubscriptionConfig'

const fadeList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const fadeItem = {
  hidden: { opacity: 0, y: 5 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0, 0.15, 1] } },
}

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)

// ── Print helpers ─────────────────────────────────────────────────────────────

function printWindow(title, html, watermark) {
  const win = window.open('', '_blank', 'width=900,height=700')
  const watermarkHtml = watermark
    ? `<div style="position:fixed;bottom:16px;right:20px;font-size:10px;color:#B5ADA0;
                   font-family:'Inter',sans-serif;letter-spacing:0.1em;text-transform:uppercase">
         Made with Vow
       </div>`
    : ''
  win.document.write(`<!DOCTYPE html><html><head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,400;0,500;1,300;1,400&family=Inter:wght@400;500&display=swap');
      body { font-family: 'Inter', sans-serif; font-size: 13px; color: #1C1B19; background: #fff; margin: 0; padding: 32px 40px; }
      h1 { font-family: 'Cormorant Garant', Georgia, serif; font-style: italic; font-weight: 300; font-size: 2.5rem; margin: 0 0 4px; letter-spacing: -0.02em; }
      h2 { font-family: 'Cormorant Garant', Georgia, serif; font-style: italic; font-weight: 400; font-size: 1.25rem; margin: 24px 0 8px; color: #4A4642; }
      .meta { font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #8A8278; margin-bottom: 28px; }
      .divider { border: none; border-top: 1px solid #E5E1DA; margin: 20px 0; }
      table { width: 100%; border-collapse: collapse; }
      th { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; color: #8A8278; font-weight: 500; text-align: left; padding: 6px 8px; border-bottom: 1px solid #E5E1DA; }
      td { padding: 7px 8px; border-bottom: 1px solid #F2F0ED; font-size: 12.5px; vertical-align: top; }
      tr:last-child td { border-bottom: none; }
      .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 10px; text-transform: capitalize; }
      .badge-confirmed, .badge-paid, .badge-fully-paid { background: #e8f0eb; color: #1F4D36; }
      .badge-pending, .badge-partial, .badge-deposit-paid, .badge-contracted { background: #fef3e2; color: #92400e; }
      .badge-declined { background: #f0efee; color: #6B6560; }
      .table-card { break-inside: avoid; margin-bottom: 16px; border: 1px solid #E5E1DA; padding: 12px 14px; }
      .table-title { font-family: 'Cormorant Garant', serif; font-style: italic; font-size: 1rem; margin: 0 0 4px; }
      .table-meta { font-size: 11px; color: #8A8278; text-transform: uppercase; letter-spacing: 0.16em; }
      .guest-chip { display: inline-block; margin: 2px 3px 2px 0; font-size: 11.5px; }
      .tables-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .totals-row td { font-weight: 600; border-top: 2px solid #E5E1DA; }
      @media print {
        body { padding: 16px 24px; }
        @page { margin: 0.6in; }
      }
    </style>
  </head><body>${html}${watermarkHtml}</body></html>`)
  win.document.close()
  setTimeout(() => win.print(), 400)
}

// ── Individual print generators ───────────────────────────────────────────────

function printGuestList(state, watermark) {
  const { guests, wedding } = state
  const confirmed = guests.filter(g => g.rsvp === 'confirmed')
  const pending   = guests.filter(g => g.rsvp === 'pending')
  const declined  = guests.filter(g => g.rsvp === 'declined')

  const rows = (list) => list.map(g => `
    <tr>
      <td>${g.firstName} ${g.lastName}${g.plusOne ? ` <span style="color:#8A8278">+1${g.plusOneName ? ' ('+g.plusOneName+')' : ''}</span>` : ''}</td>
      <td style="text-transform:capitalize">${g.side}</td>
      <td style="text-transform:capitalize">${g.group}</td>
      <td>${g.dietary !== 'none' ? g.dietary : '—'}</td>
      <td><span class="badge badge-${g.rsvp}">${g.rsvp}</span></td>
    </tr>`).join('')

  printWindow(`Guest List — ${wedding.coupleNames}`, `
    <h1>${wedding.coupleNames}</h1>
    <p class="meta">Guest List · ${wedding.venue} · ${wedding.date ? new Date(wedding.date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) : ''}</p>
    <hr class="divider">
    <p style="font-size:12px;color:#8A8278;margin-bottom:16px">
      ${guests.length} invited &nbsp;·&nbsp; ${confirmed.length} confirmed &nbsp;·&nbsp; ${pending.length} pending &nbsp;·&nbsp; ${declined.length} declined
    </p>
    <h2>Confirmed (${confirmed.length})</h2>
    <table><thead><tr><th>Name</th><th>Side</th><th>Group</th><th>Dietary</th><th>RSVP</th></tr></thead>
    <tbody>${rows(confirmed)}</tbody></table>
    ${pending.length ? `<h2>Pending (${pending.length})</h2>
    <table><thead><tr><th>Name</th><th>Side</th><th>Group</th><th>Dietary</th><th>RSVP</th></tr></thead>
    <tbody>${rows(pending)}</tbody></table>` : ''}
    ${declined.length ? `<h2>Declined (${declined.length})</h2>
    <table><thead><tr><th>Name</th><th>Side</th><th>Group</th><th>Dietary</th><th>RSVP</th></tr></thead>
    <tbody>${rows(declined)}</tbody></table>` : ''}
  `, watermark)
}

function printSeatingChart(state, watermark) {
  const { tables, guests, wedding } = state
  const getGuests = (tid) => guests.filter(g => g.tableId === tid)

  const tableCards = tables.map(t => {
    const seated = getGuests(t.id)
    return `<div class="table-card">
      <div class="table-title">${t.name}</div>
      <div class="table-meta">${seated.length} / ${t.capacity} seats</div>
      <div style="margin-top:8px">
        ${seated.length === 0
          ? '<span style="color:#B5ADA0;font-size:11px">Empty</span>'
          : seated.map(g => `<div class="guest-chip">${g.firstName} ${g.lastName}${g.dietary !== 'none' ? ` <span style="color:#8A8278;font-size:10px">(${g.dietary})</span>` : ''}</div>`).join('')}
      </div>
    </div>`
  }).join('')

  printWindow(`Seating Chart — ${wedding.coupleNames}`, `
    <h1>${wedding.coupleNames}</h1>
    <p class="meta">Seating Chart · ${tables.length} Tables · ${guests.filter(g=>g.tableId).length} Guests Seated</p>
    <hr class="divider">
    <div class="tables-grid">${tableCards}</div>
  `, watermark)
}

function printBudget(state, watermark) {
  const { budgetItems, wedding } = state
  const total  = budgetItems.reduce((s, b) => s + b.planned, 0)
  const spent  = budgetItems.reduce((s, b) => s + b.actual, 0)
  const remain = total - spent

  const rows = budgetItems.map(b => `
    <tr>
      <td>${b.category}</td>
      <td style="text-align:right;font-variant-numeric:tabular-nums">${fmt(b.planned)}</td>
      <td style="text-align:right;font-variant-numeric:tabular-nums">${fmt(b.actual)}</td>
      <td style="text-align:right;font-variant-numeric:tabular-nums;color:${b.actual>b.planned?'#B83A3A':'inherit'}">${fmt(b.planned - b.actual)}</td>
      <td><span class="badge badge-${b.status}">${b.status}</span></td>
      <td style="color:#8A8278;font-size:11px">${b.note || '—'}</td>
    </tr>`).join('')

  printWindow(`Budget — ${wedding.coupleNames}`, `
    <h1>${wedding.coupleNames}</h1>
    <p class="meta">Budget Summary · ${wedding.venue}</p>
    <hr class="divider">
    <table>
      <thead><tr><th>Category</th><th style="text-align:right">Planned</th><th style="text-align:right">Spent</th><th style="text-align:right">Remaining</th><th>Status</th><th>Notes</th></tr></thead>
      <tbody>
        ${rows}
        <tr class="totals-row">
          <td>Total</td>
          <td style="text-align:right">${fmt(total)}</td>
          <td style="text-align:right">${fmt(spent)}</td>
          <td style="text-align:right;color:${remain<0?'#B83A3A':'#1F4D36'}">${fmt(Math.abs(remain))}${remain<0?' over':''}</td>
          <td></td><td></td>
        </tr>
      </tbody>
    </table>
  `, watermark)
}

function printChecklist(state, watermark) {
  const { tasks, wedding } = state
  const phases = ['12+ months', '6–12 months', '3–6 months', '1–3 months', 'Final weeks']
  const done   = tasks.filter(t => t.done).length

  const sections = phases.map(phase => {
    const phaseTasks = tasks.filter(t => t.phase === phase)
    if (!phaseTasks.length) return ''
    const rows = phaseTasks.map(t => `
      <tr>
        <td style="width:20px">${t.done ? '✓' : '○'}</td>
        <td style="color:${t.done?'#8A8278':''};text-decoration:${t.done?'line-through':''}">${t.task}</td>
        <td style="color:#8A8278">${t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'}</td>
      </tr>`).join('')
    return `<h2>${phase}</h2>
      <table><thead><tr><th></th><th>Task</th><th>Due</th></tr></thead>
      <tbody>${rows}</tbody></table>`
  }).join('')

  printWindow(`Checklist — ${wedding.coupleNames}`, `
    <h1>${wedding.coupleNames}</h1>
    <p class="meta">Planning Checklist · ${done} of ${tasks.length} complete</p>
    <hr class="divider">
    ${sections}
  `, watermark)
}

// ── View ──────────────────────────────────────────────────────────────────────

export default function ExportView() {
  const { state } = useApp()
  const { guests, tables, budgetItems, tasks, subscription } = state
  const hasWatermark = LIMITS[subscription]?.exportWatermark ?? true

  const confirmed  = guests.filter(g => g.rsvp === 'confirmed').length
  const seated     = guests.filter(g => g.tableId).length
  const totalSpent = budgetItems.reduce((s, b) => s + b.actual, 0)
  const done       = tasks.filter(t => t.done).length

  const actions = [
    {
      title:  'Guest List',
      desc:   'Full guest list with RSVP status, dietary requirements, side and group.',
      stats:  `${guests.length} guests · ${confirmed} confirmed`,
      action: () => printGuestList(state, hasWatermark),
    },
    {
      title:  'Seating Chart',
      desc:   'All tables with seated guests, capacities and dietary notes.',
      stats:  `${tables.length} tables · ${seated} guests seated`,
      action: () => printSeatingChart(state, hasWatermark),
    },
    {
      title:  'Budget Summary',
      desc:   'Category-by-category breakdown of planned vs. actual spend.',
      stats:  `${budgetItems.length} categories · ${fmt(totalSpent)} spent`,
      action: () => printBudget(state, hasWatermark),
    },
    {
      title:  'Planning Checklist',
      desc:   'All tasks organised by planning phase with due dates.',
      stats:  `${tasks.length} tasks · ${done} complete`,
      action: () => printChecklist(state, hasWatermark),
    },
  ]

  return (
    <FeatureGate minTier="couple" feature="Export & Print">
    <div className="space-y-5 pb-4">

      {/* Header */}
      <div className="pt-2 border-b border-stone-200/60 dark:border-stone-800/40 pb-6">
        <h1 className="view-title">Export</h1>
        <p className="label-luxury mt-1">Print or save any section as a PDF</p>
      </div>

      {/* How it works */}
      <div className="flex items-start gap-3 py-4 border-b border-stone-100 dark:border-stone-800/50">
        <Printer size={13} className="text-stone-400 dark:text-stone-600 mt-0.5 shrink-0" />
        <p className="text-[12.5px] text-stone-500 dark:text-stone-400 leading-relaxed">
          Each export opens a print-optimised page. Use your browser's{' '}
          <strong className="text-stone-700 dark:text-stone-300 font-medium">Save as PDF</strong>{' '}
          option to download.
          {hasWatermark && (
            <span className="block mt-1 text-[11.5px] text-stone-400 dark:text-stone-600">
              Couple plan exports include a "Made with Vow" footer. Upgrade to Premium to remove it.
            </span>
          )}
        </p>
      </div>

      {/* Action list — editorial rows */}
      <motion.div className="space-y-0" variants={fadeList} initial="hidden" animate="show">
        {actions.map((item, idx) => (
          <motion.div
            key={item.title}
            variants={fadeItem}
            className={`flex items-center justify-between gap-4 py-5
                        ${idx < actions.length - 1 ? 'border-b border-stone-100 dark:border-stone-800/50' : ''}`}
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-display italic text-[1.1rem] font-light
                             text-stone-900 dark:text-stone-100 leading-tight">
                {item.title}
              </h3>
              <p className="label-luxury mt-0.5">{item.stats}</p>
              <p className="text-[12.5px] text-stone-400 dark:text-stone-500 mt-1 leading-relaxed">
                {item.desc}
              </p>
            </div>
            <button
              onClick={item.action}
              className="inline-btn shrink-0
                         bg-transparent border border-stone-200/80 dark:border-stone-700/50
                         text-stone-600 dark:text-stone-400
                         hover:border-stone-400 dark:hover:border-stone-500
                         hover:text-stone-900 dark:hover:text-stone-200
                         transition-colors duration-150 gap-2"
            >
              <Download size={12} />
              Print
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
    </FeatureGate>
  )
}
