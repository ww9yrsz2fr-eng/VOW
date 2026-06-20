/**
 * SimpleProgress — two variants:
 *
 *  variant="signature" (default)
 *    The Vow signature: a hand-drawn pen stroke with a gold wedding ring
 *    riding the leading edge. Use for all primary progress bars.
 *
 *  variant="bar"
 *    Thin pill bar. Use only for layered/stacked indicators (e.g. Budget
 *    payment split) where two bars overlap and the ring would be confusing.
 *
 * Props (signature variant):
 *   pct       — 0–100
 *   height    — rendered height in px (default 22)
 *   animate   — whether to ease on change (default true)
 *   onDark    — true when bar sits on a dark hero card; switches line to cream
 *   ringBg    — CSS colour string for the ring interior (default: CSS var
 *               --vow-ring-bg, which flips with dark mode)
 *   stroke    — override line colour (e.g. '#FF5A5F' for alert/over-budget)
 */

import { useRef, useEffect, useState } from 'react'
import ringImg from '../../assets/ring.svg'

const SIG_PATH =
  'M4,10 C45,6 85,14 125,10 C165,6 205,14 245,10 ' +
  'C285,6 325,14 365,10 C405,6 445,13 485,10 ' +
  'C515,8 538,11 556,10'

const FLOURISH = 'M556,10 C562,7 566,4 562,2'

function Signature({ pct, animate, onDark = false, ringBg, stroke }) {
  const lineRef = useRef(null)
  const [len, setLen]   = useState(580)
  const [pos, setPos]   = useState({ x: 4, y: 10 })

  useEffect(() => {
    if (lineRef.current) setLen(lineRef.current.getTotalLength())
  }, [])

  useEffect(() => {
    if (!lineRef.current || len <= 0) return
    const drawn = len * (pct / 100)
    const pt = lineRef.current.getPointAtLength(Math.max(1, drawn))
    setPos({ x: pt.x, y: pt.y })
  }, [pct, len])

  const offset  = len - len * (pct / 100)
  const ease    = 'cubic-bezier(0.25,1,0.25,1)'
  const dur     = '0.9s'
  const trans   = animate ? `transform ${dur} ${ease}` : 'none'
  const lineTr  = animate ? `stroke-dashoffset ${dur} ${ease}` : 'none'
  const show    = pct > 1

  // Line colour: explicit stroke > onDark cream > Tailwind accent class
  const lineColor = stroke
    ? stroke
    : onDark
      ? 'rgba(247,245,241,0.75)'
      : null   // null → use className below

  // Track colour
  const trackColor = onDark
    ? 'rgba(255,255,255,0.12)'
    : 'rgba(74,107,88,0.13)'

  // Ring interior — punches through the line so the gold band is crisp
  const ringFill = ringBg || 'var(--vow-ring-bg,#F7F5F1)'

  return (
    <>
      {/* Ghost track */}
      <path
        d={SIG_PATH} fill="none" strokeWidth="2" strokeLinecap="round"
        stroke={trackColor}
      />

      {/* Drawn signature line */}
      <path
        ref={lineRef}
        d={SIG_PATH} fill="none" strokeLinecap="round" strokeWidth="2.5"
        stroke={lineColor || undefined}
        className={!lineColor ? 'stroke-accent dark:stroke-accent-dark' : undefined}
        strokeDasharray={len}
        strokeDashoffset={offset}
        style={{ transition: lineTr }}
      />

      {/* Warm aura glow */}
      {show && (
        <circle cx={0} cy={0} r={14} fill="none"
          stroke="#C9A55A" strokeWidth={11} strokeOpacity={0.1}
          style={{ transform: `translate(${pos.x}px,${pos.y}px)`, transition: trans }}
        />
      )}

      {/* Interior mask — circle, centred on line, covers hole */}
      {show && (
        <circle cx={0} cy={0} r={5.5}
          style={{ fill: ringFill, transform: `translate(${pos.x}px,${pos.y}px)`, transition: trans }}
        />
      )}

      {/* Ring image — 2D flat gold wedding band, hole centred on the line */}
      {show && (
        <image
          href={ringImg}
          x={-13} y={-13} width={26} height={26}
          style={{ transform: `translate(${pos.x}px,${pos.y}px)`, transition: trans }}
        />
      )}

      {/* Flourish curl that appears at 100% */}
      <path
        d={FLOURISH} fill="none" strokeLinecap="round" strokeWidth={1.8}
        stroke={lineColor || undefined}
        className={!lineColor ? 'stroke-accent dark:stroke-accent-dark' : undefined}
        style={{ opacity: pct >= 99 ? 1 : 0, transition: 'opacity 0.5s 0.15s' }}
      />
    </>
  )
}

export default function SimpleProgress({
  pct        = 0,
  height     = 22,
  fillClass  = 'bg-accent dark:bg-accent-dark',
  trackClass = 'bg-stone-200/70 dark:bg-stone-700/40',
  animate    = true,
  variant    = 'signature',
  onDark     = false,
  ringBg,
  stroke,
}) {
  const clamped = Math.max(0, Math.min(100, pct || 0))

  if (variant === 'bar') {
    return (
      <div
        className={`relative rounded-full overflow-hidden ${trackClass}`}
        style={{ height }}
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full ${fillClass} ${animate ? 'transition-[width] duration-700 ease-out' : ''}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    )
  }

  return (
    <svg
      viewBox="0 0 560 20"
      width="100%"
      style={{ height, display: 'block', overflow: 'visible' }}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <Signature pct={clamped} animate={animate} onDark={onDark} ringBg={ringBg} stroke={stroke} />
    </svg>
  )
}
