interface ProbabilityBarProps {
  p1Name: string
  p2Name: string
  p1Prob: number
  p2Prob: number
  p1BookmakerProb?: number
  p2BookmakerProb?: number
}

export function ProbabilityBar({ p1Name, p2Name, p1Prob, p2Prob, p1BookmakerProb, p2BookmakerProb }: ProbabilityBarProps) {
  const p1Pct = Math.round(p1Prob * 100)
  const p2Pct = Math.round(p2Prob * 100)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-300 font-medium w-32 truncate text-right">{p1Name.split(' ').pop()}</span>
        <div className="flex-1 h-7 bg-slate-800 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-500 flex items-center justify-end pr-2"
            style={{ width: `${p1Pct}%` }}
          >
            {p1Pct >= 20 && <span className="text-white text-xs font-bold">{p1Pct}%</span>}
          </div>
        </div>
        <span className="text-slate-300 font-medium w-32 truncate">{p2Name.split(' ').pop()}</span>
      </div>

      {/* Bookmaker comparison */}
      {p1BookmakerProb && (
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="w-32 text-right">Bookmaker</span>
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-600 transition-all duration-500"
              style={{ width: `${Math.round(p1BookmakerProb * 100)}%` }}
            />
          </div>
          <span className="w-32">{Math.round((p2BookmakerProb || 0) * 100)}%</span>
        </div>
      )}
    </div>
  )
}
