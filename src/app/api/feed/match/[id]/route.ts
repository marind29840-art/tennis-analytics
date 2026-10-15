import matches from '@/data/snapshot/match-details.json'

export const dynamic = 'force-static'

export function GET(_req: Request, { params }: { params: { id: string } }) {
  const detail = (matches as Record<string, any>)[params.id]
  if (!detail) {
    return Response.json({ detail: 'Match not found' }, { status: 404 })
  }
  return Response.json(detail)
}

export function generateStaticParams() {
  return Object.keys(matches as object).map(id => ({ id }))
}
