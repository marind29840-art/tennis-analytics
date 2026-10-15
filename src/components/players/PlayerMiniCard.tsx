import Link from 'next/link'
import type { PlayerProfile } from '@/lib/types'
import { getCountryFlag } from '@/lib/utils'
import { ScoreGauge } from '@/components/ui/ScoreGauge'

interface PlayerMiniCardProps {
  player: PlayerProfile
}

export function PlayerMiniCard({ player }: PlayerMiniCardProps) {
  return (
    <Link href={`/players/${player.id}`}>
      <div className="card p-4 hover:border-slate-700 transition-all cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-semibold text-slate-100">{player.name}</div>
            <div className="text-xs text-slate-500">
              {getCountryFlag(player.country_code)} {player.country_name} · #{player.ranking}
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>{player.category}</div>
            <div>{player.plays}</div>
          </div>
        </div>
        <div className="flex items-center gap-4 justify-around">
          <ScoreGauge score={player.form_score} label="Forme" size="sm" />
          <ScoreGauge score={player.service_score} label="Service" size="sm" />
          <ScoreGauge score={player.return_score} label="Retour" size="sm" />
          <ScoreGauge score={Math.max(0, 100 - player.fatigue_score)} label="Énergie" size="sm" />
        </div>
      </div>
    </Link>
  )
}
