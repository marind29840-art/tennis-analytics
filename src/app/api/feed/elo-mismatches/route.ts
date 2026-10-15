import data from '@/data/snapshot/feed-elo-mismatches.json'
import { NextRequest } from 'next/server'

export const dynamic = 'force-static'

export function GET(req: NextRequest) {
  const url = new URL(req.url)
  const minGap = parseFloat(url.searchParams.get('min_gap') || '0.05')
  const out = (data as any[]).filter(m => Math.abs(m.gap ?? 0) >= minGap)
  return Response.json(out)
}
