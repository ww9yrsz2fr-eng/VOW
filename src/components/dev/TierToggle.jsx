/**
 * DEV ONLY — Remove before production.
 *
 * A floating pill in the bottom-right corner that lets you switch between
 * subscription tiers to preview gating behaviour across the app.
 */
import { useApp } from '../../context/AppContext'
import { TIER_LABELS } from '../../context/SubscriptionConfig'

const TIERS = ['free', 'couple', 'premium']

const TIER_COLORS = {
  free:    'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200',
  couple:  'bg-accent/15 text-accent dark:bg-accent/20 dark:text-accent-dark',
  premium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
}

const TIER_ACTIVE_COLORS = {
  free:    'bg-stone-700 dark:bg-stone-300 text-white dark:text-stone-900',
  couple:  'bg-accent text-white',
  premium: 'bg-amber-500 text-white',
}

export default function TierToggle() {
  const { state, dispatch } = useApp()
  const { subscription } = state

  const set = (tier) => dispatch({ type: 'SET_SUBSCRIPTION', payload: tier })

  return (
    <div
      className="fixed bottom-[72px] right-4 sm:bottom-6 z-50
                 flex flex-col items-end gap-1.5"
      role="region"
      aria-label="Dev tier toggle"
    >
      {/* Label */}
      <span className="text-[10px] font-medium tracking-[0.08em] uppercase
                       text-stone-400 dark:text-stone-600 pr-0.5">
        DEV · Tier
      </span>

      {/* Pill group */}
      <div className="flex rounded-[8px] overflow-hidden border border-stone-200/80 dark:border-stone-700/60
                      shadow-md bg-stone-50 dark:bg-stone-900">
        {TIERS.map((tier, i) => (
          <button
            key={tier}
            onClick={() => set(tier)}
            className={`
              px-3 py-[6px] text-[11.5px] font-medium transition-colors duration-120
              ${i > 0 ? 'border-l border-stone-200/80 dark:border-stone-700/60' : ''}
              ${subscription === tier
                ? TIER_ACTIVE_COLORS[tier]
                : TIER_COLORS[tier]
              }
            `}
          >
            {TIER_LABELS[tier]}
          </button>
        ))}
      </div>
    </div>
  )
}
