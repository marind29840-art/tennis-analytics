'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react'
import { TennisAbstractCredit } from '@/components/ui/TennisAbstractCredit'

interface RunEntry {
  name: string
  slug: string
  tournament_slug: string
  tournament_name: string
  wins: number
  losses: number
  alive: boolean
  elo: number | null
  elo_rank: number | null
  atp_rank: number | null
  gender: string | null
}

interface RunsPayload {
  winning_runs: RunEntry[]
  early_exits: RunEntry[]
  scraped_at: string | null
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

function PlayerLink({ name, slug }: { name: string; slug: string }) {
  return (
    <Link href={`/players/${slug}`} className="text-slate-100 hover:text-blue-400 transition-colors font-medium">
      {name}
    </Link>
  )
}

function RunRow({ r, type }: { r: RunEntry; type: 'win' | 'loss' }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800/40 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <PlayerLink name={r.name} slug={r.slug} />
          {r.elo_rank != null && r.elo_rank <= 100 && (
            <span className="text-xs text-slate-500 font-mono">#{r.elo_rank} Elo</span>
          )}
        </div>
        <Link
          href={`/tournaments/${r.tournament_slug}`}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors block truncate"
        >
          {r.tournament_name}
        </Link>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {type === 'win' ? (
          <>
            <span className="font-mono font-bold text-emerald-400">{r.wins}V</span>
            {r.alive ? (
              <span className="badge text-emerald-300 bg-emerald-950 border-emerald-800">en lice</span>
            ) : (
              <span className="badge text-slate-400 bg-slate-800 border-slate-700">éliminé</span>
            )}
          </>
        ) : (
          <span className="font-mono font-bold text-red-400">{r.losses}D</span>
        )}
      </div>
    </div>
  )
}

export default function StreaksPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['feed', 'runs'],
    queryFn: () => axios.get<RunsPayload>(`${API_BASE}/api/feed/runs`).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <BarChart2 size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Séries en cours</h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Joueurs sur une série de victoires (ou de défaites) sur leur tournoi en cours.
            </p>
          </div>
        </div>
      </div>

      {isLoading && <div className="card p-8 text-center text-slate-400">Calcul des séries…</div>}
      {error && <div className="card p-8 text-center text-red-400">Impossible de charger les séries</div>}

      {data && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Winning runs */}
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-100">Séries de victoires en cours</h2>
              <span className="ml-auto text-xs text-slate-500 font-mono">
                {data.winning_runs.length}
              </span>
            </div>
            {data.winning_runs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Aucune série ≥ 2 victoires actuellement.
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {data.winning_runs.map((r, i) => (
                  <RunRow key={`win-${r.slug}-${r.tournament_slug}-${i}`} r={r} type="win" />
                ))}
              </div>
            )}
          </div>

          {/* Early exits */}
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
              <TrendingDown size={16} className="text-red-400" />
              <h2 className="text-sm font-semibold text-slate-100">Éliminations notables</h2>
              <span className="ml-auto text-xs text-slate-500 font-mono">
                {data.early_exits.length}
              </span>
            </div>
            {data.early_exits.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Aucune élimination notable récente.
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {data.early_exits.map((r, i) => (
                  <RunRow key={`loss-${r.slug}-${r.tournament_slug}-${i}`} r={r} type="loss" />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Methodology note */}
      <div className="mt-6 text-xs text-slate-500 leading-relaxed max-w-2xl">
        <strong className="text-slate-400">Méthodologie :</strong> les séries sont calculées sur les
        matchs joués dans les tournois ATP / WTA / Challenger en cours. Tennis Abstract ne fournit pas
        de date par match, donc les séries hors-tournoi (entre deux semaines) ne sont pas (encore)
        agrégées ici. Une intégration future avec les datasets Sackmann permettra des séries plus longues.
      </div>

      {data?.scraped_at && <TennisAbstractCredit scrapedAt={data.scraped_at} />}
    </div>
  )
}
