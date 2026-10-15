'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { Zap, AlertTriangle, Trophy, TrendingUp } from 'lucide-react'
import { clsx } from 'clsx'
import { TennisAbstractCredit } from '@/components/ui/TennisAbstractCredit'

interface PlayerRef {
  seed: string | null
  name: string
  country: string | null
  slug: string
  elo: number | null
  elo_rank: number | null
  atp_rank: number | null
}

interface ValueBet {
  tournament_slug: string
  tournament_name: string
  tour: string
  round: string | null
  player1: PlayerRef
  player2: PlayerRef
  h2h_record: string | null
  bet_player: 'player1' | 'player2'
  edge: number
  model_prob: number
  bookmaker_prob: number
  best_odds: number | null
  best_bookmaker: string | null
  expected_value: number | null
  odds: { bookmaker_count: number; bookmaker_margin: number | null }
}

interface OddsStatus {
  available: boolean
  polled_at?: string
  match_count?: number
  active_sports?: string[]
  quota?: { remaining: number; used: number }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const MODELS = [
  { key: 'elo', label: 'Elo', desc: 'Elo brut Tennis Abstract — favorise la forme historique' },
  { key: 'ta',  label: 'Forecast TA', desc: 'Modèle de simulation Tennis Abstract — tient compte du tirage' },
]

const GAP_THRESHOLDS = [0.03, 0.05, 0.10, 0.20]

const pct = (v: number): string => `${(v * 100).toFixed(1)}%`

function ValueBetCard({ vb }: { vb: ValueBet }) {
  const isP1 = vb.bet_player === 'player1'
  const pickedPlayer = isP1 ? vb.player1 : vb.player2
  const otherPlayer = isP1 ? vb.player2 : vb.player1
  const edgeColor = vb.edge >= 0.20
    ? 'text-emerald-300 bg-emerald-950 border-emerald-700'
    : vb.edge >= 0.10
    ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
    : 'text-amber-300 bg-amber-950 border-amber-800'

  return (
    <div className="card p-4 hover:border-slate-700 transition-colors relative overflow-hidden">
      {/* Edge ribbon top-right */}
      <div className={clsx(
        'absolute top-0 right-0 px-3 py-1 text-xs font-bold font-mono border-l border-b rounded-bl-lg',
        edgeColor
      )}>
        +{(vb.edge * 100).toFixed(1)}%
      </div>

      <div className="flex items-center gap-2 mb-3 text-xs">
        <Trophy size={11} className="text-slate-500" />
        <Link href={`/tournaments/${vb.tournament_slug}`} className="text-slate-400 hover:text-blue-400 truncate">
          {vb.tournament_name}
        </Link>
        {vb.round && <span className="badge bg-slate-800 text-slate-300 border-slate-700">{vb.round}</span>}
      </div>

      {/* Match */}
      <div className="text-sm mb-3 space-y-1">
        <div className={clsx('flex items-center gap-2', isP1 && 'font-semibold')}>
          {isP1 && <Zap size={12} className="text-ball-300 flex-shrink-0" />}
          <Link href={`/players/${vb.player1.slug}`} className="text-slate-100 hover:text-blue-400 truncate">
            {vb.player1.name}
          </Link>
          {vb.player1.elo != null && (
            <span className="text-xs text-slate-500 font-mono ml-auto">Elo {Math.round(vb.player1.elo)}</span>
          )}
        </div>
        <div className="text-slate-700 text-xs pl-4">vs</div>
        <div className={clsx('flex items-center gap-2', !isP1 && 'font-semibold')}>
          {!isP1 && <Zap size={12} className="text-ball-300 flex-shrink-0" />}
          <Link href={`/players/${vb.player2.slug}`} className="text-slate-100 hover:text-blue-400 truncate">
            {vb.player2.name}
          </Link>
          {vb.player2.elo != null && (
            <span className="text-xs text-slate-500 font-mono ml-auto">Elo {Math.round(vb.player2.elo)}</span>
          )}
        </div>
      </div>

      {/* Pick + odds */}
      <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800 space-y-2">
        <div className="text-xs text-slate-500">Pari sur</div>
        <div className="text-sm font-semibold text-ball-300 truncate">{pickedPlayer.name}</div>

        <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800">
          <div>
            <div className="text-slate-500 mb-0.5">Modèle</div>
            <div className="font-mono text-slate-100 font-bold">{pct(vb.model_prob)}</div>
          </div>
          <div>
            <div className="text-slate-500 mb-0.5">Bookmakers</div>
            <div className="font-mono text-slate-300">{pct(vb.bookmaker_prob)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800">
          <div>
            <div className="text-slate-500 mb-0.5">Meilleure cote</div>
            <div className="font-mono text-emerald-300 font-bold">{vb.best_odds?.toFixed(2)}</div>
            {vb.best_bookmaker && (
              <div className="text-[10px] text-slate-500 truncate">{vb.best_bookmaker}</div>
            )}
          </div>
          <div>
            <div className="text-slate-500 mb-0.5">EV / 1€</div>
            <div className={clsx(
              'font-mono font-bold',
              (vb.expected_value ?? 0) >= 0.5 ? 'text-emerald-300'
              : (vb.expected_value ?? 0) >= 0.1 ? 'text-emerald-400'
              : 'text-amber-300'
            )}>
              {vb.expected_value != null ? `+${vb.expected_value.toFixed(2)}€` : '—'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600">
        <span>{vb.odds.bookmaker_count} books · marge {((vb.odds.bookmaker_margin ?? 0) * 100).toFixed(1)}%</span>
        {vb.h2h_record && <span className="font-mono">H2H {vb.h2h_record}</span>}
      </div>
    </div>
  )
}

export default function ValueBetsPage() {
  const [model, setModel] = useState<'elo' | 'ta'>('elo')
  const [minEdge, setMinEdge] = useState(0.05)

  const { data, isLoading, error } = useQuery({
    queryKey: ['value-bets', model, minEdge],
    queryFn: () => axios
      .get<ValueBet[]>(`${API_BASE}/api/feed/value-bets?model=${model}&min_edge=${minEdge}`)
      .then(r => r.data),
    staleTime: 5 * 60 * 1000,
  })

  const { data: oddsStatus } = useQuery({
    queryKey: ['odds', 'status'],
    queryFn: () => axios.get<OddsStatus>(`${API_BASE}/api/feed/odds/status`).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-ball-300/20 text-ball-300 flex items-center justify-center">
            <Zap size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-slate-100">Value Bets</h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
              Matchs où la probabilité de notre modèle dépasse la probabilité implicite des cotes des
              bookmakers. Edge calculé sur les cotes normalisées (marge bookmaker retirée).
            </p>
          </div>
        </div>

        {/* Odds API status */}
        {oddsStatus?.available && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
              <span className="text-slate-500">Cotes :</span>{' '}
              <span className="text-slate-200 font-mono">{oddsStatus.match_count} matchs</span>
            </span>
            {oddsStatus.quota && (
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
                <span className="text-slate-500">Quota :</span>{' '}
                <span className="text-slate-200 font-mono">{oddsStatus.quota.remaining}</span>{' '}
                <span className="text-slate-500">/ 500 restants</span>
              </span>
            )}
            {oddsStatus.polled_at && (
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-500">
                Mis à jour {new Date(oddsStatus.polled_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Notice */}
      <div className="card p-4 mb-5 bg-amber-950/30 border-amber-900/40">
        <div className="flex gap-3 items-start">
          <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/80 leading-relaxed">
            <strong className="text-amber-300">Avertissement :</strong> ces value bets sont identifiés
            statistiquement à partir d&apos;un modèle de probabilité (Elo ou Tennis Abstract). Ils
            n&apos;intègrent pas les facteurs invisibles (blessures, météo, état mental, etc.). Un edge
            positif ne garantit pas un gain. Les paris sportifs comportent un risque de perte financière.
            Joue de manière responsable.
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-5">
        {/* Model selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 mr-1">Modèle :</span>
          {MODELS.map(m => (
            <button
              key={m.key}
              onClick={() => setModel(m.key as 'elo' | 'ta')}
              title={m.desc}
              className={clsx(
                'px-3 py-1 rounded-md text-xs font-medium border transition-all',
                model === m.key
                  ? 'text-ball-300 border-ball-300 bg-ball-300/10'
                  : 'text-slate-500 border-slate-800 hover:text-slate-300'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Min edge */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 mr-1">Edge ≥ :</span>
          {GAP_THRESHOLDS.map(t => (
            <button
              key={t}
              onClick={() => setMinEdge(t)}
              className={clsx(
                'px-2.5 py-1 rounded-md text-xs font-medium border transition-all',
                minEdge === t
                  ? 'text-emerald-400 border-emerald-700 bg-emerald-950'
                  : 'text-slate-500 border-slate-800 hover:text-slate-300'
              )}
            >
              {(t * 100).toFixed(0)}%
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading && <div className="card p-8 text-center text-slate-400">Calcul des value bets…</div>}
      {error && <div className="card p-8 text-center text-red-400">Impossible de charger les value bets</div>}
      {data && data.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          Aucun value bet ≥ {(minEdge * 100).toFixed(0)}% détecté actuellement avec le modèle {model.toUpperCase()}.
          Essaye un seuil plus bas ou l&apos;autre modèle.
        </div>
      )}
      {data && data.length > 0 && (
        <>
          <div className="text-xs text-slate-500 mb-3">
            <span className="text-slate-300 font-bold">{data.length}</span> value bet{data.length > 1 ? 's' : ''}{' '}
            avec un edge ≥ {(minEdge * 100).toFixed(0)}% (modèle {model.toUpperCase()})
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.map((vb, i) => (
              <ValueBetCard key={`${vb.tournament_slug}-${vb.player1.slug}-${vb.bet_player}-${i}`} vb={vb} />
            ))}
          </div>
        </>
      )}

      <TennisAbstractCredit scrapedAt={oddsStatus?.polled_at} />
    </div>
  )
}
