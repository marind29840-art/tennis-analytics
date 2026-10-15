'use client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

interface FormPoint {
  date: string
  form_score: number
  label?: string
}

interface FormChartProps {
  data: FormPoint[]
  playerName?: string
}

export function FormChart({ data, playerName }: FormChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-slate-500 text-sm">
        Données de forme indisponibles
      </div>
    )
  }

  return (
    <div className="h-36">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 11 }}
            labelStyle={{ color: '#94a3b8' }}
            itemStyle={{ color: '#10b981' }}
            formatter={(value: number) => [`${value.toFixed(0)}/100`, playerName || 'Forme']}
          />
          <ReferenceLine y={70} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.4} />
          <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.4} />
          <Line
            type="monotone"
            dataKey="form_score"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#10b981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
