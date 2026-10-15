import data from '@/data/snapshot/feed-status.json'
export const dynamic = 'force-static'
export function GET() {
  return Response.json(data)
}
