'use client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { RankingPoint } from '@/lib/types'
import { formatMatchDate } from '@/lib/utils'

interface RankingChartProps {
  data: RankingPoint[]
  playerName?: string
}

export function RankingChart({ data, playerName }: RankingChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
        Données de classement indisponibles
      </div>
    )
  }

  const rankings = data.map(d => d.ranking)
  const minRanking = Math.min(...rankings)
  const maxRanking = Math.max(...rankings)
  const padding = Math.max(10, Math.round((maxRanking - minRanking) * 0.2))

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => {
              try { return formatMatchDate(v).slice(0, 6) } catch { return v }
            }}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
          />
          <YAxis
            reversed
            domain={[minRanking - padding, maxRanking + padding]}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
            tickFormatter={(v) => `#${v}`}
            width={40}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#94a3b8' }}
            itemStyle={{ color: '#3b82f6' }}
            formatter={(value: number) => [`#${value}`, playerName || 'Classement']}
            labelFormatter={(label) => formatMatchDate(label)}
          />
          <Line
            type="monotone"
            dataKey="ranking"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
