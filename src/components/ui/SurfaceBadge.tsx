import { clsx } from 'clsx'

interface Props {
  surface: string
  size?: 'sm' | 'md'
  /** Hide label — show icon only */
  iconOnly?: boolean
}

const SURFACE_META: Record<string, { color: string; label: string; bg: string; ring: string }> = {
  clay:   { color: '#c66d3c', label: 'Terre', bg: 'bg-orange-950/40', ring: 'border-orange-900/60 text-orange-300' },
  hard:   { color: '#1f5fa8', label: 'Hard',  bg: 'bg-blue-950/40',   ring: 'border-blue-900/60 text-blue-300' },
  grass:  { color: '#3c8c3a', label: 'Gazon', bg: 'bg-emerald-950/40', ring: 'border-emerald-900/60 text-emerald-300' },
  carpet: { color: '#7c3aed', label: 'Indoor', bg: 'bg-purple-950/40', ring: 'border-purple-900/60 text-purple-300' },
}

/**
 * Mini tennis court SVG — colored by surface with white court lines.
 * The doubles tramlines + service boxes are drawn so the icon reads as
 * "tennis court" even at 14px.
 */
function CourtIcon({ surfaceColor, size = 14 }: { surfaceColor: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
      aria-hidden
    >
      {/* Court rectangle */}
      <rect x="2" y="3" width="16" height="14" fill={surfaceColor} rx="0.5" />
      {/* Doubles tramlines */}
      <line x1="3.5" y1="3" x2="3.5" y2="17" stroke="white" strokeWidth="0.4" opacity="0.85" />
      <line x1="16.5" y1="3" x2="16.5" y2="17" stroke="white" strokeWidth="0.4" opacity="0.85" />
      {/* Singles sidelines */}
      <line x1="2"  y1="3" x2="18" y2="3"  stroke="white" strokeWidth="0.4" opacity="0.85" />
      <line x1="2"  y1="17" x2="18" y2="17" stroke="white" strokeWidth="0.4" opacity="0.85" />
      {/* Net */}
      <line x1="2" y1="10" x2="18" y2="10" stroke="white" strokeWidth="0.6" opacity="0.95" />
      {/* Service line top */}
      <line x1="3.5" y1="6.5" x2="16.5" y2="6.5" stroke="white" strokeWidth="0.3" opacity="0.7" />
      {/* Service line bottom */}
      <line x1="3.5" y1="13.5" x2="16.5" y2="13.5" stroke="white" strokeWidth="0.3" opacity="0.7" />
      {/* Center service line */}
      <line x1="10" y1="6.5" x2="10" y2="13.5" stroke="white" strokeWidth="0.3" opacity="0.7" />
    </svg>
  )
}

export function SurfaceBadge({ surface, size = 'sm', iconOnly = false }: Props) {
  const key = surface.toLowerCase()
  const meta = SURFACE_META[key] || SURFACE_META.hard
  const iconSize = size === 'md' ? 16 : 13

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-md border font-medium',
        size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]',
        meta.bg,
        meta.ring,
      )}
      title={surface}
    >
      <CourtIcon surfaceColor={meta.color} size={iconSize} />
      {!iconOnly && <span>{meta.label}</span>}
    </span>
  )
}
