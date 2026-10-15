import { SurfaceBadge } from '@/components/ui/SurfaceBadge'
import { winRate } from '@/lib/utils'

interface SurfacePlayer {
  name: string
  hard_wins: number
  hard_losses: number
  clay_wins: number
  clay_losses: number
  grass_wins: number
  grass_losses: number
}

interface SurfaceModuleProps {
  p1: SurfacePlayer
  p2: SurfacePlayer
  currentSurface?: string
}

const SURFACES = [
  { key: 'hard', label: 'Dur', wKey: 'hard_wins', lKey: 'hard_losses' },
  { key: 'clay', label: 'Terre battue', wKey: 'clay_wins', lKey: 'clay_losses' },
  { key: 'grass', label: 'Gazon', wKey: 'grass_wins', lKey: 'grass_losses' },
] as const

export function SurfaceModule({ p1, p2, currentSurface }: SurfaceModuleProps) {
  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Statistiques par surface</h3>

      <div className="space-y-4">
        {SURFACES.map(({ key, label, wKey, lKey }) => {
          const w1 = p1[wKey]
          const l1 = p1[lKey]
          const w2 = p2[wKey]
          const l2 = p2[lKey]
          const wr1 = (w1 + l1) > 0 ? (w1 / (w1 + l1)) * 100 : 0
          const wr2 = (w2 + l2) > 0 ? (w2 / (w2 + l2)) * 100 : 0
          const isCurrent = currentSurface?.toLowerCase() === key

          return (
            <div key={key} className={`rounded-lg p-3 ${isCurrent ? 'bg-blue-950/30 border border-blue-900/50' : 'bg-slate-800/30'}`}>
              <div className="flex items-center gap-2 mb-2">
                <SurfaceBadge surface={label} />
                {isCurrent && <span className="text-xs text-blue-400 font-medium">Surface du match</span>}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 text-right">
                  <div className="text-xs text-slate-500">{p1.name.split(' ').pop()}</div>
                  <div className="font-mono text-sm text-slate-200">{winRate(w1, l1)}</div>
                  <div className="text-xs text-slate-600">{w1}V / {l1}D</div>
                </div>
                <div className="text-center">
                  <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden flex">
                    <div className="bg-blue-500" style={{ width: `${wr1 / (wr1 + wr2) * 100 || 50}%` }} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-500">{p2.name.split(' ').pop()}</div>
                  <div className="font-mono text-sm text-slate-200">{winRate(w2, l2)}</div>
                  <div className="text-xs text-slate-600">{w2}V / {l2}D</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
