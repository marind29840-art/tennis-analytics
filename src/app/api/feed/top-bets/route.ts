import data from '@/data/snapshot/feed-top-bets.json'
import { NextRequest } from 'next/server'

export const dynamic = 'force-static'

export function GET(req: NextRequest) {
  const url = new URL(req.url)
  const limit = parseInt(url.searchParams.get('limit') || '10', 10)
  const minEdge = parseFloat(url.searchParams.get('min_edge') || '0.05')
  const out = (data as any[])
    .filter(vb => (vb.edge ?? 0) >= minEdge)
    .slice(0, limit)
  return Response.json(out)
}
