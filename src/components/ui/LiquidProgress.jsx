import { useRef, useEffect, useId } from 'react'

/**
 * LiquidProgress — horizontal progress bar with a genuine liquid surface.
 *
 * Architecture:
 *
 *   1. Wave = surface — the fill body is the area below a live sine-wave path,
 *      drawn every frame via requestAnimationFrame.
 *
 *   2. Natural right edge — the wave terminates at fill_width; as it scrolls,
 *      that endpoint rises and falls organically.
 *
 *   3. Soft right dissolve — an SVG luminance mask fades the fill from fully
 *      opaque to transparent over the last ~20px. Instead of a hard cut the
 *      liquid simply dissolves into the track, like liquid thinning at a shore.
 *
 *   4. Standing-wave sloshing — wave 1 scrolls right→left, wave 2 scrolls
 *      left→right. Interference creates sloshing rather than flowing current.
 *
 *   5. Golden-ratio frequencies — ω₂ = φ·ω₁. Surface pattern never repeats.
 *
 *   6. Surface sheen — same shape, white-to-transparent gradient overlay,
 *      also faded by the mask so the sheen dissolves with the body.
 */
export default function LiquidProgress({
  pct        = 0,
  height     = 14,
  fillClass  = 'bg-accent dark:bg-accent-dark',
  trackClass = 'bg-stone-200/80 dark:bg-stone-700/50',
  waveColor,   // legacy — not used
  animate    = true,
}) {
  const rawId      = useId()
  const gid        = rawId.replace(/[^a-zA-Z0-9]/g, '_')   // safe for SVG id/url()
  const clamped    = Math.max(0, Math.min(100, pct || 0))
  const colorClass = fillClass.replace(/\bbg-/g, 'text-')  // currentColor inheritance

  const containerRef = useRef(null)
  const bodyPathRef  = useRef(null)
  const sheenPathRef = useRef(null)
  const fadeGradRef  = useRef(null)   // the mask's linear gradient (x1/x2 updated per frame)
  const maskRectRef  = useRef(null)   // the mask rect (width updated per frame)
  const rafRef       = useRef(null)
  const targetPct    = useRef(clamped)
  const currentPct   = useRef(animate ? 0 : clamped)

  useEffect(() => { targetPct.current = clamped }, [clamped])

  // ── ANIMATED CASE ──────────────────────────────────────────────────
  useEffect(() => {
    if (!animate) return

    currentPct.current = 0
    let t = 0, lastTs = null

    function frame(ts) {
      if (!lastTs) lastTs = ts
      const dt = Math.min((ts - lastTs) / 1000, 0.05)
      lastTs = ts
      t += dt

      // Ease-out lerp — fill width settles in ~0.85s
      currentPct.current += (targetPct.current - currentPct.current) * Math.min(1, dt * 5)

      const el = containerRef.current
      if (!el) { rafRef.current = requestAnimationFrame(frame); return }

      const W     = el.clientWidth
      const H     = height
      const fillW = (currentPct.current / 100) * W

      if (!W || fillW < 3) {
        bodyPathRef.current?.setAttribute('d', '')
        sheenPathRef.current?.setAttribute('d', '')
        maskRectRef.current?.setAttribute('width', '0')
        rafRef.current = requestAnimationFrame(frame)
        return
      }

      // ── WAVE MATH ────────────────────────────────────────────────
      const amp = H * 0.17
      const ω1  = (2 * Math.PI) / (fillW * 0.72)
      const ω2  = ω1 * 1.618                        // golden ratio — no repeat
      const φ1  = -(t * ω1 * fillW * 0.13)          // scroll right→left
      const φ2  = +(t * ω2 * fillW * 0.08)          // scroll left→right
      const sY  = H * 0.30                           // mean surface: 30% from top

      const wY = x =>
        sY + amp * Math.sin(ω1 * x + φ1) * 0.58
           + amp * Math.sin(ω2 * x + φ2) * 0.42

      // ── PATH ─────────────────────────────────────────────────────
      const n   = Math.max(24, Math.floor(fillW / 3))
      const pts = Array.from({ length: n + 1 }, (_, i) => {
        const x = (i / n) * fillW
        return [x, wY(x)]
      })

      let d = `M 0,${H} L 0,${pts[0][1].toFixed(2)}`
      for (let i = 0; i < n; i++) {
        const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]
        d += ` Q ${x0.toFixed(2)},${y0.toFixed(2)} ${((x0+x1)/2).toFixed(2)},${((y0+y1)/2).toFixed(2)}`
      }
      const [lx, ly] = pts[n]
      d += ` L ${lx.toFixed(2)},${ly.toFixed(2)} L ${lx.toFixed(2)},${H} Z`

      bodyPathRef.current?.setAttribute('d', d)
      sheenPathRef.current?.setAttribute('d', d)

      // ── RIGHT-EDGE DISSOLVE MASK ──────────────────────────────────
      // Fade zone: last 18% of fill width, capped at 28px.
      // Mask is white (fully visible) to the left of the fade zone,
      // then transitions white → black (luminance mask) to the right.
      const fadeW = Math.min(fillW * 0.18, 28)
      maskRectRef.current?.setAttribute('width',  lx.toFixed(2))
      fadeGradRef.current?.setAttribute('x1', (lx - fadeW).toFixed(2))
      fadeGradRef.current?.setAttribute('x2', lx.toFixed(2))

      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [animate, height])

  // ── STATIC CASE ────────────────────────────────────────────────────
  useEffect(() => {
    if (animate) return
    const el = containerRef.current
    if (!el) return
    const W     = el.clientWidth
    const H     = height
    const fillW = (clamped / 100) * W

    if (fillW < 2) {
      bodyPathRef.current?.setAttribute('d', '')
      sheenPathRef.current?.setAttribute('d', '')
      maskRectRef.current?.setAttribute('width', '0')
      return
    }

    const d = `M 0,0 L ${fillW},0 L ${fillW},${H} L 0,${H} Z`
    bodyPathRef.current?.setAttribute('d', d)
    sheenPathRef.current?.setAttribute('d', d)

    const fadeW = Math.min(fillW * 0.18, 28)
    maskRectRef.current?.setAttribute('width',  fillW.toFixed(2))
    fadeGradRef.current?.setAttribute('x1', (fillW - fadeW).toFixed(2))
    fadeGradRef.current?.setAttribute('x2', fillW.toFixed(2))
  }, [animate, clamped, height])

  return (
    <div
      ref={containerRef}
      className={`relative rounded-xl overflow-hidden ${colorClass} ${trackClass}`}
      style={{ height }}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block', overflow: 'hidden' }}
      >
        <defs>
          {/*
            ── Right-edge dissolve mask ────────────────────────────
            SVG luminance mask: white = fully visible, black = fully hidden.
            The gradient runs from white (at x1 = fillW - fadeW) to black
            (at x2 = fillW). Everything left of x1 is white by default.
            This makes the liquid solid on the left and gradually dissolve
            at the right — no hard cut.
          */}
          <linearGradient
            ref={fadeGradRef}
            id={`lp-fade-${gid}`}
            gradientUnits="userSpaceOnUse"
            x1="0" y1="0" x2="0" y2="0"
          >
            <stop offset="0%"   stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </linearGradient>

          <mask id={`lp-mask-${gid}`}>
            <rect
              ref={maskRectRef}
              x="0" y="0"
              width="0"
              height={height}
              fill={`url(#lp-fade-${gid})`}
            />
          </mask>

          {/*
            ── Surface sheen ───────────────────────────────────────
            Lighter at top of the liquid body, fades to transparent
            downward. Simulates light reflecting off the liquid surface.
          */}
          <linearGradient id={`lp-sheen-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.26)" />
            <stop offset="50%"  stopColor="rgba(255,255,255,0.07)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)"    />
          </linearGradient>
        </defs>

        {/* Liquid fill body — area below the wave, masked to dissolve at right */}
        <path
          ref={bodyPathRef}
          fill="currentColor"
          mask={`url(#lp-mask-${gid})`}
        />

        {/* Surface sheen — same shape, also dissolved by the mask */}
        <path
          ref={sheenPathRef}
          fill={`url(#lp-sheen-${gid})`}
          mask={`url(#lp-mask-${gid})`}
          style={{ pointerEvents: 'none' }}
        />
      </svg>
    </div>
  )
}
