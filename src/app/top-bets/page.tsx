'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Crown, Target, Trophy, AlertTriangle, Zap, TrendingUp, Star } from 'lucide-react'
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

interface TopBet {
  match_id: string
  tournament_slug: string
  tournament_name: string
  tour: string
  round: string | null
  player1: PlayerRef
  player2: PlayerRef
  h2h_record: string | null
  bet_player: 'player1' | 'player2'
  model_prob: number
  bookmaker_prob: number
  edge: number
  elo_edge: number
  ta_edge: number
  models_agree: boolean
  best_odds: number
  best_bookmaker: string | null
  expected_value: number
  score: number
  confidence: number
  reliability: number
  bookmaker_count: number
  verdict: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

const pct = (v: number): string => `${(v * 100).toFixed(1)}%`

const verdictStyle = (v: string): string => {
  if (v === 'Forte conviction')   return 'text-emerald-300 bg-emerald-950 border-emerald-700'
  if (v === 'Bon signal')          return 'text-blue-300 bg-blue-950 border-blue-800'
  if (v === 'Signal modéré')       return 'text-slate-300 bg-slate-800 border-slate-700'
  if (v === 'Modèles divergent')   return 'text-amber-300 bg-amber-950 border-amber-800'
  return 'text-slate-400 bg-slate-900 border-slate-800'
}

const rankMedal = (rank: number) => {
  if (rank === 1) return { color: 'text-amber-300',  glow: 'from-amber-500/20 to-transparent', label: '🥇' }
  if (rank === 2) return { color: 'text-slate-300',  glow: 'from-slate-400/20 to-transparent', label: '🥈' }
  if (rank === 3) return { color: 'text-orange-300', glow: 'from-orange-500/20 to-transparent', label: '🥉' }
  return { color: 'text-slate-500', glow: 'from-slate-700/10 to-transparent', label: `#${rank}` }
}

function ScoreStars({ score }: { score: number }) {
  // Map score to 1-5 stars (top scores around 0.4-0.5)
  const stars = Math.min(5, Math.max(1, Math.round(score * 12)))
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          className={clsx(i < stars ? 'text-ball-300 fill-ball-300' : 'text-slate-700')}
        />
      ))}
    </div>
  )
}

function TopBetCard({ vb, rank }: { vb: TopBet; rank: number }) {
  const router = useRouter()
  const medal = rankMedal(rank)
  const isPodium = rank <= 3
  const pick = vb.bet_player === 'player1' ? vb.player1 : vb.player2
  const opp  = vb.bet_player === 'player1' ? vb.player2 : vb.player1

  return (
    <div
      onClick={() => router.push(`/matches/${vb.match_id}`)}
      className={clsx(
        'card relative overflow-hidden cursor-pointer transition-all hover:border-slate-700 hover:bg-slate-800/30',
        isPodium ? 'p-5' : 'p-4',
      )}
    >
      {/* Background glow for podium */}
      {isPodium && (
        <div className={clsx(
          'absolute inset-0 pointer-events-none bg-gradient-to-br',
          medal.glow,
        )} />
      )}

      <div className="relative">
        {/* Header row: rank + score + verdict */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={clsx(
              'font-bold flex-shrink-0',
              isPodium ? 'text-2xl' : 'text-base',
              medal.color,
            )}>
              {medal.label}
            </span>
            <div>
              <ScoreStars score={vb.score} />
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Score {(vb.score * 100).toFixed(0)} / 100
              </div>
            </div>
          </div>
          <span className={clsx(
            'badge flex-shrink-0',
            verdictStyle(vb.verdict),
          )}>
            {vb.verdict}
          </span>
        </div>

        {/* Tournament context */}
        <div className="flex items-center gap-2 mb-3 text-xs">
          <Trophy size={11} className="text-slate-500" />
          <Link
            href={`/tournaments/${vb.tournament_slug}`}
            onClick={e => e.stopPropagation()}
            className="text-slate-400 hover:text-blue-400 truncate"
          >
            {vb.tournament_name}
          </Link>
          {vb.round && <span className="badge bg-slate-800 text-slate-300 border-slate-700">{vb.round}</span>}
          <span className={clsx(
            'badge border-current',
            vb.tour === 'ATP' && 'text-blue-400',
            vb.tour === 'WTA' && 'text-pink-400',
            vb.tour === 'Challenger' && 'text-amber-400',
          )}>{vb.tour}</span>
        </div>

        {/* Match */}
        <div className="space-y-1.5 mb-3 text-sm">
          <div className="flex items-center gap-2">
            {vb.bet_player === 'player1' && <Zap size={13} className="text-ball-300 flex-shrink-0" />}
            <Link
              href={`/players/${vb.player1.slug}`}
              onClick={e => e.stopPropagation()}
              className={clsx(
                'truncate hover:text-blue-400',
                vb.bet_player === 'player1' ? 'text-ball-300 font-bold' : 'text-slate-300',
              )}
            >
              {vb.player1.name}
            </Link>
            {vb.player1.elo != null && (
              <span className="text-xs text-slate-600 font-mono ml-auto">Elo {Math.round(vb.player1.elo)}</span>
            )}
          </div>
          <div className="text-slate-700 text-xs pl-4">vs</div>
          <div className="flex items-center gap-2">
            {vb.bet_player === 'player2' && <Zap size={13} className="text-ball-300 flex-shrink-0" />}
            <Link
              href={`/players/${vb.player2.slug}`}
              onClick={e => e.stopPropagation()}
              className={clsx(
                'truncate hover:text-blue-400',
                vb.bet_player === 'player2' ? 'text-ball-300 font-bold' : 'text-slate-300',
              )}
            >
              {vb.player2.name}
            </Link>
            {vb.player2.elo != null && (
              <span className="text-xs text-slate-600 font-mono ml-auto">Elo {Math.round(vb.player2.elo)}</span>
            )}
          </div>
        </div>

        {/* Pari row */}
        <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800 grid grid-cols-3 gap-3 text-xs">
          <div>
            <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wide">Modèle</div>
            <div className="font-mono font-bold text-slate-100">{pct(vb.model_prob)}</div>
            <div className="text-[10px] text-slate-600">vs cotes {pct(vb.bookmaker_prob)}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wide">Edge</div>
            <div className={clsx(
              'font-mono font-bold',
              vb.edge >= 0.20 ? 'text-emerald-300' : vb.edge >= 0.10 ? 'text-emerald-400' : 'text-amber-300',
            )}>
              +{(vb.edge * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wide">Cote</div>
            <div className="font-mono font-bold text-slate-100">{vb.best_odds.toFixed(2)}</div>
            {vb.best_bookmaker && (
              <div className="text-[10px] text-slate-600 truncate">{vb.best_bookmaker}</div>
            )}
          </div>
        </div>

        {/* Footer row: signals */}
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2 text-[10px] text-slate-500">
          <div className="flex items-center gap-2">
            {vb.models_agree ? (
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <span>✓</span> Elo et TA d&apos;accord
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-400">
                <span>⚠</span> Modèles divergent
              </span>
            )}
            {vb.reliability < 1 && (
              <span className="text-amber-500">Fiabilité {(vb.reliability * 100).toFixed(0)}%</span>
            )}
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span>EV <span className={clsx(
              vb.expected_value > 0 ? 'text-emerald-400' : 'text-red-400'
            )}>{vb.expected_value > 0 ? '+' : ''}{vb.expected_value.toFixed(2)}€</span></span>
            <span className="text-slate-700">·</span>
            <span>{vb.bookmaker_count} books</span>
            {vb.h2h_record && <><span className="text-slate-700">·</span><span>H2H {vb.h2h_record}</span></>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TopBetsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['feed', 'top-bets'],
    queryFn: () => axios.get<TopBet[]>(`${API_BASE}/api/feed/top-bets?limit=10`).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-700/30 text-amber-300 flex items-center justify-center">
            <Crown size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Top Paris du jour</h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Les 10 meilleures opportunités classées par <span className="text-ball-300 font-medium">edge × confiance × fiabilité</span>
            </p>
          </div>
        </div>
      </div>

      {/* Methodology card */}
      <div className="card p-4 mb-5 bg-slate-950/40 border-slate-800/60">
        <h3 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Target size={12} /> Comment le score est calculé
        </h3>
        <div className="grid md:grid-cols-3 gap-3 text-xs text-slate-400">
          <div>
            <div className="text-slate-300 font-medium mb-1">📊 Edge</div>
            Probabilité moyenne (Elo + TA) <span className="text-slate-200">moins</span> probabilité implicite des cotes normalisées.
          </div>
          <div>
            <div className="text-slate-300 font-medium mb-1">🎯 Confiance</div>
            <span className="text-emerald-300">+30%</span> si Elo et TA pointent du même côté, <span className="text-red-300">-40%</span> sinon.
          </div>
          <div>
            <div className="text-slate-300 font-medium mb-1">🛡 Fiabilité</div>
            Pénalité sur joueurs hors top Elo (Challenger / ITF) ou edges {'>'} 40% (souvent piège).
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="card p-3 mb-5 bg-amber-950/30 border-amber-900/40">
        <div className="flex gap-2 items-start text-xs text-amber-200/80">
          <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong className="text-amber-300">Attention :</strong> aucune méthode statistique n&apos;est infaillible.
            Un edge positif n&apos;intègre ni les blessures, ni la météo, ni la fatigue récente.
            Joue de l&apos;argent que tu peux te permettre de perdre.
          </span>
        </div>
      </div>

      {isLoading && <div className="card p-8 text-center text-slate-400">Calcul du classement…</div>}
      {error && <div className="card p-8 text-center text-red-400">Impossible de charger les paris</div>}
      {data && data.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          Aucun pari à fort potentiel détecté actuellement. Reviens plus tard quand de nouveaux matchs auront cotes et prédictions.
        </div>
      )}

      {data && data.length > 0 && (
        <div className="space-y-3">
          {data.map((vb, i) => (
            <TopBetCard key={vb.match_id} vb={vb} rank={i + 1} />
          ))}
        </div>
      )}

      <TennisAbstractCredit />
    </div>
  )
}
