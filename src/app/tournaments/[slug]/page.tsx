'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { Trophy, ChevronLeft, ExternalLink, Star, Clock, CheckCircle2, GitBranch, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { clsx } from 'clsx'
import { TennisAbstractCredit } from '@/components/ui/TennisAbstractCredit'
import { Score } from '@/components/ui/Score'

interface PlayerRef {
  seed: string | null
  name: string
  country: string | null
  profile_url: string | null
}

interface ForecastPlayer extends PlayerRef {
  probabilities: Record<string, number | null>
}

interface Forecast {
  rounds: string[]
  players: ForecastPlayer[]
}

interface UpcomingMatch {
  round: string | null
  player1: PlayerRef
  player2: PlayerRef
  h2h_record: string | null
}

interface CompletedMatch {
  round: string | null
  winner: PlayerRef
  loser: PlayerRef
  score: string | null
}

interface TournamentDetail {
  title: string
  source_url: string
  scraped_at: string
  slug: string
  tour: string
  tournament_name: string
  current_forecast: Forecast
  pre_tournament_forecast: Forecast
  upcoming_matches: UpcomingMatch[]
  completed_matches: CompletedMatch[]
  bracket_predictions: Record<string, UpcomingMatch[]>
  counts: { players: number; upcoming: number; completed: number }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

type Tab = 'forecast' | 'upcoming' | 'completed' | 'bracket'

const TAB_LABELS: Record<Tab, { label: string; icon: any }> = {
  forecast:  { label: 'Forecast',          icon: Star },
  upcoming:  { label: 'Matchs à venir',    icon: Clock },
  completed: { label: 'Matchs joués',      icon: CheckCircle2 },
  bracket:   { label: 'Bracket prédit',    icon: GitBranch },
}

function PlayerLabel({ p, showSeed = true }: { p: PlayerRef; showSeed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1">
      {showSeed && p.seed && (
        <span className="text-slate-500 text-xs font-mono">({p.seed})</span>
      )}
      {p.profile_url ? (
        <a
          href={p.profile_url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition-colors"
        >
          {p.name}
        </a>
      ) : (
        <span>{p.name}</span>
      )}
      {p.country && <span className="text-slate-500 text-xs">{p.country}</span>}
    </span>
  )
}

function pct(v: number | null | undefined) {
  if (v == null) return null
  return `${(v * 100).toFixed(1)}%`
}

function probColor(v: number | null) {
  if (v == null) return 'text-slate-700'
  if (v === 0) return 'text-slate-700'
  if (v >= 0.5) return 'text-emerald-400 font-semibold'
  if (v >= 0.2) return 'text-emerald-300'
  if (v >= 0.05) return 'text-slate-300'
  return 'text-slate-500'
}

// ---------------- Forecast tab ----------------
function ForecastTab({ data }: { data: TournamentDetail }) {
  const [sortKey, setSortKey] = useState<string>('W')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [showPre, setShowPre] = useState(false)

  const forecast = showPre ? data.pre_tournament_forecast : data.current_forecast
  const rounds = forecast.rounds

  const sorted = useMemo(() => {
    return [...forecast.players].sort((a, b) => {
      const av = (sortKey === 'name' ? a.name : a.probabilities[sortKey]) ?? -1
      const bv = (sortKey === 'name' ? b.name : b.probabilities[sortKey]) ?? -1
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv), 'fr')
        : String(bv).localeCompare(String(av), 'fr')
    })
  }, [forecast.players, sortKey, sortDir])

  const toggleSort = (k: string) => {
    if (sortKey === k) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(k); setSortDir(k === 'name' ? 'asc' : 'desc') }
  }

  const SortIcon = ({ k }: { k: string }) => {
    if (sortKey !== k) return <ArrowUpDown size={10} className="opacity-40" />
    return sortDir === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowPre(false)}
            className={clsx(
              'px-3 py-1.5 rounded-md font-medium border transition-colors',
              !showPre ? 'bg-blue-600/20 text-blue-300 border-blue-700' : 'border-slate-800 text-slate-500 hover:text-slate-300'
            )}
          >
            Forecast actuel
          </button>
          <button
            onClick={() => setShowPre(true)}
            className={clsx(
              'px-3 py-1.5 rounded-md font-medium border transition-colors',
              showPre ? 'bg-blue-600/20 text-blue-300 border-blue-700' : 'border-slate-800 text-slate-500 hover:text-slate-300'
            )}
          >
            Pré-tournoi
          </button>
        </div>
        <span className="text-xs text-slate-500">
          {forecast.players.length} joueurs · % de chance d&apos;atteindre chaque round
        </span>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 uppercase text-xs">
              <tr>
                <th
                  onClick={() => toggleSort('name')}
                  className="px-3 py-2.5 text-left cursor-pointer hover:text-slate-100"
                >
                  <span className="inline-flex items-center gap-1">Joueur <SortIcon k="name" /></span>
                </th>
                {rounds.map(r => (
                  <th
                    key={r}
                    onClick={() => toggleSort(r)}
                    className="px-3 py-2.5 text-right cursor-pointer hover:text-slate-100"
                  >
                    <span className="inline-flex items-center gap-1 flex-row-reverse">{r} <SortIcon k={r} /></span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sorted.map((p, i) => {
                if (p.name === 'Bye') return null
                return (
                  <tr key={`${p.name}-${i}`} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <PlayerLabel p={p} />
                    </td>
                    {rounds.map(r => {
                      const v = p.probabilities[r]
                      return (
                        <td key={r} className={clsx('px-3 py-2 text-right font-mono text-xs', probColor(v))}>
                          {pct(v) ?? '—'}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

// ---------------- Upcoming tab ----------------
function UpcomingTab({ matches }: { matches: UpcomingMatch[] }) {
  if (matches.length === 0)
    return <div className="card p-8 text-center text-slate-500">Aucun match programmé pour le moment.</div>

  // Group by round
  const grouped: Record<string, UpcomingMatch[]> = {}
  for (const m of matches) {
    const r = m.round || 'Autre'
    if (!grouped[r]) grouped[r] = []
    grouped[r].push(m)
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([round, items]) => (
        <div key={round}>
          <h3 className="text-sm font-semibold text-slate-300 mb-2">
            {round} <span className="text-slate-500 font-normal">({items.length})</span>
          </h3>
          <div className="grid gap-2 md:grid-cols-2">
            {items.map((m, i) => (
              <div key={i} className="card p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <PlayerLabel p={m.player1} />
                  <span className="text-slate-600 text-xs font-bold">vs</span>
                  <PlayerLabel p={m.player2} />
                </div>
                {m.h2h_record && (
                  <div className="mt-1.5 text-xs text-slate-500">
                    H2H : <span className="font-mono text-slate-400">{m.h2h_record}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ---------------- Completed tab ----------------
function CompletedTab({ matches }: { matches: CompletedMatch[] }) {
  if (matches.length === 0)
    return <div className="card p-8 text-center text-slate-500">Aucun match joué pour le moment.</div>

  const grouped: Record<string, CompletedMatch[]> = {}
  for (const m of matches) {
    const r = m.round || 'Autre'
    if (!grouped[r]) grouped[r] = []
    grouped[r].push(m)
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([round, items]) => (
        <div key={round}>
          <h3 className="text-sm font-semibold text-slate-300 mb-2">
            {round} <span className="text-slate-500 font-normal">({items.length})</span>
          </h3>
          <div className="card divide-y divide-slate-800">
            {items.map((m, i) => (
              <div key={i} className="px-3 py-2 text-sm hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-emerald-400 font-semibold">
                      <PlayerLabel p={m.winner} />
                    </span>
                    <span className="text-slate-600 text-xs">d.</span>
                    <span className="text-slate-400">
                      <PlayerLabel p={m.loser} />
                    </span>
                  </div>
                  {m.score && (
                    <span className="whitespace-nowrap pb-2">
                      <Score score={m.score} />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ---------------- Bracket tab ----------------
function BracketTab({ predictions }: { predictions: Record<string, UpcomingMatch[]> }) {
  const orderedRounds = ['F', 'SF', 'QF', 'R16', 'R32', 'R64']
  const present = orderedRounds.filter(r => predictions[r] && predictions[r].length > 0)

  if (present.length === 0)
    return <div className="card p-8 text-center text-slate-500">Pas de prédictions de bracket disponibles.</div>

  return (
    <>
      <p className="text-xs text-slate-500 mb-4">
        Matchs prédits par le modèle Tennis Abstract pour chaque round (basé sur les probabilités actuelles).
      </p>
      <div className="space-y-4">
        {present.map(r => (
          <div key={r}>
            <h3 className="text-sm font-semibold text-slate-300 mb-2">
              {r === 'F' ? 'Finale' : r === 'SF' ? 'Demi-finales' : r === 'QF' ? 'Quarts' : r}
              <span className="text-slate-500 font-normal ml-1">({predictions[r].length})</span>
            </h3>
            <div className="grid gap-2 md:grid-cols-2">
              {predictions[r].map((m, i) => (
                <div key={i} className="card p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <PlayerLabel p={m.player1} />
                    <span className="text-slate-600 text-xs font-bold">vs</span>
                    <PlayerLabel p={m.player2} />
                  </div>
                  {m.h2h_record && (
                    <div className="mt-1.5 text-xs text-slate-500">
                      H2H : <span className="font-mono text-slate-400">{m.h2h_record}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// ---------------- Main page ----------------
export default function TournamentDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug
  const [tab, setTab] = useState<Tab>('forecast')

  const { data, isLoading, error } = useQuery({
    queryKey: ['tournament', slug],
    queryFn: () => axios.get<TournamentDetail>(`${API_BASE}/api/tournaments/${slug}`).then(r => r.data),
    enabled: !!slug,
    staleTime: 30 * 60 * 1000,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/tournaments"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-4"
      >
        <ChevronLeft size={16} /> Tous les tournois
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <Trophy size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-100">
              {data?.title || data?.tournament_name || slug}
            </h1>
            {data && (
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="badge bg-slate-800 text-slate-300 border-slate-700">{data.tour}</span>
                <span>{data.counts.players} joueurs</span>
                <span className="text-slate-700">·</span>
                <span>{data.counts.upcoming} à venir</span>
                <span className="text-slate-700">·</span>
                <span>{data.counts.completed} joués</span>
                <span className="text-slate-700">·</span>
                <a
                  href={data.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  Page Tennis Abstract <ExternalLink size={10} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && <div className="card p-8 text-center text-slate-400">Chargement du tableau…</div>}

      {/* Error */}
      {error && (
        <div className="card p-8 text-center">
          <p className="text-red-400 mb-2">Tournoi introuvable</p>
          <p className="text-xs text-slate-500">
            Le slug <code className="text-slate-300">{slug}</code> n&apos;a pas de fichier scrapé.
          </p>
        </div>
      )}

      {/* Tabs */}
      {data && !isLoading && (
        <>
          <div className="flex items-center gap-2 border-b border-slate-800 mb-6 overflow-x-auto">
            {(Object.entries(TAB_LABELS) as [Tab, typeof TAB_LABELS[Tab]][]).map(([key, { label, icon: Icon }]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={clsx(
                  'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap inline-flex items-center gap-1.5',
                  tab === key ? 'text-blue-400 border-blue-400' : 'text-slate-500 border-transparent hover:text-slate-300'
                )}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {tab === 'forecast' && <ForecastTab data={data} />}
          {tab === 'upcoming' && <UpcomingTab matches={data.upcoming_matches} />}
          {tab === 'completed' && <CompletedTab matches={data.completed_matches} />}
          {tab === 'bracket' && <BracketTab predictions={data.bracket_predictions} />}

          <TennisAbstractCredit scrapedAt={data.scraped_at} sourceUrl={data.source_url} />
        </>
      )}
    </div>
  )
}
