import { ScoreGauge } from '@/components/ui/ScoreGauge'
import { getFormTrendIcon, getFormTrendColor } from '@/lib/utils'
import type { FormData } from '@/lib/types'

interface FormModuleProps {
  playerName: string
  data: FormData
}

export function FormModule({ playerName, data }: FormModuleProps) {
  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300">{playerName} — Forme</h3>
        <span className={`text-sm font-bold ${getFormTrendColor(data.trend)}`}>
          {getFormTrendIcon(data.trend)} {data.trend === 'improving' ? 'En progression' : data.trend === 'declining' ? 'En déclin' : 'Stable'}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <ScoreGauge score={data.form_score} label="Forme" size="md" />

        <div className="flex-1 space-y-3">
          {/* Last 5 */}
          <div>
            <div className="text-xs text-slate-500 mb-1">5 derniers matchs</div>
            <div className="flex gap-1">
              {data.last_5.map((r, i) => (
                <span
                  key={i}
                  className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold ${
                    r.result === 'W'
                      ? 'bg-emerald-900 text-emerald-300 border border-emerald-700'
                      : 'bg-red-900 text-red-300 border border-red-700'
                  }`}
                  title={`${r.result === 'W' ? 'Victoire' : 'Défaite'} vs ${r.opponent_name} (${r.score})`}
                >
                  {r.result}
                </span>
              ))}
            </div>
          </div>

          {/* Avg opponent ranking */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-slate-500">Classement moyen adversaires (5)</div>
              <div className="text-slate-200 font-mono font-medium">#{Math.round(data.avg_opponent_ranking_last_5)}</div>
            </div>
            <div>
              <div className="text-slate-500">Classement moyen adversaires (10)</div>
              <div className="text-slate-200 font-mono font-medium">#{Math.round(data.avg_opponent_ranking_last_10)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Last 10 mini timeline */}
      <div>
        <div className="text-xs text-slate-500 mb-1">10 derniers matchs</div>
        <div className="flex gap-0.5">
          {data.last_10.map((r, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-sm ${r.result === 'W' ? 'bg-emerald-600' : 'bg-red-700'}`}
              title={`${r.result === 'W' ? 'V' : 'D'} vs ${r.opponent_name}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
