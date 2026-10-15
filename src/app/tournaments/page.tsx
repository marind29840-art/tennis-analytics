'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { Trophy, ExternalLink, Star } from 'lucide-react'
import { clsx } from 'clsx'
import { TennisAbstractCredit } from '@/components/ui/TennisAbstractCredit'

interface Tournament {
  tournament_name: string
  forecast_url: string | null
  forecast_label: string | null
  favorite_name: string | null
  favorite_probability: number | null
  favorite_profile_url: string | null
  slug: string | null
  tour: string
}

interface TourPayload {
  scraped_at: string
  source: string
  tour: string
  license: string
  credit: string
  count: number
  tournaments: Tournament[]
}

interface AllTours {
  atp: TourPayload
  wta: TourPayload
  challenger: TourPayload
}

type TourKey = 'atp' | 'wta' | 'challenger'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

const TABS: { key: TourKey; label: string; description: string; color: string }[] = [
  { key: 'atp', label: 'ATP', description: 'Circuit professionnel masculin', color: 'text-blue-400' },
  { key: 'wta', label: 'WTA', description: 'Circuit professionnel féminin', color: 'text-pink-400' },
  { key: 'challenger', label: 'Challenger', description: 'Circuit secondaire masculin', color: 'text-amber-400' },
]

function TournamentCard({ t }: { t: Tournament }) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-100 mb-1 truncate">{t.tournament_name}</h3>
          {t.favorite_name ? (
            <div className="flex items-center gap-1.5 text-sm text-slate-300">
              <Star size={13} className="text-amber-400 flex-shrink-0" />
              <span className="truncate">{t.favorite_name}</span>
              {t.favorite_probability != null && (
                <span className="text-slate-500 font-mono text-xs ml-auto flex-shrink-0">
                  {(t.favorite_probability * 100).toFixed(1)}%
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">Pas encore de favori désigné</p>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-blue-400 group-hover:text-blue-300 font-medium">
          Voir le tableau et les matchs →
        </span>
        {t.forecast_url && (
          <a
            href={t.forecast_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1"
            title="Source originale Tennis Abstract"
          >
            <ExternalLink size={11} />
          </a>
        )}
      </div>
    </>
  )

  if (t.slug) {
    return (
      <Link
        href={`/tournaments/${t.slug}`}
        className="card p-4 hover:border-slate-700 hover:bg-slate-800/30 transition-all cursor-pointer block group"
      >
        {inner}
      </Link>
    )
  }
  return <div className="card p-4">{inner}</div>
}

export default function TournamentsPage() {
  const [activeTab, setActiveTab] = useState<TourKey>('atp')

  const { data, isLoading, error } = useQuery({
    queryKey: ['tournaments', 'all'],
    queryFn: () => axios.get<AllTours>(`${API_BASE}/api/tournaments/current`).then(r => r.data),
    staleTime: 30 * 60 * 1000,
  })

  const active = data?.[activeTab]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center">
            <Trophy size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Tournois en cours</h1>
            <p className="text-sm text-slate-400">
              Calendrier ATP, WTA et Challenger avec favoris désignés par les modèles Tennis Abstract
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 mb-6 overflow-x-auto">
        {TABS.map(tab => {
          const count = data?.[tab.key]?.count ?? 0
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap',
                activeTab === tab.key
                  ? `${tab.color} border-current`
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              )}
            >
              {tab.label}
              {count > 0 && (
                <span className="ml-1.5 text-xs text-slate-500 font-mono">({count})</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Description */}
      {active && (
        <p className="text-xs text-slate-500 mb-4">{TABS.find(t => t.key === activeTab)?.description}</p>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="h-5 bg-slate-800 rounded w-2/3 mb-2" />
              <div className="h-4 bg-slate-800 rounded w-1/2 mb-3" />
              <div className="h-3 bg-slate-800 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="card p-8 text-center">
          <p className="text-red-400 mb-2">Impossible de charger les tournois</p>
          <p className="text-xs text-slate-500">
            Vérifie que le scrape Tennis Abstract a tourné. Run :{' '}
            <code className="text-slate-300">python data/tennis_abstract/scrape.py</code>
          </p>
        </div>
      )}

      {/* Content */}
      {active && !isLoading && (
        <>
          {active.tournaments.length === 0 ? (
            <div className="card p-8 text-center text-slate-400">
              Aucun tournoi {TABS.find(t => t.key === activeTab)?.label} en cours actuellement.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {active.tournaments.map((t, i) => (
                <TournamentCard key={`${t.tournament_name}-${i}`} t={t} />
              ))}
            </div>
          )}

          <TennisAbstractCredit scrapedAt={active.scraped_at} sourceUrl={active.source} />
        </>
      )}
    </div>
  )
}
