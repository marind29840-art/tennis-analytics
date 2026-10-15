import data from '@/data/snapshot/feed-odds-status.json'
export const dynamic = 'force-static'
export function GET() {
  return Response.json(data)
}
