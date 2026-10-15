import { ScoreGauge } from '@/components/ui/ScoreGauge'
import type { ServiceStats, ReturnStats } from '@/lib/types'

interface ServiceReturnModuleProps {
  p1Name: string
  p2Name: string
  service1?: ServiceStats
  service2?: ServiceStats
  return1?: ReturnStats
  return2?: ReturnStats
}

function StatRow({ label, v1, v2, format = 'pct' }: { label: string; v1?: number; v2?: number; format?: 'pct' | 'num' }) {
  if (v1 == null && v2 == null) return null
  const fmt = (v?: number) => {
    if (v == null) return '—'
    return format === 'pct' ? `${v.toFixed(1)}%` : v.toFixed(1)
  }
  const better1 = v1 != null && v2 != null && v1 > v2
  const better2 = v1 != null && v2 != null && v2 > v1
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-slate-800/60 last:border-0">
      <span className={`w-20 text-right text-xs font-mono font-medium ${better1 ? 'text-emerald-400' : 'text-slate-300'}`}>{fmt(v1)}</span>
      <span className="flex-1 text-center text-xs text-slate-500">{label}</span>
      <span className={`w-20 text-xs font-mono font-medium ${better2 ? 'text-emerald-400' : 'text-slate-300'}`}>{fmt(v2)}</span>
    </div>
  )
}

export function ServiceReturnModule({ p1Name, p2Name, service1, service2, return1, return2 }: ServiceReturnModuleProps) {
  return (
    <div className="space-y-4">
      {/* Service */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Service</h3>
        <div className="flex items-center justify-around mb-4">
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-2">{p1Name.split(' ').pop()}</div>
            {service1 && <ScoreGauge score={service1.service_score} label="Service" size="md" />}
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-2">{p2Name.split(' ').pop()}</div>
            {service2 && <ScoreGauge score={service2.service_score} label="Service" size="md" />}
          </div>
        </div>
        <StatRow label="Aces / match" v1={service1?.aces_per_match} v2={service2?.aces_per_match} format="num" />
        <StatRow label="1ère balle %" v1={service1?.first_serve_pct} v2={service2?.first_serve_pct} />
        <StatRow label="1ère balle gagnée %" v1={service1?.first_serve_won_pct} v2={service2?.first_serve_won_pct} />
        <StatRow label="2ème balle gagnée %" v1={service1?.second_serve_won_pct} v2={service2?.second_serve_won_pct} />
        <StatRow label="Balles de break sauvées %" v1={service1?.break_points_saved_pct} v2={service2?.break_points_saved_pct} />
        <StatRow label="Jeux de service gagnés %" v1={service1?.service_games_won_pct} v2={service2?.service_games_won_pct} />
      </div>

      {/* Return */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Retour</h3>
        <div className="flex items-center justify-around mb-4">
          <div className="text-center">
            {return1 && <ScoreGauge score={return1.return_score} label="Retour" size="md" />}
          </div>
          <div className="text-center">
            {return2 && <ScoreGauge score={return2.return_score} label="Retour" size="md" />}
          </div>
        </div>
        <StatRow label="Balles de break converties %" v1={return1?.break_points_converted_pct} v2={return2?.break_points_converted_pct} />
        <StatRow label="Jeux de retour gagnés %" v1={return1?.return_games_won_pct} v2={return2?.return_games_won_pct} />
        <StatRow label="1ère balle de retour gagnée %" v1={return1?.first_return_won_pct} v2={return2?.first_return_won_pct} />
        <StatRow label="2ème balle de retour gagnée %" v1={return1?.second_return_won_pct} v2={return2?.second_return_won_pct} />
      </div>
    </div>
  )
}
