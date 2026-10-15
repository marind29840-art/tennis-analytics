'use client'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { RadarDimensions } from '@/lib/types'

interface RadarCompareChartProps {
  p1Name: string
  p2Name: string
  p1Data: RadarDimensions
  p2Data: RadarDimensions
}

const DIMENSION_LABELS: Record<keyof RadarDimensions, string> = {
  service: 'Service',
  return: 'Retour',
  form: 'Forme',
  surface: 'Surface',
  consistency: 'Constance',
  experience: 'Expérience',
}

export function RadarCompareChart({ p1Name, p2Name, p1Data, p2Data }: RadarCompareChartProps) {
  const keys = Object.keys(DIMENSION_LABELS) as (keyof RadarDimensions)[]

  const data = keys.map(key => ({
    dimension: DIMENSION_LABELS[key],
    [p1Name.split(' ').pop() || 'J1']: p1Data[key],
    [p2Name.split(' ').pop() || 'J2']: p2Data[key],
  }))

  const p1Short = p1Name.split(' ').pop() || 'J1'
  const p2Short = p2Name.split(' ').pop() || 'J2'

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#1e293b" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }}
            formatter={(value: number) => [`${value.toFixed(0)}/100`]}
          />
          <Radar
            name={p1Short}
            dataKey={p1Short}
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name={p2Short}
            dataKey={p2Short}
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Legend
            wrapperStyle={{ color: '#94a3b8', fontSize: 12 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
