import { useApp } from '../../context/AppContext'
import { hasAccess, UPGRADE_FEATURES, TIER_LABELS, TIER_PRICING } from '../../context/SubscriptionConfig'

/**
 * Wraps content that requires a minimum subscription tier.
 * If the user's tier doesn't meet the requirement, renders an editorial upgrade prompt.
 *
 * Props:
 *   minTier  — 'couple' | 'premium'
 *   feature  — short label used in the prompt title (e.g. "Vendor Tracker")
 *   children — content to show when access is granted
 */
export default function FeatureGate({ minTier = 'couple', feature = 'this feature', children }) {
  const { state, dispatch } = useApp()
  const { subscription } = state

  if (hasAccess(subscription, minTier)) {
    return children
  }

  const features = UPGRADE_FEATURES[minTier] || []
  const pricing  = TIER_PRICING[minTier]

  // Dev shortcut — promote tier without payment
  const handleUpgrade = () => {
    dispatch({ type: 'SET_SUBSCRIPTION', payload: minTier })
  }

  return (
    <div className="space-y-10 pb-4 pt-2">

      {/* Eyebrow */}
      <div className="border-b border-stone-200/60 dark:border-stone-800/40 pb-6">
        <p className="eyebrow mb-2">{TIER_LABELS[minTier]} plan</p>
        <h1 className="view-title">{feature}</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 leading-relaxed max-w-[440px]">
          This section is included in the {TIER_LABELS[minTier]} plan.
          Everything you need to plan your day, in one place.
        </p>
      </div>

      {/* Feature list */}
      {features.length > 0 && (
        <div>
          <p className="label-luxury mb-4">What's included</p>
          <div className="space-y-0">
            {features.map((f, i) => (
              <div
                key={f}
                className={`flex items-center justify-between py-3.5
                            ${i < features.length - 1 ? 'border-b border-stone-100 dark:border-stone-800/50' : ''}`}
              >
                <span className="text-[13.5px] text-stone-700 dark:text-stone-300">{f}</span>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
                     className="text-accent dark:text-accent-dark shrink-0">
                  <path d="M2 6.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing + CTA */}
      <div className="border-t border-stone-200/60 dark:border-stone-800/40 pt-6 space-y-4">
        {pricing && (
          <div className="flex items-baseline gap-2">
            <span className="font-display italic text-[2rem] font-light
                             text-stone-900 dark:text-stone-100 leading-none">
              {pricing.label}
            </span>
            <span className="text-xs text-stone-400 dark:text-stone-600 tracking-[0.08em] uppercase">
              billed monthly
            </span>
          </div>
        )}

        <button
          onClick={handleUpgrade}
          className="inline-btn bg-stone-900 dark:bg-stone-100
                     text-stone-100 dark:text-stone-900
                     hover:bg-stone-700 dark:hover:bg-stone-300
                     transition-colors duration-150"
        >
          Unlock {TIER_LABELS[minTier]}
        </button>

        <p className="text-[11px] text-stone-400 dark:text-stone-600 tracking-[0.04em]">
          Use the tier toggle (bottom-right) to preview all plan levels during development.
        </p>
      </div>
    </div>
  )
}
