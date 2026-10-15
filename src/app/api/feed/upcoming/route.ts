import data from '@/data/snapshot/feed-upcoming.json'
import { NextRequest } from 'next/server'

export const dynamic = 'force-static'

export function GET(req: NextRequest) {
  const url = new URL(req.url)
  const tour = url.searchParams.get('tour')?.toLowerCase()
  const limit = parseInt(url.searchParams.get('limit') || '500', 10)

  let out = data as any[]
  if (tour && tour !== 'all') {
    out = out.filter(m => m.tour?.toLowerCase() === tour)
  }
  return Response.json(out.slice(0, limit))
}
