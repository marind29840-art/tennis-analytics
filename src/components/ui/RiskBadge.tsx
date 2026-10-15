import { getRiskColor } from '@/lib/utils'

export function RiskBadge({ score }: { score: number }) {
  const label = score < 40 ? 'Faible' : score <= 60 ? 'Moyen' : 'Élevé'
  return (
    <span className={`badge ${getRiskColor(score)}`} title={`Risque : ${score}/100`}>
      ⚡ {score < 40 ? '▼' : score > 60 ? '▲' : '—'} Risque {label}
    </span>
  )
}
