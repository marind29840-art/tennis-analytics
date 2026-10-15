/**
 * Animated tennis-ball loading indicator.
 * The ball drops, squashes on impact (the shadow widens), then bounces back up.
 */
interface Props {
  size?: number
  label?: string
}

export function BouncingBall({ size = 24, label }: Props) {
  return (
    <div className="inline-flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size * 1.6 }}>
        {/* The ball */}
        <div
          className="absolute left-0 right-0 mx-auto rounded-full bg-ball-300 animate-ball-bounce"
          style={{
            width: size,
            height: size,
            boxShadow: '0 0 12px rgba(204, 255, 0, 0.4)',
            background: 'radial-gradient(circle at 35% 35%, #e0ff52 0%, #ccff00 60%, #a3d600 100%)',
          }}
        >
          {/* Seam */}
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d="M 4 14 Q 12 8 20 14"
              fill="none"
              stroke="#7ba600"
              strokeWidth="0.8"
              opacity="0.6"
            />
            <path
              d="M 4 10 Q 12 16 20 10"
              fill="none"
              stroke="#7ba600"
              strokeWidth="0.8"
              opacity="0.6"
            />
          </svg>
        </div>
        {/* Shadow */}
        <div
          className="absolute left-0 right-0 mx-auto rounded-full bg-ball-300/20 blur-sm"
          style={{
            width: size * 0.7,
            height: 4,
            bottom: 0,
            animation: 'bounce 0.8s ease-in-out infinite reverse',
          }}
        />
      </div>
      {label && <span className="text-xs text-slate-400">{label}</span>}
    </div>
  )
}
