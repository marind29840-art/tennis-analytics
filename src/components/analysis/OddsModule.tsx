import type { OddsInfo, PredictionInfo } from '@/lib/types'
import { formatOdds, formatProb, formatEdge } from '@/lib/utils'

interface OddsModuleProps {
  p1Name: string
  p2Name: string
  odds: OddsInfo
  prediction?: PredictionInfo
}

export function OddsModule({ p1Name, p2Name, odds, prediction }: OddsModuleProps) {
  return (
    <div className="space-y-4">
      {/* Current odds */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Cotes actuelles</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-slate-500 mb-1">{p1Name.split(' ').pop()}</div>
            <div className="text-3xl font-bold font-mono text-slate-100">{formatOdds(odds.p1_current)}</div>
            <div className="text-xs text-slate-500 mt-1">Prob. implicite: {formatProb(odds.p1_implied_prob)}</div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-slate-600 text-xs font-bold">VS</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">{p2Name.split(' ').pop()}</div>
            <div className="text-3xl font-bold font-mono text-slate-100">{formatOdds(odds.p2_current)}</div>
            <div className="text-xs text-slate-500 mt-1">Prob. implicite: {formatProb(odds.p2_implied_prob)}</div>
          </div>
        </div>
        <div className="mt-3 text-center text-xs text-slate-600">
          Marge bookmaker: {(odds.margin * 100).toFixed(1)}%
        </div>
      </div>

      {/* Opening vs current */}
      {(odds.p1_opening || odds.p2_opening) && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Évolution des cotes</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">{p1Name.split(' ').pop()}</div>
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-xs text-slate-600">Ouverture</div>
                  <div className="font-mono text-slate-400">{odds.p1_opening ? formatOdds(odds.p1_opening) : '—'}</div>
                </div>
                <div className="text-slate-700">→</div>
                <div>
                  <div className="text-xs text-slate-600">Actuel</div>
                  <div className="font-mono text-slate-200 font-semibold">{formatOdds(odds.p1_current)}</div>
                </div>
                {odds.p1_opening && (
                  <div className={`text-xs font-medium ${odds.p1_current < odds.p1_opening ? 'text-emerald-400' : 'text-red-400'}`}>
                    {odds.p1_current < odds.p1_opening ? '▼' : '▲'}
                    {Math.abs(((odds.p1_current - odds.p1_opening) / odds.p1_opening) * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">{p2Name.split(' ').pop()}</div>
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-xs text-slate-600">Ouverture</div>
                  <div className="font-mono text-slate-400">{odds.p2_opening ? formatOdds(odds.p2_opening) : '—'}</div>
                </div>
                <div className="text-slate-700">→</div>
                <div>
                  <div className="text-xs text-slate-600">Actuel</div>
                  <div className="font-mono text-slate-200 font-semibold">{formatOdds(odds.p2_current)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Value analysis */}
      {prediction && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Analyse de valeur</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: p1Name.split(' ').pop(), bookProb: odds.p1_implied_prob, estProb: prediction.p1_win_prob, isValue: prediction.value_bet_player === 1 },
              { name: p2Name.split(' ').pop(), bookProb: odds.p2_implied_prob, estProb: prediction.p2_win_prob, isValue: prediction.value_bet_player === 2 },
            ].map((p, i) => (
              <div key={i} className={`rounded-lg p-3 ${p.isValue ? 'bg-emerald-950/40 border border-emerald-800/60' : 'bg-slate-800/30'}`}>
                <div className="text-xs font-medium text-slate-300 mb-2">{p.name}</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Prob. bookmaker</span>
                    <span className="font-mono text-slate-300">{formatProb(p.bookProb)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Prob. estimée</span>
                    <span className="font-mono text-slate-300">{formatProb(p.estProb)}</span>
                  </div>
                  {p.isValue && prediction.value_edge && (
                    <div className="flex justify-between pt-1 border-t border-emerald-800/40">
                      <span className="text-emerald-400 font-medium">Edge</span>
                      <span className="font-mono font-bold text-emerald-300">{formatEdge(prediction.value_edge)}</span>
                    </div>
                  )}
                </div>
                {p.isValue && (
                  <div className="mt-2 text-xs text-emerald-400 font-semibold">💰 Value Bet détecté</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
