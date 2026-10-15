import { getConfidenceColor } from '@/lib/utils'

export function ConfidenceBadge({ score }: { score: number }) {
  const label = score >= 70 ? 'Haute' : score >= 50 ? 'Moyenne' : 'Faible'
  return (
    <span className={`badge ${getConfidenceColor(score)}`} title={`Confiance : ${score}/100`}>
      ◉ {label} ({score})
    </span>
  )
}
