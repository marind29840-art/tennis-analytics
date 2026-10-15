import { ScoreGauge } from '@/components/ui/ScoreGauge'
import type { FatigueData } from '@/lib/types'
import { formatMatchDate } from '@/lib/utils'

interface FatigueModuleProps {
  playerName: string
  data: FatigueData
}

export function FatigueModule({ playerName, data }: FatigueModuleProps) {
  const freshnessScore = Math.max(0, 100 - data.fatigue_score)
  const fatigueLabel =
    data.fatigue_score < 35 ? 'Frais' :
    data.fatigue_score < 65 ? 'Modérément fatigué' : 'Fatigué'

  return (
    <div className="card p-4 space-y-4">
      <h3 className="text-sm font-semibold text-slate-300">{playerName} — Fatigue</h3>

      <div className="flex items-center gap-6">
        <ScoreGauge score={data.fatigue_score} label="Fatigue" size="md" />
        <ScoreGauge score={freshnessScore} label="Fraîcheur" size="md" />
        <div className="flex-1 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">État</span>
            <span className={`font-medium ${data.fatigue_score < 35 ? 'text-emerald-400' : data.fatigue_score < 65 ? 'text-amber-400' : 'text-red-400'}`}>
              {fatigueLabel}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Matchs (7j)</span>
            <span className="text-slate-200 font-mono">{data.matches_last_7_days}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Matchs (14j)</span>
            <span className="text-slate-200 font-mono">{data.matches_last_14_days}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Repos depuis dernier match</span>
            <span className={`font-mono font-medium ${data.rest_days_since_last_match >= 2 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {data.rest_days_since_last_match}j
            </span>
          </div>
        </div>
      </div>

      {/* Recent schedule */}
      {data.recent_matches && data.recent_matches.length > 0 && (
        <div>
          <div className="text-xs text-slate-500 mb-2">Calendrier récent</div>
          <div className="space-y-1">
            {data.recent_matches.slice(0, 5).map((m, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50 last:border-0">
                <span className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold ${
                  m.result === 'W' ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'
                }`}>{m.result}</span>
                <span className="text-slate-400 flex-1 mx-2 truncate">{m.tournament_name}</span>
                {m.duration_minutes && (
                  <span className="text-slate-600 mr-2">{m.duration_minutes}min</span>
                )}
                <span className="text-slate-600">{formatMatchDate(m.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
