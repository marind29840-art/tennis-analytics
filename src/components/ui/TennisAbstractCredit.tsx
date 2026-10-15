import Link from 'next/link'

interface Props {
  /** ISO datetime when the data was last scraped */
  scrapedAt?: string
  /** Optional source URL on tennisabstract.com */
  sourceUrl?: string
}

/**
 * Discrete attribution required by Tennis Abstract's CC BY-NC-SA 4.0 license.
 * Render at the bottom of any page that displays Tennis Abstract data.
 */
export function TennisAbstractCredit({ scrapedAt, sourceUrl }: Props) {
  const formatted = scrapedAt
    ? new Date(scrapedAt).toLocaleString('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null

  return (
    <div className="mt-6 pt-4 border-t border-slate-800/50 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
      <div>
        {formatted && (
          <>
            <span className="text-slate-400">Données mises à jour le </span>
            <span className="text-slate-300 font-mono">{formatted}</span>
            <span className="text-slate-700"> · </span>
          </>
        )}
        <span>
          Source :{' '}
          <a
            href={sourceUrl || 'https://tennisabstract.com/'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-blue-400 transition-colors underline-offset-2 hover:underline"
          >
            Tennis Abstract / Jeff Sackmann
          </a>{' '}
          <span className="text-slate-600">(CC BY-NC-SA 4.0)</span>
        </span>
      </div>
      <Link href="/sources" className="text-slate-500 hover:text-slate-300 transition-colors">
        Toutes les sources →
      </Link>
    </div>
  )
}
