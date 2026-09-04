import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

const base = (size: number, p: P) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...p,
})

export const SearchIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={2.4}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

export const PersonIcon = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} fill="currentColor" stroke="none">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 4.2a3.3 3.3 0 1 1 0 6.6 3.3 3.3 0 0 1 0-6.6Zm0 13.2a7.6 7.6 0 0 1-5.7-2.6c.2-2 3.8-3.1 5.7-3.1s5.5 1.1 5.7 3.1A7.6 7.6 0 0 1 12 19.4Z" />
  </svg>
)

export const PlusIcon = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={2.2}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const DotsIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)} fill="currentColor" stroke="none">
    <circle cx="6" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="18" cy="12" r="1.8" />
  </svg>
)

export const PlayIcon = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} fill="currentColor" stroke="none">
    <path d="M7 4.5v15l12-7.5L7 4.5Z" />
  </svg>
)

export const PauseIcon = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} fill="currentColor" stroke="none">
    <rect x="6" y="4" width="4.5" height="16" rx="1" />
    <rect x="13.5" y="4" width="4.5" height="16" rx="1" />
  </svg>
)

export const BookmarkIcon = ({ size = 20, filled = false, ...p }: P & { filled?: boolean }) => (
  <svg {...base(size, p)} fill={filled ? 'currentColor' : 'none'}>
    <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.2L5 21V4.5a1 1 0 0 1 1-1Z" />
  </svg>
)

export const ChevronDownIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={2.4}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export const CheckIcon = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={2.6}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

export const SkipIcon = ({ size = 28, dir = 1, ...p }: P & { dir?: 1 | -1 }) => (
  <svg {...base(size, p)} strokeWidth={1.8}>
    <g transform={dir === -1 ? 'scale(-1 1) translate(-24 0)' : undefined}>
      <path d="M12 4a8 8 0 1 1-7.4 5" />
      <path d="M4 4v5h5" transform="rotate(180 6.5 6.5)" />
    </g>
    <text x="12" y="15" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor" stroke="none">15</text>
  </svg>
)

export const SyncFailIcon = ({ size = 30, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={1.8}>
    <path d="M20 12a8 8 0 0 1-13.6 5.7" />
    <path d="M4 12a8 8 0 0 1 13.6-5.7" />
    <path d="M3.5 15.5 6.4 17.7l2.3-2.9" />
    <path d="M20.5 8.5 17.6 6.3l-2.3 2.9" />
    <path d="M12 8.5v4.2M12 15.4v.2" strokeWidth={2.2} />
  </svg>
)

export const WifiIcon = ({ size = 17, ...p }: P) => (
  <svg {...base(size, p)} fill="currentColor" stroke="none">
    <path d="M12 18.5a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Zm-4-3.6 1.6 1.6a3.4 3.4 0 0 1 4.8 0l1.6-1.6a5.6 5.6 0 0 0-8 0Zm-3.3-3.3 1.6 1.6a8 8 0 0 1 11.4 0l1.6-1.6a10.3 10.3 0 0 0-14.6 0ZM1.5 8.3l1.6 1.6a12.7 12.7 0 0 1 17.8 0l1.6-1.6a15 15 0 0 0-21 0Z" />
  </svg>
)

export const SignalIcon = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p)} fill="currentColor" stroke="none">
    <rect x="2" y="14" width="3.5" height="6" rx="1" />
    <rect x="7.5" y="11" width="3.5" height="9" rx="1" />
    <rect x="13" y="7.5" width="3.5" height="12.5" rx="1" />
    <rect x="18.5" y="4" width="3.5" height="16" rx="1" />
  </svg>
)

export const BatteryIcon = ({ size = 26, ...p }: P) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 26 13" fill="none" aria-hidden {...p}>
    <rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="currentColor" opacity="0.5" />
    <rect x="2" y="2" width="18" height="9" rx="2.2" fill="currentColor" />
    <path d="M23.5 4.5v4a2 2 0 0 0 0-4Z" fill="currentColor" opacity="0.5" />
  </svg>
)
