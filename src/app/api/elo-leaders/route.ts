import menData from '@/data/snapshot/elo-leaders-men.json'
import womenData from '@/data/snapshot/elo-leaders-women.json'
import { NextRequest } from 'next/server'

export const dynamic = 'force-static'

export function GET(req: NextRequest) {
  const url = new URL(req.url)
  const gender = (url.searchParams.get('gender') || 'men').toLowerCase()
  if (gender === 'women') return Response.json(womenData)
  return Response.json(menData)
}
