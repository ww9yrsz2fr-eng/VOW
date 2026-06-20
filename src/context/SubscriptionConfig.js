// ── Subscription tier definitions ────────────────────────────────────────────
// Single source of truth for what each tier can access.
// Remove TierToggle and set a real tier from your payment provider in production.

export const TIER_ORDER = { free: 0, couple: 1, premium: 2 }

// Returns true if the user's current tier meets or exceeds the required tier
export function hasAccess(currentTier, requiredTier) {
  return TIER_ORDER[currentTier] >= TIER_ORDER[requiredTier]
}

export const TIER_LABELS = {
  free:    'Free',
  couple:  'Couple',
  premium: 'Premium',
}

export const LIMITS = {
  free: {
    budgetItems: 10,
    guests: 100,
    canAddChecklistTasks: false,
    seating: false,
    vendors: false,
    timeline: false,
    export: false,
  },
  couple: {
    budgetItems: Infinity,
    guests: Infinity,
    canAddChecklistTasks: true,
    seating: true,
    vendors: true,
    timeline: true,
    export: true,           // with "Powered by Vow" watermark note
    exportWatermark: true,
  },
  premium: {
    budgetItems: Infinity,
    guests: Infinity,
    canAddChecklistTasks: true,
    seating: true,
    vendors: true,
    timeline: true,
    export: true,
    exportWatermark: false,  // no watermark
  },
}

// Pricing — used in upgrade prompts
export const TIER_PRICING = {
  couple:  { monthly: 9,  label: '$9 / month' },
  premium: { monthly: 19, label: '$19 / month' },
}

// What each paid tier unlocks — used in upgrade prompts
export const UPGRADE_FEATURES = {
  couple: [
    'Unlimited budget items',
    'Unlimited guests',
    'Seating chart & table management',
    'Vendor tracker',
    'Day-of timeline',
    'Print & export',
    'Custom checklist tasks',
  ],
  premium: [
    'Everything in Couple',
    'Export without Vow watermark',
    'Priority support',
  ],
}
