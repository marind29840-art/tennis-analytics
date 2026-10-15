import type { StreakInfo } from '@/lib/types'

interface StreakModuleProps {
  playerName: string
  streak: StreakInfo
}

export function StreakModule({ playerName, streak }: StreakModuleProps) {
  const isWinning = streak.streak_type === 'win'
  const continuePct = isWinning
    ? Math.max(10, 80 - streak.streak_length * 8)
    : Math.max(10, 70 - streak.streak_length * 6)

  return (
    <div className="card p-4 space-y-4">
      <h3 className="text-sm font-semibold text-slate-300">{playerName} — Série</h3>

      <div className="flex items-center gap-4">
        <div className={`text-4xl font-bold font-mono ${isWinning ? 'text-emerald-400' : 'text-red-400'}`}>
          {streak.streak_length}
        </div>
        <div>
          <div className={`text-sm font-semibold ${isWinning ? 'text-emerald-300' : 'text-red-300'}`}>
            {isWinning ? '🔥 Série de victoires' : '📉 Série de défaites'}
          </div>
          {streak.surface && (
            <div className="text-xs text-slate-500">Sur surface: {streak.surface}</div>
          )}
        </div>
      </div>

      {streak.is_misleading && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-950 border border-amber-800 text-xs text-amber-300">
          <span>⚠️</span>
          <span>Série potentiellement trompeuse — adversaires classement moyen #{Math.round(streak.avg_opponent_ranking || 0)}</span>
        </div>
      )}

      <div>
        <div className="text-xs text-slate-500 mb-1">Probabilité de continuer la série</div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isWinning ? 'bg-emerald-600' : 'bg-red-700'}`}
            style={{ width: `${continuePct}%` }}
          />
        </div>
        <div className="text-xs text-slate-400 mt-1">{continuePct}%</div>
      </div>

      {streak.context && (
        <p className="text-xs text-slate-400 border-t border-slate-800 pt-3">{streak.context}</p>
      )}
    </div>
  )
}
