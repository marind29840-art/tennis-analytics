import data from '@/data/snapshot/health.json'
export const dynamic = 'force-static'
export function GET() {
  return Response.json(data)
}
