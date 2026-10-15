import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-16 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-amber-950/50 border border-amber-900/50 rounded-xl p-4 mb-6">
          <p className="text-amber-300 text-sm text-center font-medium">
            ⚠️ Jeu Responsable — Ces analyses sont fournies à titre statistique uniquement.
            Elles ne garantissent aucun résultat. Les paris sportifs comportent un risque de perte financière.
            Jouez de manière responsable et dans les limites de vos moyens.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Tennis Analytics © {new Date().getFullYear()} · Outil d&apos;analyse statistique
          </div>
          <div className="flex items-center gap-3">
            <span>
              Données :{' '}
              <a
                href="https://tennisabstract.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-400 transition-colors"
              >
                Tennis Abstract / Jeff Sackmann
              </a>{' '}
              <span className="text-slate-700">(CC BY-NC-SA 4.0)</span> · ATP Tour
            </span>
            <Link href="/sources" className="hover:text-slate-400 transition-colors underline-offset-2 hover:underline">
              Toutes les sources
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
