import index from '@/data/snapshot/player-search-index.json'
import { NextRequest } from 'next/server'

export const dynamic = 'force-static'

function normalize(s: string): string {
  return s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

export function GET(req: NextRequest) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q') || ''
  const limit = parseInt(url.searchParams.get('limit') || '12', 10)
  const needle = normalize(q)
  if (!needle) return Response.json([])

  const matches = (index as any[])
    .filter(p => normalize(p.name).includes(needle))
    .sort((a, b) => (b.elo ?? 0) - (a.elo ?? 0))
    .slice(0, limit)
  return Response.json(matches)
}
