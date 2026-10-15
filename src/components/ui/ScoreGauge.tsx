interface ScoreGaugeProps {
  score: number
  label: string
  size?: 'sm' | 'md' | 'lg'
}

export function ScoreGauge({ score, label, size = 'md' }: ScoreGaugeProps) {
  const color = score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  const radius = size === 'lg' ? 40 : size === 'md' ? 30 : 22
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - score / 100)
  const svgSize = (radius + 12) * 2

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="-rotate-90" style={{ position: 'absolute', top: 0, left: 0 }}>
          <circle
            cx={svgSize / 2} cy={svgSize / 2} r={radius}
            fill="none" stroke="#1e293b" strokeWidth="8"
          />
          <circle
            cx={svgSize / 2} cy={svgSize / 2} r={radius}
            fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-bold tabular-nums"
            style={{ color, fontSize: size === 'lg' ? '1.25rem' : size === 'md' ? '0.95rem' : '0.75rem' }}
          >
            {Math.round(score)}
          </span>
        </div>
      </div>
      <div className="text-slate-400 text-xs text-center leading-tight">{label}</div>
    </div>
  )
}
