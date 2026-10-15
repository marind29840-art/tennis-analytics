'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowUp, ArrowDown, ArrowUpDown, ExternalLink, ListOrdered } from 'lucide-react'
import { clsx } from 'clsx'
import { getCountryFlag } from '@/lib/utils'

interface ATPPlayer {
  rank: number
  name: string
  points: number
  country: string
  country_code: string
  age: number | null
  player_id: string
  profile_url: string
}

interface ATPRankingResponse {
  scraped_at: string
  source: string
  count: number
  age_matched: number
  players: ATPPlayer[]
}

type SortKey = 'rank' | 'name' | 'points' | 'country' | 'age'
type SortDir = 'asc' | 'desc'

const COLUMNS: { key: SortKey; label: string; align?: 'left' | 'right' }[] = [
  { key: 'rank',    label: 'Rang',     align: 'right' },
  { key: 'name',    label: 'Joueur',   align: 'left' },
  { key: 'country', label: 'Pays',     align: 'left' },
  { key: 'age',     label: 'Âge',      align: 'right' },
  { key: 'points',  label: 'Points',   align: 'right' },
]

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function ATPRankingsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['atp-rankings'],
    queryFn: () => axios.get<ATPRankingResponse>(`${API_BASE}/api/atp-rankings`).then(r => r.data),
    staleTime: 60 * 60 * 1000,
  })

  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [search, setSearch] = useState('')

  const filteredSorted = useMemo(() => {
    if (!data?.players) return []
    const q = search.trim().toLowerCase()
    const filtered = q
      ? data.players.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          p.country_code.toLowerCase().includes(q)
        )
      : data.players

    const sorted = [...filtered].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey]
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
    return sorted
  }, [data, sortKey, sortDir, search])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'name' || key === 'country' ? 'asc' : key === 'rank' ? 'asc' : 'desc')
    }
  }

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown size={12} className="opacity-40" />
    return sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <ListOrdered size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Classement ATP</h1>
            <p className="text-sm text-slate-400">
              Top 100 du circuit professionnel masculin — données ATP officielles
            </p>
          </div>
        </div>

        {data && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-3">
            <span>
              Dernière extraction : <span className="text-slate-300 font-mono">
                {new Date(data.scraped_at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </span>
            <span className="text-slate-700">•</span>
            <span>{data.count} joueurs</span>
            <span className="text-slate-700">•</span>
            <span>Source : <span className="text-slate-300">atptour.com</span></span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher un joueur ou un pays…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-80 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* States */}
      {isLoading && (
        <div className="card p-8 text-center text-slate-400">Chargement du classement…</div>
      )}

      {error && (
        <div className="card p-8 text-center">
          <p className="text-red-400 mb-2">Impossible de charger le classement</p>
          <p className="text-xs text-slate-500">
            Vérifie que le backend est démarré et que <code className="text-slate-300">data/atp_top100.json</code> existe.
          </p>
        </div>
      )}

      {/* Table */}
      {data && !isLoading && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 uppercase text-xs tracking-wider">
                <tr>
                  {COLUMNS.map(col => (
                    <th
                      key={col.key}
                      onClick={() => toggleSort(col.key)}
                      className={clsx(
                        'px-4 py-3 cursor-pointer select-none hover:text-slate-100 transition-colors',
                        col.align === 'right' ? 'text-right' : 'text-left'
                      )}
                    >
                      <span className={clsx('inline-flex items-center gap-1.5', col.align === 'right' && 'flex-row-reverse')}>
                        {col.label}
                        <SortIcon k={col.key} />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredSorted.map(p => (
                  <tr key={p.player_id || p.rank} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-right font-mono">
                      <span className={clsx(
                        'inline-block min-w-[2.5rem] text-right',
                        p.rank <= 10 && 'text-blue-400 font-bold',
                        p.rank > 10 && p.rank <= 50 && 'text-slate-200',
                        p.rank > 50 && 'text-slate-400'
                      )}>
                        {p.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-100">{p.name}</td>
                    <td className="px-4 py-3 text-slate-300">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-base leading-none">{getCountryFlag(p.country_code)}</span>
                        <span>{p.country}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-300">
                      {p.age ?? <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-100 font-semibold">
                      {p.points.toLocaleString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={p.profile_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-blue-400 transition-colors inline-block"
                        title="Profil ATP officiel"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </td>
                  </tr>
                ))}
                {filteredSorted.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      Aucun joueur ne correspond à « {search} »
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredSorted.length > 0 && (
            <div className="px-4 py-2 border-t border-slate-800 text-xs text-slate-500">
              {filteredSorted.length} joueur{filteredSorted.length > 1 ? 's' : ''} affiché{filteredSorted.length > 1 ? 's' : ''}
              {search && ` (filtre "${search}")`}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
