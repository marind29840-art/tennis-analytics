'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { ChevronLeft, Trophy, ExternalLink, User, Activity, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { TennisAbstractCredit } from '@/components/ui/TennisAbstractCredit'
import { Score } from '@/components/ui/Score'

interface PlayerOpponent {
  seed: string | null
  name: string
  country: string | null
  slug: string
  elo: number | null
  elo_rank: number | null
}

interface InTournament {
  tournament_slug: string
  tournament_name: string
  tour: string | null
  seed: string | null
  probabilities: Record<string, number | null>
}

interface UpcomingItem {
  tournament_slug: string
  tournament_name: string
  round: string | null
  opponent: PlayerOpponent
  h2h_record: string | null
}

interface CompletedItem {
  tournament_slug: string
  tournament_name: string
  round: string | null
  result: 'W' | 'L'
  opponent: PlayerOpponent
  score: string | null
}

interface PlayerProfile {
  name: string
  slug: string
  gender: string | null
  elo: number | null
  elo_rank: number | null
  hard_elo: number | null
  clay_elo: number | null
  grass_elo: number | null
  hard_rank: number | null
  clay_rank: number | null
  grass_rank: number | null
  peak_elo: number | null
  peak_date: string | null
  atp_rank: number | null
  age: number | null
  profile_url: string | null
  in_tournaments: InTournament[]
  upcoming_matches: UpcomingItem[]
  completed_matches: CompletedItem[]
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

function StatBlock({ label, value, suffix, accent }: { label: string; value: string | number | null; suffix?: string; accent?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={clsx('text-lg font-bold font-mono', accent || 'text-slate-100')}>
        {value ?? '—'}
        {value != null && suffix && <span className="text-xs text-slate-500 font-normal ml-1">{suffix}</span>}
      </div>
    </div>
  )
}

export default function PlayerProfilePage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const { data, isLoading, error } = useQuery({
    queryKey: ['player', slug],
    queryFn: () => axios.get<PlayerProfile>(`${API_BASE}/api/feed/players/${slug}`).then(r => r.data),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 mb-4">
        <ChevronLeft size={16} /> Retour aux matchs
      </Link>

      {isLoading && <div className="card p-8 text-center text-slate-400">Chargement du profil…</div>}

      {error && (
        <div className="card p-8 text-center">
          <p className="text-red-400 mb-2">Joueur introuvable</p>
          <p className="text-xs text-slate-500">
            Le slug <code className="text-slate-300">{slug}</code> ne correspond à aucun joueur dans les données actuelles.
          </p>
        </div>
      )}

      {data && (
        <>
          {/* Header */}
          <div className="card p-6 mb-6">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="w-14 h-14 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                <User size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-slate-100 mb-1">{data.name}</h1>
                <div className="flex items-center gap-3 text-sm text-slate-400 flex-wrap">
                  {data.gender && (
                    <span className={clsx(
                      'badge border-current',
                      data.gender === 'men' ? 'text-blue-400' : 'text-pink-400'
                    )}>
                      {data.gender === 'men' ? 'Homme · ATP' : 'Femme · WTA'}
                    </span>
                  )}
                  {data.age != null && <span>{data.age.toFixed(1)} ans</span>}
                  {data.atp_rank != null && (
                    <>
                      <span className="text-slate-700">·</span>
                      <span>Classement officiel #{data.atp_rank}</span>
                    </>
                  )}
                  {data.elo_rank != null && (
                    <>
                      <span className="text-slate-700">·</span>
                      <span>Elo #{data.elo_rank}</span>
                    </>
                  )}
                </div>
                {data.profile_url && (
                  <a
                    href={data.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2"
                  >
                    Profil Tennis Abstract <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Elo stats */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Activity size={14} /> Profil Elo
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <StatBlock label="Global"  value={data.elo != null ? Math.round(data.elo) : null}        accent="text-purple-300" />
              <StatBlock label="Hard"    value={data.hard_elo != null ? Math.round(data.hard_elo) : null} accent="text-blue-400" />
              <StatBlock label="Terre"   value={data.clay_elo != null ? Math.round(data.clay_elo) : null} accent="text-orange-400" />
              <StatBlock label="Gazon"   value={data.grass_elo != null ? Math.round(data.grass_elo) : null} accent="text-emerald-400" />
              <StatBlock
                label="Peak"
                value={data.peak_elo != null ? Math.round(data.peak_elo) : null}
                suffix={data.peak_date || undefined}
                accent="text-amber-400"
              />
            </div>
          </div>

          {/* Current tournaments */}
          {data.in_tournaments.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Trophy size={14} /> Tournoi(s) en cours
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {data.in_tournaments.map(t => (
                  <Link
                    key={t.tournament_slug}
                    href={`/tournaments/${t.tournament_slug}`}
                    className="card p-4 hover:border-slate-700 transition-colors block"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-100">{t.tournament_name}</span>
                      {t.seed && <span className="badge bg-slate-800 text-slate-300 border-slate-700">Seed {t.seed}</span>}
                    </div>
                    {t.probabilities && (
                      <div className="grid grid-cols-7 gap-1 mt-2">
                        {Object.entries(t.probabilities).map(([round, prob]) => {
                          const v = prob ?? 0
                          return (
                            <div key={round} className="text-center">
                              <div className="text-[10px] text-slate-500 mb-1">{round}</div>
                              <div
                                className={clsx(
                                  'text-xs font-mono py-1 rounded',
                                  v >= 0.5 ? 'bg-emerald-950 text-emerald-300' :
                                  v >= 0.2 ? 'bg-emerald-950/40 text-emerald-300' :
                                  v >= 0.05 ? 'bg-slate-800 text-slate-300' :
                                  'bg-slate-900 text-slate-600'
                                )}
                              >
                                {v > 0 ? `${(v * 100).toFixed(0)}` : '·'}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming matches */}
          {data.upcoming_matches.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Clock size={14} /> Prochain(s) match(s)
              </h2>
              <div className="card divide-y divide-slate-800">
                {data.upcoming_matches.map((m, i) => (
                  <div key={`up-${i}`} className="px-4 py-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
                        <span className="text-slate-500 text-xs">{m.round}</span>
                        <span className="text-slate-700">vs</span>
                        <Link href={`/players/${m.opponent.slug}`} className="text-slate-100 hover:text-blue-400 truncate">
                          {m.opponent.name}
                        </Link>
                        {m.opponent.elo != null && (
                          <span className="text-xs text-slate-500 font-mono">Elo {Math.round(m.opponent.elo)}</span>
                        )}
                      </div>
                      <Link href={`/tournaments/${m.tournament_slug}`} className="text-xs text-slate-500 hover:text-slate-300 truncate">
                        {m.tournament_name}
                      </Link>
                      {m.h2h_record && (
                        <span className="text-xs text-slate-500 font-mono">H2H {m.h2h_record}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed matches */}
          {data.completed_matches.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-slate-300 mb-3">
                Matchs joués sur les tournois en cours ({data.completed_matches.length})
              </h2>
              <div className="card divide-y divide-slate-800">
                {data.completed_matches.map((m, i) => (
                  <div key={`done-${i}`} className="px-4 py-2.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap text-sm">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {m.result === 'W' ? (
                          <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                        ) : (
                          <XCircle size={14} className="text-red-400 flex-shrink-0" />
                        )}
                        <span className="text-slate-500 text-xs">{m.round}</span>
                        <span className="text-slate-700">vs</span>
                        <Link href={`/players/${m.opponent.slug}`} className="text-slate-100 hover:text-blue-400 truncate">
                          {m.opponent.name}
                        </Link>
                      </div>
                      {m.score && <Score score={m.score} />}
                      <Link href={`/tournaments/${m.tournament_slug}`} className="text-xs text-slate-500 hover:text-slate-300 truncate">
                        {m.tournament_name}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.in_tournaments.length === 0 &&
           data.upcoming_matches.length === 0 &&
           data.completed_matches.length === 0 && (
            <div className="card p-6 text-center text-slate-400 text-sm">
              Ce joueur n&apos;est pas inscrit dans un tournoi en cours actuellement.
              Son Elo et son historique sont visibles dans la page <Link href="/elo-rankings" className="text-blue-400 hover:underline">Classement Elo</Link>.
            </div>
          )}

          <TennisAbstractCredit />
        </>
      )}
    </div>
  )
}
