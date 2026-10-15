import { clsx } from 'clsx'

interface Props {
  size?: number
  /** Animate the ball on hover (for nav usage). */
  animate?: boolean
  className?: string
}

/**
 * Minimalist tennis logo — racket head silhouette with a tennis ball
 * suspended on its strings. Pure SVG, no external assets.
 *
 * The signature tennis-yellow ball (Pantone 16-0840 / #ccff00) is the only
 * accent color; the racket frame stays neutral so the logo blends with both
 * the navbar and the brand text.
 */
export function Logo({ size = 32, animate = false, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('flex-shrink-0', className)}
      aria-label="Tennis Analytics"
    >
      {/* Racket head — slightly tilted oval frame */}
      <g transform="rotate(-25 20 20)">
        {/* Outer frame */}
        <ellipse
          cx="20" cy="16"
          rx="11" ry="13"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          opacity="0.85"
        />
        {/* Strings — vertical */}
        <g stroke="currentColor" strokeWidth="0.7" opacity="0.4">
          <line x1="14" y1="5"  x2="14" y2="27" />
          <line x1="17" y1="4"  x2="17" y2="28" />
          <line x1="20" y1="3"  x2="20" y2="29" />
          <line x1="23" y1="4"  x2="23" y2="28" />
          <line x1="26" y1="5"  x2="26" y2="27" />
        </g>
        {/* Strings — horizontal */}
        <g stroke="currentColor" strokeWidth="0.7" opacity="0.4">
          <line x1="9.5"  y1="11" x2="30.5" y2="11" />
          <line x1="9"    y1="14" x2="31"   y2="14" />
          <line x1="9"    y1="17" x2="31"   y2="17" />
          <line x1="9.5"  y1="20" x2="30.5" y2="20" />
          <line x1="11"   y1="23" x2="29"   y2="23" />
        </g>
        {/* Throat */}
        <path
          d="M 14 28 L 18 33 M 26 28 L 22 33"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.85"
        />
        {/* Handle */}
        <line
          x1="20" y1="33" x2="20" y2="38"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.85"
        />
      </g>

      {/* Tennis ball — top right, perched on the racket */}
      <g
        className={clsx(animate && 'group-hover:animate-ball-bounce origin-bottom')}
        style={{ transformOrigin: '30px 12px' }}
      >
        <circle cx="30" cy="11" r="5" fill="#ccff00" />
        {/* Curved seam */}
        <path
          d="M 25.2 12.5 Q 30 8 34.8 12.5"
          fill="none"
          stroke="#a3d600"
          strokeWidth="0.8"
          opacity="0.7"
        />
        <path
          d="M 25.2 9.5 Q 30 14 34.8 9.5"
          fill="none"
          stroke="#a3d600"
          strokeWidth="0.8"
          opacity="0.7"
        />
        {/* Subtle highlight */}
        <ellipse cx="28.5" cy="9.5" rx="1.2" ry="0.8" fill="white" opacity="0.4" />
      </g>
    </svg>
  )
}
