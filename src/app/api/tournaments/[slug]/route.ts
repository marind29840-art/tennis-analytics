import tournaments from '@/data/snapshot/tournament-details.json'

export const dynamic = 'force-static'

export function GET(_req: Request, { params }: { params: { slug: string } }) {
  const t = (tournaments as Record<string, any>)[params.slug]
  if (!t) {
    return Response.json({ detail: 'Tournament not found' }, { status: 404 })
  }
  return Response.json(t)
}

export function generateStaticParams() {
  return Object.keys(tournaments as object).map(slug => ({ slug }))
}
