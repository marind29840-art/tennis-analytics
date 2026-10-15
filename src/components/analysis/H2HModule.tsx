import type { H2HRecord } from '@/lib/types'
import { SurfaceBadge } from '@/components/ui/SurfaceBadge'
import { formatMatchDate } from '@/lib/utils'

interface H2HModuleProps {
  p1Name: string
  p2Name: string
  data: H2HRecord
  surface?: string
}

export function H2HModule({ p1Name, p2Name, data, surface }: H2HModuleProps) {
  const total = data.total_matches
  const p1Pct = total > 0 ? (data.p1_wins / total) * 100 : 50

  return (
    <div className="card p-4 space-y-5">
      <h3 className="text-sm font-semibold text-slate-300">Face à face</h3>

      {/* Overall record */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold font-mono text-blue-400">{data.p1_wins}</div>
          <div className="text-xs text-slate-500">{p1Name.split(' ').pop()}</div>
        </div>
        <div className="flex-1">
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden flex">
            <div className="bg-blue-600 transition-all" style={{ width: `${p1Pct}%` }} />
            <div className="bg-slate-600 flex-1" />
          </div>
          <div className="text-center text-xs text-slate-500 mt-1">{total} matchs joués</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold font-mono text-slate-400">{data.p2_wins}</div>
          <div className="text-xs text-slate-500">{p2Name.split(' ').pop()}</div>
        </div>
      </div>

      {/* Surface-specific */}
      {surface && data.surface_matches > 0 && (
        <div className="rounded-lg bg-slate-800/40 p-3">
          <div className="flex items-center gap-2 mb-2">
            <SurfaceBadge surface={surface} />
            <span className="text-xs text-slate-400">({data.surface_matches} matchs)</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className={`font-bold font-mono ${data.surface_p1_wins > data.surface_p2_wins ? 'text-blue-400' : 'text-slate-400'}`}>
              {data.surface_p1_wins}
            </span>
            <span className="text-slate-600 text-xs">vs</span>
            <span className={`font-bold font-mono ${data.surface_p2_wins > data.surface_p1_wins ? 'text-blue-400' : 'text-slate-400'}`}>
              {data.surface_p2_wins}
            </span>
          </div>
        </div>
      )}

      {/* Meetings list */}
      {data.last_meetings && data.last_meetings.length > 0 && (
        <div>
          <div className="text-xs text-slate-500 mb-2">Dernières confrontations</div>
          <div className="space-y-1">
            {data.last_meetings.map((m, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-slate-800/50 last:border-0 text-xs">
                <span className="text-slate-600 w-20 flex-shrink-0">{formatMatchDate(m.date)}</span>
                <SurfaceBadge surface={m.surface} />
                <span className="flex-1 text-slate-400 truncate">{m.tournament_name} — {m.round}</span>
                <span className="text-slate-300 font-mono">{m.score}</span>
                <span className={`font-medium ${m.winner_name.includes(p1Name.split(' ').pop() || '') ? 'text-blue-400' : 'text-slate-400'}`}>
                  {m.winner_name.split(' ').pop()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {total === 0 && (
        <p className="text-sm text-slate-500 text-center py-2">Aucune confrontation directe enregistrée</p>
      )}
    </div>
  )
}
