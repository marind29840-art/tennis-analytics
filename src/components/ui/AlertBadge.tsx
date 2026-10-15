import { getAlertColor } from '@/lib/utils'
import type { Alert } from '@/lib/types'

const ICONS: Record<string, string> = {
  form: '📈',
  streak: '🔥',
  fatigue: '😴',
  surface: '🎾',
  matchup: '⚔️',
  value: '💰',
  context: '🌍',
  insufficient_data: '⚠️',
  misleading_streak: '⚠️',
  positive: '✅',
  warning: '⚠️',
  critical: '🚨',
}

export function AlertBadge({ alert }: { alert: Alert }) {
  const icon = ICONS[alert.type] || ICONS[alert.level] || '•'
  return (
    <div className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-xs ${getAlertColor(alert.level)}`}>
      <span className="mt-0.5 flex-shrink-0">{icon}</span>
      <span>{alert.message}</span>
    </div>
  )
}
