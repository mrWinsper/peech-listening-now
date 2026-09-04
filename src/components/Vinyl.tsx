import { useId } from 'react'

interface Props {
  size: number
  /** Label colour. Omit for the plain black record Peech uses for local files. */
  hue?: number
  spinning?: boolean
  paused?: boolean
  /** Seconds per revolution. Slow by default: ambient, not attention-grabbing. */
  speed?: number
  className?: string
}

/**
 * The Peech record. Every item in the library is a vinyl; a record that spins
 * is one that is being listened to right now.
 */
export function Vinyl({ size, hue, spinning = false, paused = false, speed = 7, className }: Props) {
  const id = useId()
  const labelFill = hue === undefined ? '#1d1d1f' : `hsl(${hue} 62% 46%)`
  const labelInk = hue === undefined ? '#3a3a3c' : `hsl(${hue} 70% 30%)`

  const cls = ['vinyl', spinning ? 'vinyl--spin' : '', paused ? 'vinyl--paused' : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <svg
      className={cls}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ '--spin-dur': `${speed}s` } as React.CSSProperties}
      aria-hidden
    >
      <defs>
        <radialGradient id={`${id}-disc`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="60%" stopColor="#0d0d0d" />
          <stop offset="100%" stopColor="#050505" />
        </radialGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="49" fill={`url(#${id}-disc)`} />
      {/* grooves */}
      {[44, 40, 36, 32, 28, 24].map((r) => (
        <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#2a2a2a" strokeWidth="0.6" />
      ))}
      <circle cx="50" cy="50" r="49" fill={`url(#${id}-sheen)`} />
      {/* label */}
      <circle cx="50" cy="50" r="19" fill={labelFill} />
      <circle cx="50" cy="50" r="19" fill="none" stroke={labelInk} strokeWidth="1" />
      <circle cx="50" cy="50" r="12" fill="none" stroke={labelInk} strokeWidth="0.8" opacity="0.7" />
      <circle cx="50" cy="50" r="3" fill="#0a0a0a" />
    </svg>
  )
}
