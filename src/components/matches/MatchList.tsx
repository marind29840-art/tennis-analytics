import { MatchCard } from './MatchCard'
import type { MatchListItem } from '@/lib/types'

interface MatchListProps {
  matches: MatchListItem[]
  loading?: boolean
  error?: Error | null
}

export function MatchList({ matches, loading, error }: MatchListProps) {
  if (loading) return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card p-4 animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-2/3 mb-3" />
          <div className="h-8 bg-slate-800 rounded mb-3" />
          <div className="h-6 bg-slate-800 rounded mb-2" />
          <div className="h-4 bg-slate-800 rounded w-1/2" />
        </div>
      ))}
    </div>
  )

  if (error) return (
    <div className="card p-8 text-center text-slate-400">
      <p className="text-red-400 mb-2">Erreur de chargement</p>
      <p className="text-sm">{error.message}</p>
    </div>
  )

  if (!matches.length) return (
    <div className="card p-8 text-center text-slate-400">
      Aucun match disponible
    </div>
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {matches.map(match => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  )
}
