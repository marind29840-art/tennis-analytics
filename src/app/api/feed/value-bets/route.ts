import eloData from '@/data/snapshot/feed-value-bets-elo.json'
import taData from '@/data/snapshot/feed-value-bets-ta.json'
import { NextRequest } from 'next/server'

export const dynamic = 'force-static'

export function GET(req: NextRequest) {
  const url = new URL(req.url)
  const model = url.searchParams.get('model') || 'elo'
  const minEdge = parseFloat(url.searchParams.get('min_edge') || '0.05')
  const source = (model === 'ta' ? taData : eloData) as any[]
  const out = source.filter(vb => (vb.edge ?? 0) >= minEdge)
  return Response.json(out)
}
