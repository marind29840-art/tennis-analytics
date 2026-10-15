import players from '@/data/snapshot/player-profiles.json'

export const dynamic = 'force-static'

export function GET(_req: Request, { params }: { params: { slug: string } }) {
  const profile = (players as Record<string, any>)[params.slug]
  if (!profile) {
    return Response.json({ detail: 'Player not found' }, { status: 404 })
  }
  return Response.json(profile)
}

export function generateStaticParams() {
  return Object.keys(players as object).map(slug => ({ slug }))
}
