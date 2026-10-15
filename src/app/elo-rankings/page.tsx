'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Activity, ArrowUp, ArrowDown, ArrowUpDown, ExternalLink } from 'lucide-react'
import { clsx } from 'clsx'
import { TennisAbstractCredit } from '@/components/ui/TennisAbstractCredit'

interface EloPlayer {
  rank: number
  name: string
  age: number | null
  elo: number | null
  hard_rank: number | null
  hard_elo: number | null
  clay_rank: number | null
  clay_elo: number | null
  grass_rank: number | null
  grass_elo: number | null
  peak_elo: number | null
  peak_date: string | null
  atp_rank: number | null
  atp_rank_delta: number | null
  profile_url: string
}

interface EloPayload {
  scraped_at: string
  source: string
  gender: string
  license: string
  credit: string
  count: number
  players: EloPlayer[]
}

type Gender = 'men' | 'women'
type SurfaceFilter = 'overall' | 'hard' | 'clay' | 'grass'
type SortKey = 'rank' | 'name' | 'age' | 'elo' | 'peak_elo' | 'atp_rank'
type SortDir = 'asc' | 'desc'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const PAGE_SIZE = 50

const SURFACES: { key: SurfaceFilter; label: string; color: string }[] = [
  { key: 'overall', label: 'Global',  color: 'text-slate-200' },
  { key: 'hard',    label: 'Hard',    color: 'text-blue-400' },
  { key: 'clay',    label: 'Terre',   color: 'text-orange-400' },
  { key: 'grass',   label: 'Gazon',   color: 'text-emerald-400' },
]

export default function EloRankingsPage() {
  const [gender, setGender] = useState<Gender>('men')
  const [surface, setSurface] = useState<SurfaceFilter>('overall')
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ['elo-leaders', gender],
    queryFn: () => axios.get<EloPayload>(`${API_BASE}/api/elo-leaders?gender=${gender}`).then(r => r.data),
    staleTime: 30 * 60 * 1000,
  })

  const filteredSorted = useMemo(() => {
    if (!data?.players) return []
    const q = search.trim().toLowerCase()
    let players = q ? data.players.filter(p => p.name.toLowerCase().includes(q)) : [...data.players]

    // Re-sort by surface-specific Elo if a surface is selected
    if (surface !== 'overall' && sortKey === 'rank') {
      const surfaceRankKey = (`${surface}_rank`) as keyof EloPlayer
      players = players.sort((a, b) => {
        const av = a[surfaceRankKey] as number | null
        const bv = b[surfaceRankKey] as number | null
        if (av == null && bv == null) return 0
        if (av == null) return 1
        if (bv == null) return -1
        return av - bv
      })
    } else {
      const key = sortKey
      players = players.sort((a, b) => {
        const av = a[key], bv = b[key]
        if (av == null && bv == null) return 0
        if (av == null) return 1
        if (bv == null) return -1
        if (typeof av === 'number' && typeof bv === 'number') {
          return sortDir === 'asc' ? av - bv : bv - av
        }
        return sortDir === 'asc'
          ? String(av).localeCompare(String(bv), 'fr')
          : String(bv).localeCompare(String(av), 'fr')
      })
    }
    return players
  }, [data, search, surface, sortKey, sortDir])

  const paginated = useMemo(
    () => filteredSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredSorted, page]
  )

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE))

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir(key === 'name' ? 'asc' : key === 'rank' || key === 'atp_rank' ? 'asc' : 'desc')
    }
    setPage(1)
  }

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown size={11} className="opacity-40" />
    return sortDir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />
  }

  // Get the current surface's Elo and rank for a player
  const getEloFor = (p: EloPlayer): { rank: number | null; elo: number | null } => {
    if (surface === 'overall') return { rank: p.rank, elo: p.elo }
    return {
      rank: p[`${surface}_rank`] as number | null,
      elo: p[`${surface}_elo`] as number | null,
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Activity size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Classement Elo</h1>
            <p className="text-sm text-slate-400">
              Système Elo de Tennis Abstract — bien meilleur indicateur de forme que le classement officiel
            </p>
          </div>
        </div>
      </div>

      {/* Gender tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 mb-4">
        {(['men', 'women'] as Gender[]).map(g => (
          <button
            key={g}
            onClick={() => { setGender(g); setPage(1) }}
            className={clsx(
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
              gender === g
                ? g === 'men' ? 'text-blue-400 border-blue-400' : 'text-pink-400 border-pink-400'
                : 'text-slate-500 border-transparent hover:text-slate-300'
            )}
          >
            {g === 'men' ? 'Hommes' : 'Femmes'}
            {data && data.gender === g && (
              <span className="ml-1.5 text-xs text-slate-500 font-mono">({data.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Surface filter */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs text-slate-500 mr-1">Surface :</span>
        {SURFACES.map(s => (
          <button
            key={s.key}
            onClick={() => { setSurface(s.key); setPage(1) }}
            className={clsx(
              'px-3 py-1 rounded-full text-xs font-medium border transition-all',
              surface === s.key
                ? `${s.color} border-current bg-current/10`
                : 'text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-300'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher un joueur…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="w-full md:w-80 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Loading */}
      {isLoading && <div className="card p-8 text-center text-slate-400">Chargement du classement Elo…</div>}

      {/* Error */}
      {error && (
        <div className="card p-8 text-center">
          <p className="text-red-400 mb-2">Impossible de charger le classement Elo</p>
          <p className="text-xs text-slate-500">
            Run : <code className="text-slate-300">python data/tennis_abstract/scrape.py</code>
          </p>
        </div>
      )}

      {/* Table */}
      {data && !isLoading && (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 uppercase text-xs tracking-wider">
                  <tr>
                    <th onClick={() => toggleSort('rank')} className="px-3 py-3 text-right cursor-pointer hover:text-slate-100 select-none">
                      <span className="inline-flex items-center gap-1 flex-row-reverse">Rang <SortIcon k="rank" /></span>
                    </th>
                    <th onClick={() => toggleSort('name')} className="px-3 py-3 text-left cursor-pointer hover:text-slate-100 select-none">
                      <span className="inline-flex items-center gap-1">Joueur <SortIcon k="name" /></span>
                    </th>
                    <th onClick={() => toggleSort('age')} className="px-3 py-3 text-right cursor-pointer hover:text-slate-100 select-none">
                      <span className="inline-flex items-center gap-1 flex-row-reverse">Âge <SortIcon k="age" /></span>
                    </th>
                    <th onClick={() => toggleSort('elo')} className="px-3 py-3 text-right cursor-pointer hover:text-slate-100 select-none">
                      <span className="inline-flex items-center gap-1 flex-row-reverse">Elo {surface !== 'overall' && <span className="text-[10px] opacity-60">(global)</span>} <SortIcon k="elo" /></span>
                    </th>
                    <th className="px-3 py-3 text-right text-blue-400">Hard</th>
                    <th className="px-3 py-3 text-right text-orange-400">Terre</th>
                    <th className="px-3 py-3 text-right text-emerald-400">Gazon</th>
                    <th onClick={() => toggleSort('peak_elo')} className="px-3 py-3 text-right cursor-pointer hover:text-slate-100 select-none">
                      <span className="inline-flex items-center gap-1 flex-row-reverse">Peak <SortIcon k="peak_elo" /></span>
                    </th>
                    <th onClick={() => toggleSort('atp_rank')} className="px-3 py-3 text-right cursor-pointer hover:text-slate-100 select-none">
                      <span className="inline-flex items-center gap-1 flex-row-reverse">{gender === 'men' ? 'ATP' : 'WTA'} <SortIcon k="atp_rank" /></span>
                    </th>
                    <th className="px-3 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {paginated.map(p => {
                    const eloDisplay = getEloFor(p)
                    return (
                      <tr key={`${p.name}-${p.rank}`} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-3 py-2.5 text-right font-mono">
                          <span className={clsx(
                            'inline-block min-w-[2rem] text-right',
                            (eloDisplay.rank ?? 999) <= 10 && 'text-purple-400 font-bold',
                            (eloDisplay.rank ?? 999) > 10 && (eloDisplay.rank ?? 999) <= 50 && 'text-slate-200',
                            (eloDisplay.rank ?? 999) > 50 && 'text-slate-400'
                          )}>
                            {eloDisplay.rank ?? '—'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-medium text-slate-100 whitespace-nowrap">{p.name}</td>
                        <td className="px-3 py-2.5 text-right text-slate-400 font-mono">{p.age?.toFixed(1) ?? '—'}</td>
                        <td className={clsx('px-3 py-2.5 text-right font-mono font-semibold', surface === 'overall' ? 'text-slate-100' : 'text-slate-500')}>
                          {p.elo?.toFixed(0) ?? '—'}
                        </td>
                        <td className={clsx('px-3 py-2.5 text-right font-mono', surface === 'hard' ? 'text-blue-400 font-semibold' : 'text-slate-400')}>
                          {p.hard_elo?.toFixed(0) ?? '—'}
                        </td>
                        <td className={clsx('px-3 py-2.5 text-right font-mono', surface === 'clay' ? 'text-orange-400 font-semibold' : 'text-slate-400')}>
                          {p.clay_elo?.toFixed(0) ?? '—'}
                        </td>
                        <td className={clsx('px-3 py-2.5 text-right font-mono', surface === 'grass' ? 'text-emerald-400 font-semibold' : 'text-slate-400')}>
                          {p.grass_elo?.toFixed(0) ?? '—'}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-slate-400">
                          {p.peak_elo?.toFixed(0) ?? '—'}
                          {p.peak_date && <span className="text-[10px] text-slate-600 ml-1">({p.peak_date})</span>}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-slate-300">{p.atp_rank ?? '—'}</td>
                        <td className="px-3 py-2.5">
                          <a
                            href={p.profile_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-blue-400 transition-colors"
                            title="Profil Tennis Abstract"
                          >
                            <ExternalLink size={13} />
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                        Aucun joueur ne correspond à « {search} »
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredSorted.length)} sur {filteredSorted.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-2 py-1 rounded text-slate-400 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← Préc.
                  </button>
                  <span className="px-3 text-slate-300 font-mono">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-2 py-1 rounded text-slate-400 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Suiv. →
                  </button>
                </div>
              </div>
            )}
          </div>

          <TennisAbstractCredit scrapedAt={data.scraped_at} sourceUrl={data.source} />
        </>
      )}
    </div>
  )
}
