import data from '@/data/snapshot/atp-rankings.json'
export const dynamic = 'force-static'
export function GET() {
  return Response.json(data)
}
