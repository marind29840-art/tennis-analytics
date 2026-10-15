'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trophy, ExternalLink, TrendingUp } from 'lucide-react'
import { clsx } from 'clsx'
import { TennisAbstractCredit } from '@/components/ui/TennisAbstractCredit'
import { SurfaceBadge } from '@/components/ui/SurfaceBadge'
import { BouncingBall } from '@/components/ui/BouncingBall'

interface PlayerRef {
  seed: string | null
  name: string
  country: string | null
  profile_url: string | null
  slug: string
  elo: number | null
  elo_rank: number | null
  hard_elo: number | null
  clay_elo: number | null
  grass_elo: number | null
  atp_rank: number | null
  gender: string | null
}

interface MatchOdds {
  p1_odds_avg: number | null
  p1_odds_best: number | null
  p1_odds_best_bookmaker: string | null
  p2_odds_avg: number | null
  p2_odds_best: number | null
  p2_odds_best_bookmaker: string | null
  p1_implied_prob: number | null
  p2_implied_prob: number | null
  bookmaker_margin: number | null
  bookmaker_count: number
}

interface UpcomingMatch {
  match_id: string
  tournament_slug: string
  tournament_name: string
  tour: string
  round: string | null
  player1: PlayerRef
  player2: PlayerRef
  h2h_record: string | null
  elo_prob_p1: number | null
  ta_prob_p1: number | null
  odds: MatchOdds | null
  elo_edge_p1: number | null
  ta_edge_p1: number | null
  is_live?: boolean
  commence_time?: string | null
  hours_until_start?: number | null
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const TOUR_FILTERS: { key: string; label: string; color: string }[] = [
  { key: 'all',        label: 'Tous',       color: 'text-slate-200' },
  { key: 'atp',        label: 'ATP',        color: 'text-blue-400' },
  { key: 'wta',        label: 'WTA',        color: 'text-pink-400' },
  { key: 'challenger', label: 'Challenger', color: 'text-amber-400' },
]

function pct(v: number | null | undefined): string {
  if (v == null) return '—'
  return `${(v * 100).toFixed(0)}%`
}

function PlayerLine({ p, isFavored }: { p: PlayerRef; isFavored: boolean }) {
  return (
    <Link
      href={`/players/${p.slug}`}
      className="flex items-center gap-2 group min-w-0"
      onClick={e => e.stopPropagation()}
    >
      {p.seed && <span className="text-slate-600 text-xs font-mono flex-shrink-0">({p.seed})</span>}
      <span className={clsx(
        'truncate transition-colors group-hover:text-blue-400',
        isFavored ? 'text-slate-100 font-medium' : 'text-slate-300'
      )}>
        {p.name}
      </span>
      {p.country && <span className="text-slate-600 text-xs flex-shrink-0">{p.country}</span>}
      {p.elo != null && (
        <span className="ml-auto text-xs text-slate-500 font-mono flex-shrink-0">
          Elo {Math.round(p.elo)}
        </span>
      )}
    </Link>
  )
}

function formatRelativeTime(hours: number | null | undefined): string | null {
  if (hours == null) return null
  if (hours < 0) return `il y a ${Math.abs(hours).toFixed(0)}h`
  if (hours < 1) return `dans ${Math.round(hours * 60)}min`
  if (hours < 24) return `dans ${hours.toFixed(0)}h`
  const d = Math.floor(hours / 24)
  const h = Math.round(hours - d * 24)
  return `dans ${d}j ${h}h`
}

function MatchCard({ m }: { m: UpcomingMatch }) {
  const router = useRouter()
  const ta = m.ta_prob_p1
  const elo = m.elo_prob_p1
  const p1Favored = (ta ?? elo ?? 0.5) > 0.5
  const odds = m.odds
  const hasValueBet = (m.elo_edge_p1 != null && Math.abs(m.elo_edge_p1) >= 0.10)
                   || (m.ta_edge_p1  != null && Math.abs(m.ta_edge_p1)  >= 0.10)
  const relTime = formatRelativeTime(m.hours_until_start)

  return (
    <div
      onClick={() => router.push(`/matches/${m.match_id}`)}
      className={clsx(
        'card p-4 hover:border-slate-700 hover:bg-slate-800/30 transition-all block group cursor-pointer relative',
        hasValueBet && 'ring-1 ring-ball-300/30',
        m.is_live && 'ring-1 ring-red-500/40'
      )}
    >
      {m.is_live && (
        <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white shadow-lg flex items-center gap-1 z-10">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          LIVE
        </span>
      )}
      <div className="flex items-center justify-between mb-3 text-xs">
        <Link
          href={`/tournaments/${m.tournament_slug}`}
          onClick={e => e.stopPropagation()}
          className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1.5 truncate min-w-0"
        >
          <Trophy size={11} className="flex-shrink-0" />
          <span className="truncate">{m.tournament_name}</span>
        </Link>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {relTime && !m.is_live && (
            <span className="text-[10px] text-slate-500 font-mono">{relTime}</span>
          )}
          {m.round && (
            <span className="badge bg-slate-800 text-slate-300 border-slate-700">{m.round}</span>
          )}
          <span className={clsx(
            'badge border-current',
            m.tour === 'ATP' && 'text-blue-400',
            m.tour === 'WTA' && 'text-pink-400',
            m.tour === 'Challenger' && 'text-amber-400',
          )}>
            {m.tour}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        <PlayerLine p={m.player1} isFavored={p1Favored} />
        <div className="text-slate-700 text-xs font-bold pl-1">vs</div>
        <PlayerLine p={m.player2} isFavored={!p1Favored} />
      </div>

      {/* Probability bars */}
      {(ta != null || elo != null) && (
        <div className="space-y-1.5 pt-2 border-t border-slate-800/50">
          {ta != null && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 w-12 flex-shrink-0">TA</span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all" style={{ width: `${ta * 100}%` }} />
              </div>
              <span className="font-mono text-slate-400 w-10 text-right flex-shrink-0">{pct(ta)}</span>
            </div>
          )}
          {elo != null && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 w-12 flex-shrink-0">Elo</span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 transition-all" style={{ width: `${elo * 100}%` }} />
              </div>
              <span className="font-mono text-slate-400 w-10 text-right flex-shrink-0">{pct(elo)}</span>
            </div>
          )}
        </div>
      )}

      {/* Bookmaker odds */}
      {odds && odds.p1_odds_best != null && (
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Cotes :</span>
            <span className="font-mono text-slate-200 font-semibold">{odds.p1_odds_best.toFixed(2)}</span>
            <span className="text-slate-700">/</span>
            <span className="font-mono text-slate-200 font-semibold">{odds.p2_odds_best?.toFixed(2)}</span>
            <span className="text-[10px] text-slate-600">({odds.bookmaker_count} books)</span>
          </div>
          {hasValueBet && (
            <span className="badge bg-ball-300/15 text-ball-300 border-ball-300/40 font-bold">
              ⚡ Value
            </span>
          )}
        </div>
      )}

      {m.h2h_record && (
        <div className="mt-2 text-xs text-slate-500">
          H2H : <span className="font-mono text-slate-400">{m.h2h_record}</span>
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  const [tour, setTour] = useState('all')
  const [search, setSearch] = useState('')

  const { data, isLoading, error, dataUpdatedAt, refetch } = useQuery({
    queryKey: ['feed', 'upcoming'],
    queryFn: () => axios.get<UpcomingMatch[]>(`${API_BASE}/api/feed/upcoming`).then(r => r.data),
    staleTime: 60 * 1000,                  // consider stale after 1 min
    refetchInterval: 2 * 60 * 1000,        // auto-refetch every 2 min in background
    refetchOnWindowFocus: true,            // refresh when user comes back to tab
  })

  const { data: oddsStatus } = useQuery({
    queryKey: ['feed', 'odds-status'],
    queryFn: () => axios.get(`${API_BASE}/api/feed/odds/status`).then(r => r.data),
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })

  const filtered = useMemo(() => {
    if (!data) return []
    const q = search.trim().toLowerCase()
    return data.filter(m => {
      if (tour !== 'all' && m.tour.toLowerCase() !== tour) return false
      if (!q) return true
      return (
        m.player1.name.toLowerCase().includes(q) ||
        m.player2.name.toLowerCase().includes(q) ||
        m.tournament_name.toLowerCase().includes(q)
      )
    })
  }, [data, tour, search])

  const counts = useMemo(() => {
    if (!data) return { all: 0, atp: 0, wta: 0, challenger: 0, live: 0 }
    return {
      all: data.length,
      atp: data.filter(m => m.tour === 'ATP').length,
      wta: data.filter(m => m.tour === 'WTA').length,
      challenger: data.filter(m => m.tour === 'Challenger').length,
      live: data.filter(m => m.is_live).length,
    }
  }, [data])

  // Compute odds-data freshness in human terms
  const oddsAgeMinutes = useMemo(() => {
    if (!oddsStatus?.polled_at) return null
    const polled = new Date(oddsStatus.polled_at).getTime()
    return Math.round((Date.now() - polled) / 60000)
  }, [oddsStatus?.polled_at])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <TrendingUp size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Matchs à venir</h1>
            <p className="text-sm text-slate-400">
              Tous les matchs upcoming sur les tournois ATP, WTA et Challenger en cours
            </p>
          </div>
        </div>

        {/* Stats bar */}
        {data && (
          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500">Total :</span>{' '}
              <span className="text-slate-100 font-bold">{data.length}</span>
            </span>
            {counts.live > 0 && (
              <span className="px-3 py-1.5 rounded-lg bg-red-950/50 border border-red-900/60 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                <span className="text-red-300 font-bold">{counts.live}</span>
                <span className="text-red-400/70">en cours</span>
              </span>
            )}
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500">ATP :</span>{' '}
              <span className="text-blue-400 font-bold">{counts.atp}</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500">WTA :</span>{' '}
              <span className="text-pink-400 font-bold">{counts.wta}</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500">Challenger :</span>{' '}
              <span className="text-amber-400 font-bold">{counts.challenger}</span>
            </span>
          </div>
        )}

        {/* Freshness indicator + manual refresh */}
        {oddsAgeMinutes !== null && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className={clsx(
              'inline-flex items-center gap-1.5 px-2 py-1 rounded-md border',
              oddsAgeMinutes <= 60
                ? 'text-emerald-400 border-emerald-900/60 bg-emerald-950/30'
                : oddsAgeMinutes <= 180
                ? 'text-amber-400 border-amber-900/60 bg-amber-950/30'
                : 'text-red-400 border-red-900/60 bg-red-950/30'
            )}>
              <span className={clsx(
                'w-1.5 h-1.5 rounded-full',
                oddsAgeMinutes <= 60 ? 'bg-emerald-400 animate-pulse' :
                oddsAgeMinutes <= 180 ? 'bg-amber-400' : 'bg-red-400',
              )} />
              Cotes mises à jour il y a {oddsAgeMinutes < 60 ? `${oddsAgeMinutes} min`
                : `${Math.round(oddsAgeMinutes / 60)}h${oddsAgeMinutes % 60 > 0 ? ` ${oddsAgeMinutes % 60}min` : ''}`}
            </span>
            <button
              onClick={() => refetch()}
              className="px-2 py-1 rounded-md border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
              title="Recharger les matchs"
            >
              ↻ Recharger
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-1.5">
          {TOUR_FILTERS.map(t => (
            <button
              key={t.key}
              onClick={() => setTour(t.key)}
              className={clsx(
                'px-3 py-1.5 rounded-md text-xs font-medium border transition-colors',
                tour === t.key
                  ? `${t.color} border-current bg-current/10`
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Rechercher un joueur ou un tournoi…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 md:flex-initial md:w-72 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Match feed */}
      {isLoading && (
        <div className="card py-16 flex items-center justify-center">
          <BouncingBall size={28} label="Chargement des matchs en cours…" />
        </div>
      )}

      {error && (
        <div className="card p-8 text-center">
          <p className="text-red-400 mb-2">Impossible de charger les matchs</p>
          <p className="text-xs text-slate-500">
            Vérifie que le scrape Tennis Abstract a tourné aujourd&apos;hui.
          </p>
        </div>
      )}

      {filtered.length === 0 && !isLoading && data && (
        <div className="card p-8 text-center text-slate-500">
          Aucun match ne correspond aux filtres.
        </div>
      )}

      {filtered.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m, i) => (
            <MatchCard key={`${m.tournament_slug}-${m.player1.slug}-${m.player2.slug}-${i}`} m={m} />
          ))}
        </div>
      )}

      {oddsStatus?.polled_at && (
        <TennisAbstractCredit scrapedAt={oddsStatus.polled_at} />
      )}
    </div>
  )
}
