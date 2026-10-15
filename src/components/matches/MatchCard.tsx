'use client'
import Link from 'next/link'
import { Clock, MapPin } from 'lucide-react'
import type { MatchListItem } from '@/lib/types'
import { SurfaceBadge } from '@/components/ui/SurfaceBadge'
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { AlertBadge } from '@/components/ui/AlertBadge'
import { ProbabilityBar } from '@/components/ui/ProbabilityBar'
import { formatMatchTime, formatOdds, formatProb, getCountryFlag, formatEdge } from '@/lib/utils'

export function MatchCard({ match }: { match: MatchListItem }) {
  const pred = match.prediction
  const odds = match.odds
  const isValueBet = pred?.value_bet_player != null

  return (
    <Link href={`/matches/${match.id}`}>
      <div className={`card p-4 hover:border-slate-700 transition-all cursor-pointer ${isValueBet ? 'ring-1 ring-emerald-500/30' : ''}`}>

        {/* Header: Tournament info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
            <MapPin size={12} />
            <span className="font-medium text-slate-300">{match.tournament.name}</span>
            <span>•</span>
            <span>{match.round}</span>
            <SurfaceBadge surface={match.tournament.surface} />
            <span className="badge text-slate-400 bg-slate-800 border-slate-700">{match.tournament.category}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 flex-shrink-0">
            <Clock size={12} />
            <span>{formatMatchTime(match.scheduled_time)}</span>
          </div>
        </div>

        {/* Players */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-4">
          {/* Player 1 */}
          <div className="text-right">
            <div className="font-semibold text-slate-100 truncate">{match.player1.name}</div>
            <div className="text-xs text-slate-500">
              {getCountryFlag(match.player1.country_code)} #{match.player1.ranking} · Forme: {Math.round(match.player1.form_score)}
            </div>
          </div>

          {/* VS */}
          <div className="flex items-center justify-center">
            <span className="text-slate-600 font-bold text-sm">VS</span>
          </div>

          {/* Player 2 */}
          <div>
            <div className="font-semibold text-slate-100 truncate">{match.player2.name}</div>
            <div className="text-xs text-slate-500">
              {getCountryFlag(match.player2.country_code)} #{match.player2.ranking} · Forme: {Math.round(match.player2.form_score)}
            </div>
          </div>
        </div>

        {/* Probability bar */}
        {pred && (
          <div className="mb-3">
            <ProbabilityBar
              p1Name={match.player1.name}
              p2Name={match.player2.name}
              p1Prob={pred.p1_win_prob}
              p2Prob={pred.p2_win_prob}
              p1BookmakerProb={odds?.p1_implied_prob}
              p2BookmakerProb={odds?.p2_implied_prob}
            />
          </div>
        )}

        {/* Odds & Value */}
        {odds && (
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="font-mono font-bold text-slate-200">{formatOdds(odds.p1_current)}</div>
                <div className="text-slate-500">{formatProb(odds.p1_implied_prob)}</div>
              </div>
              <div className="text-slate-600 font-bold text-[10px]">COTES</div>
              <div className="text-center">
                <div className="font-mono font-bold text-slate-200">{formatOdds(odds.p2_current)}</div>
                <div className="text-slate-500">{formatProb(odds.p2_implied_prob)}</div>
              </div>
            </div>

            {/* Edge indicator */}
            {isValueBet && pred?.value_edge && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950 border border-emerald-800">
                <span className="text-emerald-400 font-bold">💰 VALUE</span>
                <span className="text-emerald-300 font-mono font-bold">{formatEdge(pred.value_edge)}</span>
              </div>
            )}
          </div>
        )}

        {/* Badges */}
        {pred && (
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <ConfidenceBadge score={Math.round(pred.confidence)} />
            <RiskBadge score={Math.round(pred.risk)} />
          </div>
        )}

        {/* Alerts (max 2) */}
        {pred?.alerts && pred.alerts.length > 0 && (
          <div className="space-y-1 mt-2">
            {pred.alerts.slice(0, 2).map((alert, i) => (
              <AlertBadge key={i} alert={alert} />
            ))}
            {pred.alerts.length > 2 && (
              <div className="text-xs text-slate-500 text-right">+{pred.alerts.length - 2} alertes</div>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
