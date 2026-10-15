import data from '@/data/snapshot/tournaments-current.json'
import { NextRequest } from 'next/server'

export const dynamic = 'force-static'

export function GET(req: NextRequest) {
  const url = new URL(req.url)
  const tour = url.searchParams.get('tour')?.toLowerCase() || 'all'
  if (tour === 'all') return Response.json(data)
  const payload = (data as Record<string, any>)[tour]
  if (!payload) {
    return Response.json(
      { detail: `tour must be one of atp|wta|challenger|all` },
      { status: 400 }
    )
  }
  return Response.json(payload)
}
