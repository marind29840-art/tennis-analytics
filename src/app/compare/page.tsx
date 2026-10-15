'use client'
import { useState, useCallback } from 'react'
import { Search, ArrowLeftRight, X } from 'lucide-react'
import { useCompare, useSearchPlayers } from '@/lib/api'
import { RadarCompareChart } from '@/components/charts/RadarCompareChart'
import { H2HModule } from '@/components/analysis/H2HModule'
import { SurfaceBadge } from '@/components/ui/SurfaceBadge'
import { ScoreGauge } from '@/components/ui/ScoreGauge'
import { getCountryFlag, winRate } from '@/lib/utils'
import type { PlayerProfile } from '@/lib/types'

interface PlayerSearchProps {
  label: string
  selected: PlayerProfile | null
  onSelect: (p: PlayerProfile) => void
  onClear: () => void
}

function PlayerSearch({ label, selected, onSelect, onClear }: PlayerSearchProps) {
  const [q, setQ] = useState('')
  const { data: results, isLoading } = useSearchPlayers(q)

  if (selected) {
    return (
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-slate-100">{selected.name}</div>
            <div className="text-xs text-slate-500">
              {getCountryFlag(selected.country_code)} #{selected.ranking} {selected.category}
            </div>
          </div>
          <button onClick={onClear} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="card flex items-center gap-2 px-3 py-2">
        <Search size={14} className="text-slate-500" />
        <input
          type="text"
          placeholder={label}
          value={q}
          onChange={e => setQ(e.target.value)}
          className="bg-transparent text-slate-200 placeholder-slate-600 text-sm focus:outline-none flex-1"
        />
        {isLoading && <div className="w-4 h-4 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />}
      </div>

      {/* Dropdown */}
      {results && results.length > 0 && q.length > 1 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl z-10 shadow-xl overflow-hidden">
          {results.map(p => (
            <button
              key={p.id}
              onClick={() => { onSelect(p); setQ('') }}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800 transition-colors text-left"
            >
              <div>
                <div className="text-sm font-medium text-slate-200">{p.name}</div>
                <div className="text-xs text-slate-500">{getCountryFlag(p.country_code)} {p.country_name}</div>
              </div>
              <div className="text-xs text-slate-500">#{p.ranking}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StatCompareRow({ label, v1, v2, format = 'num', higherIsBetter = true }: {
  label: string
  v1?: number | string
  v2?: number | string
  format?: 'num' | 'pct' | 'str'
  higherIsBetter?: boolean
}) {
  const fmt = (v?: number | string) => {
    if (v == null) return '—'
    if (typeof v === 'string') return v
    if (format === 'pct') return `${v.toFixed(0)}%`
    return v.toFixed(0)
  }

  const better1 = typeof v1 === 'number' && typeof v2 === 'number' && (higherIsBetter ? v1 > v2 : v1 < v2)
  const better2 = typeof v1 === 'number' && typeof v2 === 'number' && (higherIsBetter ? v2 > v1 : v2 < v1)

  return (
    <div className="flex items-center gap-2 py-2 border-b border-slate-800/50 last:border-0">
      <span className={`w-24 text-right text-sm font-mono font-medium ${better1 ? 'text-emerald-400' : 'text-slate-300'}`}>
        {fmt(v1)}
      </span>
      <span className="flex-1 text-center text-xs text-slate-500">{label}</span>
      <span className={`w-24 text-sm font-mono font-medium ${better2 ? 'text-emerald-400' : 'text-slate-300'}`}>
        {fmt(v2)}
      </span>
    </div>
  )
}

export default function ComparePage() {
  const [p1, setP1] = useState<PlayerProfile | null>(null)
  const [p2, setP2] = useState<PlayerProfile | null>(null)

  const { data: compareData, isLoading } = useCompare(p1?.id || '', p2?.id || '')

  const careerWR = (p: PlayerProfile) =>
    p.career_wins + p.career_losses > 0
      ? (p.career_wins / (p.career_wins + p.career_losses)) * 100
      : 0

  const ytdWR = (p: PlayerProfile) =>
    p.ytd_wins + p.ytd_losses > 0
      ? (p.ytd_wins / (p.ytd_wins + p.ytd_losses)) * 100
      : 0

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center">
            <ArrowLeftRight size={20} className="text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Comparaison de joueurs</h1>
        </div>
        <p className="text-slate-400 text-sm">Comparez les statistiques, le style de jeu et le bilan face à face de deux joueurs</p>
      </div>

      {/* Player selectors */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div>
          <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Joueur 1</div>
          <PlayerSearch
            label="Rechercher joueur 1..."
            selected={p1}
            onSelect={setP1}
            onClear={() => setP1(null)}
          />
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Joueur 2</div>
          <PlayerSearch
            label="Rechercher joueur 2..."
            selected={p2}
            onSelect={setP2}
            onClear={() => setP2(null)}
          />
        </div>
      </div>

      {/* Prompt to select */}
      {(!p1 || !p2) && (
        <div className="card p-12 text-center">
          <ArrowLeftRight size={40} className="mx-auto mb-3 text-slate-700" />
          <p className="text-slate-300 font-medium mb-2">Sélectionnez deux joueurs</p>
          <p className="text-sm text-slate-500">Utilisez la recherche ci-dessus pour choisir les deux joueurs à comparer</p>
        </div>
      )}

      {/* Loading */}
      {p1 && p2 && isLoading && (
        <div className="card p-8 text-center animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-1/3 mx-auto mb-3" />
          <div className="h-64 bg-slate-800 rounded" />
        </div>
      )}

      {/* Comparison */}
      {p1 && p2 && !isLoading && (
        <div className="space-y-6">
          {/* Score gauges */}
          <div className="card p-5">
            <div className="grid grid-cols-3 gap-4">
              {/* P1 scores */}
              <div className="space-y-4">
                <div className="text-center font-semibold text-slate-200 pb-2 border-b border-slate-800">
                  {p1.name.split(' ').pop()}
                </div>
                <div className="flex justify-around">
                  <ScoreGauge score={p1.form_score} label="Forme" size="md" />
                  <ScoreGauge score={p1.service_score} label="Service" size="md" />
                </div>
                <div className="flex justify-around">
                  <ScoreGauge score={p1.return_score} label="Retour" size="md" />
                  <ScoreGauge score={Math.max(0, 100 - p1.fatigue_score)} label="Fraîcheur" size="md" />
                </div>
              </div>

              {/* VS */}
              <div className="flex items-center justify-center">
                <div className="text-slate-600 font-bold text-2xl">VS</div>
              </div>

              {/* P2 scores */}
              <div className="space-y-4">
                <div className="text-center font-semibold text-slate-200 pb-2 border-b border-slate-800">
                  {p2.name.split(' ').pop()}
                </div>
                <div className="flex justify-around">
                  <ScoreGauge score={p2.form_score} label="Forme" size="md" />
                  <ScoreGauge score={p2.service_score} label="Service" size="md" />
                </div>
                <div className="flex justify-around">
                  <ScoreGauge score={p2.return_score} label="Retour" size="md" />
                  <ScoreGauge score={Math.max(0, 100 - p2.fatigue_score)} label="Fraîcheur" size="md" />
                </div>
              </div>
            </div>
          </div>

          {/* Stat comparison table */}
          <div className="card p-5">
            <div className="flex items-center gap-4 mb-4 text-sm font-semibold">
              <span className="w-24 text-right text-blue-400">{p1.name.split(' ').pop()}</span>
              <span className="flex-1 text-center text-slate-500">Statistique</span>
              <span className="w-24 text-amber-400">{p2.name.split(' ').pop()}</span>
            </div>
            <StatCompareRow label="Classement" v1={p1.ranking} v2={p2.ranking} higherIsBetter={false} />
            <StatCompareRow label="Age" v1={p1.age} v2={p2.age} higherIsBetter={false} />
            <StatCompareRow label="ELO" v1={p1.elo_rating} v2={p2.elo_rating} />
            <StatCompareRow label="% Victoires carrière" v1={careerWR(p1)} v2={careerWR(p2)} format="pct" />
            <StatCompareRow label="% Victoires cette saison" v1={ytdWR(p1)} v2={ytdWR(p2)} format="pct" />
            <StatCompareRow label="Score forme" v1={p1.form_score} v2={p2.form_score} />
            <StatCompareRow label="Score service" v1={p1.service_score} v2={p2.service_score} />
            <StatCompareRow label="Score retour" v1={p1.return_score} v2={p2.return_score} />
            <StatCompareRow label="Fatigue" v1={p1.fatigue_score} v2={p2.fatigue_score} higherIsBetter={false} />
          </div>

          {/* Radar chart */}
          {compareData?.radar && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Comparaison radar</h3>
              <RadarCompareChart
                p1Name={p1.name}
                p2Name={p2.name}
                p1Data={compareData.radar.p1}
                p2Data={compareData.radar.p2}
              />
            </div>
          )}

          {/* Fallback radar using player scores */}
          {!compareData?.radar && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Comparaison radar</h3>
              <RadarCompareChart
                p1Name={p1.name}
                p2Name={p2.name}
                p1Data={{
                  service: p1.service_score,
                  return: p1.return_score,
                  form: p1.form_score,
                  surface: Math.round((p1.clay_wins + p1.hard_wins + p1.grass_wins) / Math.max(1, p1.career_wins + p1.career_losses) * 100),
                  consistency: careerWR(p1),
                  experience: Math.min(100, Math.round((p1.career_wins + p1.career_losses) / 5)),
                }}
                p2Data={{
                  service: p2.service_score,
                  return: p2.return_score,
                  form: p2.form_score,
                  surface: Math.round((p2.clay_wins + p2.hard_wins + p2.grass_wins) / Math.max(1, p2.career_wins + p2.career_losses) * 100),
                  consistency: careerWR(p2),
                  experience: Math.min(100, Math.round((p2.career_wins + p2.career_losses) / 5)),
                }}
              />
            </div>
          )}

          {/* Surface breakdown */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Comparaison par surface</h3>
            <div className="space-y-3">
              {[
                { label: 'Dur', surface: 'hard', w1: p1.hard_wins, l1: p1.hard_losses, w2: p2.hard_wins, l2: p2.hard_losses },
                { label: 'Terre battue', surface: 'clay', w1: p1.clay_wins, l1: p1.clay_losses, w2: p2.clay_wins, l2: p2.clay_losses },
                { label: 'Gazon', surface: 'grass', w1: p1.grass_wins, l1: p1.grass_losses, w2: p2.grass_wins, l2: p2.grass_losses },
              ].map(({ label, surface, w1, l1, w2, l2 }) => {
                const wr1 = (w1 + l1 > 0) ? (w1 / (w1 + l1)) * 100 : 0
                const wr2 = (w2 + l2 > 0) ? (w2 / (w2 + l2)) * 100 : 0
                const winner = wr1 > wr2 ? p1.name.split(' ').pop() : wr2 > wr1 ? p2.name.split(' ').pop() : null
                return (
                  <div key={surface} className="flex items-center gap-4 py-2 border-b border-slate-800/50 last:border-0">
                    <SurfaceBadge surface={label} />
                    <span className={`text-sm font-mono w-16 text-right ${wr1 >= wr2 ? 'text-blue-400' : 'text-slate-400'}`}>
                      {winRate(w1, l1)}
                    </span>
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="bg-blue-600" style={{ width: `${wr1 / (wr1 + wr2) * 100 || 50}%` }} />
                    </div>
                    <span className={`text-sm font-mono w-16 ${wr2 > wr1 ? 'text-amber-400' : 'text-slate-400'}`}>
                      {winRate(w2, l2)}
                    </span>
                    {winner && (
                      <span className="text-xs text-slate-500 w-20 text-right">
                        {winner} avantage
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* H2H */}
          {compareData?.h2h && (
            <H2HModule
              p1Name={p1.name}
              p2Name={p2.name}
              data={compareData.h2h}
            />
          )}

          {/* Quick verdict */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Verdict rapide</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 rounded-lg bg-slate-800/40">
                <div className="text-slate-500 text-xs mb-1">Meilleure forme</div>
                <div className="font-semibold text-slate-100">
                  {p1.form_score >= p2.form_score ? p1.name.split(' ').pop() : p2.name.split(' ').pop()}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {Math.max(p1.form_score, p2.form_score).toFixed(0)}/100
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-800/40">
                <div className="text-slate-500 text-xs mb-1">Meilleur service</div>
                <div className="font-semibold text-slate-100">
                  {p1.service_score >= p2.service_score ? p1.name.split(' ').pop() : p2.name.split(' ').pop()}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {Math.max(p1.service_score, p2.service_score).toFixed(0)}/100
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-800/40">
                <div className="text-slate-500 text-xs mb-1">Plus frais</div>
                <div className="font-semibold text-slate-100">
                  {p1.fatigue_score <= p2.fatigue_score ? p1.name.split(' ').pop() : p2.name.split(' ').pop()}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Fatigue: {Math.min(p1.fatigue_score, p2.fatigue_score).toFixed(0)}/100
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
