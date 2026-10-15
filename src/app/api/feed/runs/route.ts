import data from '@/data/snapshot/feed-runs.json'
export const dynamic = 'force-static'
export function GET() {
  return Response.json(data)
}
