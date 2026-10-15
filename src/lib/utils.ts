import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export function formatMatchTime(isoString: string): string {
  try {
    return format(parseISO(isoString), "HH:mm", { locale: fr })
  } catch {
    return "--:--"
  }
}

export function formatMatchDate(isoString: string): string {
  try {
    return format(parseISO(isoString), "d MMM yyyy", { locale: fr })
  } catch {
    return ""
  }
}

export function formatOdds(odds: number): string {
  return odds.toFixed(2)
}

export function formatProb(prob: number): string {
  return `${(prob * 100).toFixed(1)}%`
}

export function formatEdge(edge: number): string {
  const sign = edge >= 0 ? "+" : ""
  return `${sign}${(edge * 100).toFixed(1)}%`
}

export function getCountryFlag(countryCode: string): string {
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  } catch {
    return '🏳️'
  }
}

export function getSurfaceColor(surface: string): string {
  switch (surface.toLowerCase()) {
    case 'clay': return 'text-orange-400 bg-orange-950 border-orange-800'
    case 'hard': return 'text-blue-400 bg-blue-950 border-blue-800'
    case 'grass': return 'text-emerald-400 bg-emerald-950 border-emerald-800'
    case 'carpet': return 'text-purple-400 bg-purple-950 border-purple-800'
    default: return 'text-slate-400 bg-slate-800 border-slate-700'
  }
}

export function getConfidenceColor(score: number): string {
  if (score >= 70) return 'text-emerald-400 bg-emerald-950 border-emerald-800'
  if (score >= 50) return 'text-amber-400 bg-amber-950 border-amber-800'
  return 'text-slate-400 bg-slate-800 border-slate-700'
}

export function getRiskColor(score: number): string {
  if (score < 40) return 'text-emerald-400 bg-emerald-950 border-emerald-800'
  if (score <= 60) return 'text-amber-400 bg-amber-950 border-amber-800'
  return 'text-red-400 bg-red-950 border-red-800'
}

export function getAlertColor(level: string): string {
  switch (level) {
    case 'positive': return 'text-emerald-300 bg-emerald-950 border-emerald-800'
    case 'warning': return 'text-amber-300 bg-amber-950 border-amber-800'
    case 'critical': return 'text-red-300 bg-red-950 border-red-800'
    default: return 'text-blue-300 bg-blue-950 border-blue-800'
  }
}

export function winRate(wins: number, losses: number): string {
  const total = wins + losses
  if (total === 0) return "N/A"
  return `${((wins / total) * 100).toFixed(0)}%`
}

export function getScoreColor(score: number): string {
  if (score >= 70) return '#10b981'
  if (score >= 50) return '#f59e0b'
  return '#ef4444'
}

export function getFormTrendIcon(trend: string): string {
  switch (trend) {
    case 'improving': return '↑'
    case 'declining': return '↓'
    default: return '→'
  }
}

export function getFormTrendColor(trend: string): string {
  switch (trend) {
    case 'improving': return 'text-emerald-400'
    case 'declining': return 'text-red-400'
    default: return 'text-slate-400'
  }
}
