import { clsx } from 'clsx'

interface Props {
  /** Tennis score string, e.g. "6-4 7-6(5)" or "0-6 6-4 7-6(4)" or "6-3 ret." */
  score: string | null | undefined
  /** When true, the side that "won" (first number > second) gets the highlight. */
  highlightWinner?: boolean
}

interface ParsedSet {
  player1: number | string
  player2: number | string
  tiebreak?: number
  ret?: boolean
}

function parseScore(score: string): ParsedSet[] {
  const sets: ParsedSet[] = []
  // Split on whitespace into chunks, each chunk = one set "6-4" or "7-6(5)"
  const chunks = score.trim().split(/\s+/)

  for (const chunk of chunks) {
    if (/^(ret|RET|abd|abandon)\.?$/.test(chunk)) {
      // Mark the LAST set as a retirement
      if (sets.length > 0) sets[sets.length - 1].ret = true
      continue
    }
    const m = chunk.match(/^(\d+)-(\d+)(?:\((\d+)\))?$/)
    if (m) {
      sets.push({
        player1: parseInt(m[1], 10),
        player2: parseInt(m[2], 10),
        tiebreak: m[3] ? parseInt(m[3], 10) : undefined,
      })
    }
  }
  return sets
}

/**
 * Renders a tennis score as a row of stacked set boxes — like ATP/WTA scoreboards.
 *   ┌─┬─┐
 *   │6│7│⁵   ← winner row
 *   │4│6│    ← loser row
 *   └─┴─┘
 */
export function Score({ score, highlightWinner = true }: Props) {
  if (!score) return <span className="text-slate-600 text-xs">—</span>

  const sets = parseScore(score)
  if (sets.length === 0) {
    // Couldn't parse — fall back to plain mono
    return <span className="font-mono text-xs text-slate-300">{score}</span>
  }

  return (
    <span className="inline-flex items-center gap-0.5" title={score}>
      {sets.map((s, i) => {
        const p1 = typeof s.player1 === 'number' ? s.player1 : 0
        const p2 = typeof s.player2 === 'number' ? s.player2 : 0
        const p1Won = highlightWinner && p1 > p2
        const p2Won = highlightWinner && p2 > p1

        return (
          <span key={i} className="inline-flex flex-col items-center font-mono text-[11px] leading-tight relative">
            {/* Top row = player1's score (we follow caller convention) */}
            <span
              className={clsx(
                'w-5 h-4 flex items-center justify-center rounded-t-sm',
                p1Won
                  ? 'bg-ball-300/90 text-slate-900 font-bold'
                  : 'bg-slate-800 text-slate-300',
              )}
            >
              {s.player1}
            </span>
            <span
              className={clsx(
                'w-5 h-4 flex items-center justify-center rounded-b-sm border-t border-slate-900/50',
                p2Won
                  ? 'bg-ball-300/90 text-slate-900 font-bold'
                  : 'bg-slate-800 text-slate-400',
              )}
            >
              {s.player2}
            </span>
            {s.tiebreak !== undefined && (
              <sup className="absolute -top-1 -right-1.5 text-[8px] text-slate-500 font-normal bg-slate-950 px-0.5 rounded">
                {s.tiebreak}
              </sup>
            )}
            {s.ret && (
              <span className="absolute -bottom-3 right-0 text-[8px] text-amber-500 italic">ret.</span>
            )}
          </span>
        )
      })}
    </span>
  )
}
